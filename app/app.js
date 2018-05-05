const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const express = require('express');

const visits = require('../app/modules/visits'); //moduł do przechowywania danych wizyt
const {readFile, saveFile, saveJSON, splitDataToArr} = require('../app/modules/utils');
const {anonymiseVisits} = require('./modules/anonymise');

const importAnonymiseAndSave = (pathToFileToAnonymise, pathToSaveAfter) => {
	
	if(!pathToSaveAfter){
		// jeśli niezdefiniowano ścieżki zapisu tworzy ją na podstawie ścieżki do odczytywanego pliku - dodając domyślny przyrostek
		// np. '../tests/anonymiseTestsData/test1.csv' > '../tests/anonymiseTestsData/test1_an.csv'

		const suffixDefault = '_an';
		pathToSaveAfter = pathToFileToAnonymise.substring(0, pathToFileToAnonymise.lastIndexOf('.')).concat(suffixDefault, pathToFileToAnonymise.substring(pathToFileToAnonymise.lastIndexOf('.')))
	}

	return new Promise((resolve, reject) => {
		visits.removeAll();
		readFile(pathToFileToAnonymise)
			.then(dataFromFile => {
				// import wizyt
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				visits.importManyFromArray(dataRawArr);

				const visitsAnonymised = anonymiseVisits(visits.getAll()); //anonimizacja wszystkich wizyt
				return saveFile(visits.convertAllToCsv(visitsAnonymised), pathToSaveAfter); // konwersja wszystkich zanonimizowanych wizyt do CSV i zapisanie do pliku

			})
			.then(res => {resolve(
				{					
					fileSaved: res.fileSaved, 
					message: `Plik ${pathToFileToAnonymise} został zanonimizowany i zapisany do ${res.fileSaved}`,
					absoluteFileSavedPath: res.absoluteFileSavedPath //ścieżka absolutna do zapisanego pliku
				}
			)})
			.catch(err => {
				
				reject(err);
		}); 
	})
}

