const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const yargs = require('yargs');

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
					message: `Plik ${pathToFileToAnonymise} został zanonimizowany i zapisany do ${res.fileSaved}`
				}
			)})
			.catch(err => {
				
				reject(err);
		}); 
	})
}

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

const app = express();

// const findIcd10inVisits = (icd10toFind, visitsArr) => {
	
// 	return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
// }

// route GET /report/:filename' - importuje wizyty z pliku :filename i zwraca raport
app.get('/report/:filename', (req, res) => {
	const filename = req.params.filename;
	
	visits.removeAll();
	readFile('../../data/' + filename)
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
});

// route GET /read/:filename' - importuje wizyty z pliku :filename i zwraca je w odpowiedzi
app.get('/read/:filename', (req, res) => {
	const filename = req.params.filename;
	
	visits.removeAll();
	readFile('../../data/' + filename)
		.then(dataFromFile => {
			
			const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
			const imported = visits.importManyFromArray(dataRawArr);

			res.send({
				visits: visits.getAll(),
				dataWithWarnings: visits.getData.withWarnings(),
				dataWithErrors: visits.getData.withErrors(),
			});
			
		}).catch(err => {
			console.log(err.message);
			res.status(404).send({error: err.message});
	}); 
});

// route GET /anonymise - robi przekierowanie do GET '/anonymise/:path' - czyli powoduje wyświetlenia zawartości domyślnego folderu (tutaj z ręki '../data/')
app.get('/anonymise', (req, res) => {

	res.redirect('/anonymise/' + encodeURIComponent('../data/'));

})

// route GET /anonymise/:path - wyświetla zawartość przekazanego w path folderu (ścieżka względna względem /app i enkodowana)
app.get('/anonymise/:path', (req, res) => {
	const givenPath = path.join(decodeURIComponent(req.params.path));

	dirGetContent(givenPath, ['.csv']).then(response => {
		let htmlContent = '';

		htmlContent += `<h2>Pliki${response.allowedExtensions.length ? ' (' + response.allowedExtensions + ')' : ''}:</h2>`;
		if(response.files.length > 0){
			response.files.forEach(item => {
				htmlContent += `<li>${item} <a href="/info/${encodeURIComponent(givenPath + '/' + item)}">Info</a></li>`;
			});
		} else {
			htmlContent += `<li>Nie znaleziono plików ${response.allowedExtensions.length ? 'o rozszerzeniach ' + response.allowedExtensions : ''}</li>`;
		}

		htmlContent += `<h2>Podfoldery:</h2>`;
		htmlContent += `<li><a href="/anonymise/${encodeURIComponent(givenPath + '/..')}">..</a></li>`;
		response.dirs.forEach(item => {
			htmlContent += `<li><a href="/anonymise/${encodeURIComponent(givenPath + '/' + item)}">${item}</a></li>`;
		});
		res.send(`<h1>Anonymise</h1>
					<p>Folder: ${response.path}</p>
					${htmlContent}`);
		
	}).catch(err => {res.send(err)});

})

// TESTOWE //TYMCZASOWE
// ścieżka przekazująca info o pliku/folderze (przede wszystkim, czy jest plikiem, czy folderem)
app.get('/info/:path', (req, res) => {
	const givenPath = path.join(decodeURIComponent(req.params.path));

	fs.stat(givenPath, function(err, stats) {
		console.log(path);
		console.log();
		console.log(stats);
		console.log();
	 
		let isFileOrDirectory;
		if (stats.isFile()) {
			isFileOrDirectory = 'plikiem';
			console.log('    file');
		}
		if (stats.isDirectory()) {
			isFileOrDirectory = 'folderem';
			console.log('    directory');
		}

		res.send(`<h1>Info</h1>${givenPath} jest ${isFileOrDirectory}`);
	});

});


if(!module.parent){
	app.listen(3000, () => {
		console.log(`Started on port 3000`);
	});
}

module.exports = {app, importAnonymiseAndSave};

