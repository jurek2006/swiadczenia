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
			.then(res => resolve(res))
			.catch(err => {
				reject(err);
		}); 
	})
}

const argv = yargs	
	.options({
		a: {
			alias: 'anonymise',
			describe: 'Wczytuje plik csv wizyt - anonimizuje go testowo (z odwzorowaniem peseli i podmianą imienia i nazwiska) i zapisuje do kolejnego pliku csv',
			boolean: true
		}
	})
	.help()
	.alias('help', 'h')
	.argv;

if(argv.anonymise){
	importAnonymiseAndSave('../../data/dataBeforeAn.csv', '../../data/dataAfterAn.csv')
		.then(res => console.log(res))
		.catch(err => console.log(err));

} else {
// jeśli nie przekazano żadnego z powyższych parametrów

	const app = express();

	const findIcd10inVisits = (icd10toFind, visitsArr) => {
		
		return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
	}

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
				if(err.message === 'Błędne nagłówki pliku z danymi. Sprawdź plik.'){
					res.status(400).send(err);
				} else {
					res.status(404).send(err);
				}
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
				if(err.message === 'Błędne nagłówki pliku z danymi. Sprawdź plik.'){
					res.status(400).send(err);
				} else {
					res.status(404).send(err);
				}
			}); 
	});


	if(!module.parent){
		app.listen(3000, () => {
			console.log(`Started on port 3000`);
		});
	}

	module.exports = {app, importAnonymiseAndSave};
}