const routeFileManager = (req, res, route, givenPath, allowedExtensions, actionForFiles, contentHtml) => {
	// funkcja menedżera plików w określonej route - pozwala nawigować po drzewie folderów (zaczynając w givenPath) i wyświetlać określone w allowedExtensions typy plików (wszystkie, gdy nie określono żadnego)
	// po kliknięciu w plik uruchamia dla niego akcję actionForFiles
	// contentHtml to html wyświetlany na górze strony w zadanej route (jeśli nie zdefiniowany to standardowy nagłówek FileManager)

	const dirGetContent = (pathRelative, fileExtAccepted = []) => {
	// funkcja zwraca promisę, która pobiera zawartość zadanego folderu
	// promisa (gdy zakończona sukcesem) zwraca obiekt zawierający tablice dirs (podfoldery) i files (pliki w folderze)
	// tablica fileExtAccepted określa pliki z jakim rozszerzeniem są pobierana (jeśli nieprzekazana lub pusta to wszystkie)
	// akceptuje tablicę np. ['csv', 'ods'] lub ['.csv', '.ods']
	
		// akceptowanie rozrzerzeń plików z kropką i bez kropki
		const allowedExtensions = fileExtAccepted.map(currExt => {
			if(currExt[0] === '.'){
				return currExt;
			} else {
				return '.' + currExt;
			}
		})
	
		return new Promise((resolve, reject) => {
			const dirPath = path.join(__dirname, pathRelative);
			fs.readdir(dirPath, (err, items) => {
			// wczytanie zawartości (elementów) folderu do items
				if(err){
					reject(err);
				}
	
				// odfiltrowanie folderów i plików do osobnych tablic
				const dirs = items.filter(item => fs.statSync(dirPath + '/' + item).isDirectory());
				let files = items.filter(item => fs.statSync(dirPath + '/' + item).isFile());
	
				// jeśli zdefiniowano akceptowane typy (rozszerzenia) plików, to wybranie tylko ich
				if(allowedExtensions && allowedExtensions.length > 0){
					files = files.filter(currFile => allowedExtensions.includes(path.extname(currFile))); //zostawia w tablicy files tylko pliki z rozszerzeniami, które są w fileExtAccepted
				} 
	
				resolve({dirs, files, path: dirPath, allowedExtensions});
			})
		});
	}
	
	const globalPath = path.join(__dirname, givenPath);

	try{
		if(fs.statSync(globalPath).isDirectory()){
		// jeśli przekazano w path folder - umożliwia przechodzenie po folderach i wybranie z nich pliku o zadanym w dirGetContent rozszerzeniu

			dirGetContent(givenPath, ['.csv']).then(response => {
				let htmlContent = '';

				// podfoldery w zadanym folderze
				htmlContent += `<h2>Podfoldery:</h2>`;
				htmlContent += `<li><a href="${route}${encodeURIComponent(givenPath + '/..')}">..</a></li>`;
				response.dirs.forEach(item => {
					htmlContent += `<li><a href="${route}${encodeURIComponent(givenPath + '/' + item)}">${item}</a></li>`;
				});
				
				// pliki w zadanym folderze
				htmlContent += `<h2>Pliki${response.allowedExtensions.length ? ' (' + response.allowedExtensions + ')' : ''}:</h2>`;
				if(response.files.length > 0){
					response.files.forEach(item => {
						htmlContent += `<li><a href="${route}${encodeURIComponent(givenPath + '/' + item)}">${item}</a></li>`;
					});
				} else {
					htmlContent += `<li>Nie znaleziono plików ${response.allowedExtensions.length ? 'o rozszerzeniach ' + response.allowedExtensions : ''}</li>`;
				}
				
				// standardowy html wstawiany do strony file managera - jeśli zdefiniowano contentHtml to jest nim zastępowany
				let inputHtml = '<h1>FileManager</h1>';
				if(contentHtml){
					inputHtml = contentHtml;
				}
				
				res.send(`${inputHtml}
				<p>Folder: ${response.path}</p>
				${htmlContent}`);
				
			}).catch(err => {res.send(err)});
		} else if(fs.statSync(globalPath).isFile()){
		// jeśli przekazano w path plik wykonanie funkcji actionForFiles, której przekazywany jest res route i ścieżka do pliku givenPath
			if(actionForFiles){
				// jeśli zdefiniowano callback actionForFiles
				actionForFiles(res, givenPath);
			} else {
				res.send(`Plik ${globalPath}. Nie zdefiniowano callbacku actionForFiles`);
			}
		}
	}catch(err){
		// inny błąd - przede wszystkim - nie znaleziono pliku/folderu
		res.status(404).send(`<h1>FileManager: - błąd</h1>
			<h3>Błąd:</h4> ${err}`);
	}
}

const app = express();

// const findIcd10inVisits = (icd10toFind, visitsArr) => {
	
// 	return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
// }

// route GET / - strona główna z odnośnikami do innych funkcjonalności
app.get('/', (req, res) => {
	res.send(
		`<h1>Świadczenia App</h1>
		<ul>
			<li><a href="/anonymise/">Anonimizuj pliki csv z danymi wizyt</a></li>
			<li><a href="/report/">Wygeneruj raport z danych wizyt</a></li>
		</ul>
		`
	);
});

// route GET /report - robi przekierowanie do GET '/report/:path' - czyli powoduje wyświetlenia zawartości domyślnego folderu (tutaj z ręki '../data/')
app.get('/report', (req, res) => {

	res.redirect('/report/' + encodeURIComponent('../data/'));

});

