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

const dirGetContent = pathRelative => {
// funkcja zwraca promisę, która pobiera zawartość zadanego folderu (zwraca tę zawartość jako tablicę)

	return new Promise((resolve, reject) => {
		const dirPath = path.join(__dirname, pathRelative);
		fs.readdir(dirPath, (err, items) => {
			if(err){
				reject(err);
			}
			resolve(items)
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

	dirGetContent(givenPath).then(response => {
		let dirList = `<li><a href="/anonymise/${encodeURIComponent(givenPath + '/..')}">..</a></li>`;
		response.forEach(item => {
			dirList += `<li><a href="/anonymise/${encodeURIComponent(givenPath + '/' + item)}">${item}</a></li>`;
		});
		dirList = `<h2>Zawartość folderu:</h2><ul>${dirList}</ul>`;
		res.send('<h1>Anonymise</h1>' + dirList);
		
	}).catch(err => {res.send(err)});

})


if(!module.parent){
	app.listen(3000, () => {
		console.log(`Started on port 3000`);
	});
}

module.exports = {app, importAnonymiseAndSave};