// route GET /report/:path - wyświetla zawartość przekazanego w path folderu (ścieżka względna względem /app i enkodowana)
// dzięki routeFileManager możliwe jest nawigowanie po drzewie folderów
// jeśli przekazano plik .csv generuje i zwraca raport z wizyt w formie JSON
app.get('/report/:path', (req, res) => {
	const givenPath = path.join(decodeURIComponent(req.params.path));
	const globalPath = path.join(__dirname, givenPath);

	// routeFileManager pozwala nawigować w drzewie folderów i wybrać plik csv do anonimizacji
	routeFileManager(req, res, '/report/', givenPath, ['.csv'], (res, givenPath) => {
		// res.send(`Callback dla pliku ${givenPath}`);

			visits.removeAll();
			// DO POPRAWY - readFile używa ścieżki określonej względem folderu położenia utils.js, a ścieżka givenPath podana jest względem app
			// dlatego użyte jest, aby działało '..' 
			readFile(path.join('..', givenPath))
			.then(dataFromFile => {
				
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				const imported = visits.importManyFromArray(dataRawArr);

				visits.findMultipleVisitsOfDay();
				const report = visits.generateReportObj();

				res.send({
					report
				});
				
			}).catch(err => {
					console.log(err.message);
					res.status(404).send({error: err.message});
			}); 
	}, 
	`<h1>Generuj raport</h1>
		<p>Wybierz plik z danymi wizyt .csv do wygenerowania raportu.</p>
	`);
	
});

// route GET /read/:filename' - importuje wizyty z pliku :filename i zwraca je w odpowiedzi
// app.get('/read/:filename', (req, res) => {
// 	const filename = req.params.filename;
	
// 	visits.removeAll();
// 	readFile('../../data/' + filename)
// 		.then(dataFromFile => {
			
// 			const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
// 			const imported = visits.importManyFromArray(dataRawArr);

// 			res.send({
// 				visits: visits.getAll(),
// 				dataWithWarnings: visits.getData.withWarnings(),
// 				dataWithErrors: visits.getData.withErrors(),
// 			});
			
// 		}).catch(err => {
// 			console.log(err.message);
// 			res.status(404).send({error: err.message});
// 	}); 
// });

// route GET /anonymise - robi przekierowanie do GET '/anonymise/:path' - czyli powoduje wyświetlenia zawartości domyślnego folderu (tutaj z ręki '../data/')
app.get('/anonymise', (req, res) => {

	res.redirect('/anonymise/' + encodeURIComponent('../data/'));

});

// route GET /anonymise/:path - wyświetla zawartość przekazanego w path folderu (ścieżka względna względem /app i enkodowana)
// dzięki routeFileManager możliwe jest nawigowanie po drzewie folderów
// jeśli przekazano plik .csv dokonywane jest anonimizowanie danych z pliku i zapisanie zanonimizowanego z domyślną nazwą *_an.csv w tym samym folderze
app.get('/anonymise/:path', (req, res) => {
	const givenPath = path.join(decodeURIComponent(req.params.path));
	const globalPath = path.join(__dirname, givenPath);

	// routeFileManager pozwala nawigować w drzewie folderów i wybrać plik csv do anonimizacji
	routeFileManager(req, res, '/anonymise/', givenPath, ['.csv'], (res, givenPath) => {
		// DO POPRAWY - importAnonymiseAndSave używa saveFile, który zapisuje do ścieżki określonej względem folderu położenia utils.js, a ścieżka givenPath podana jest względem app
			// dlatego użyte jest, aby działało '..' 
			importAnonymiseAndSave(path.join('..', givenPath)).then(response => {
				// jeśli udało się zanonimizować i zapisać plik
				res.send(`<h1>Anonymise</h1>
				<p>Plik<br><strong>${path.join(__dirname, givenPath)}</strong> został zapisany i zanonimizowany do pliku:<br><strong>${response.absoluteFileSavedPath}</strong></p>`);
			}).catch(err => {
				// nie udało się zanonimizować i zapisać plik
				res.status(400).send(`<h1>Anonimizacja - błąd</h1>
				<p>Błąd przy próbie anonimizacji pliku<br><strong>${path.join(__dirname, givenPath)}</strong></p>
				<h3>Błąd:</h4> ${err}`);
			});
	}, 
	`<h1>Anonimizuj</h1>
	<p>Wybierz plik z danymi wizyt .csv do zanonimizowania.</p>`
	);

});

if(!module.parent){
	app.listen(3000, () => {
		console.log(`Started on port 3000`);
	});
}

module.exports = {app, importAnonymiseAndSave};

