const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const yargs = require('yargs');

const visits = require('../app/modules/visits'); //moduł do przechowywania danych wizyt
const {readFile, saveFile, saveJSON, splitDataToArr} = require('../app/modules/utils');
const {anonymiseVisits} = require('./modules/anonymise');

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
// jeśli przekazano podczas uruchomienia parametr -a (lub -anonymise) - uruchomienie funkcjonalności anonimizowania pliku
	visits.removeAll();
	readFile('../../data/dataBeforeAn.csv')
		.then(dataFromFile => {
			// import wizyt
			const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
			visits.importManyFromArray(dataRawArr);

			const visitsAnonymised = anonymiseVisits(visits.getAll()); //anonimizacja wszystkich wizyt
			return saveFile(visits.convertAllToCsv(visitsAnonymised), '../../data/dataAfterAn.csv'); // konwersja wszystkich zanonimizowanych wizyt do CSV i zapisanie do pliku

		})
		.then(res => console.log(res))
		.catch(err => {
			console.log(err);
		}); 
} else {
// jeśli nie przekazano żadnego z powyższych parametrów

	const app = express();

	const findIcd10inVisits = (icd10toFind, visitsArr) => {
		
		return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
	}

	// route wyświetlająca JSON z raportem
	app.get('/', (req, res) => {
		
		visits.removeAll();
		readFile('../../data/data.csv')
			.then(dataFromFile => {
				
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				visits.importManyFromArray(dataRawArr);
				visits.findMultipleVisitsOfDay();
				const report = visits.generateReportObj();
				res.send(report);
				
			}).catch(err => {
				console.log(err);
				res.status(400).send(err);
			}); 
	});

	// route wyświetlająca JSON z wszystkimi wczytanymi wizytami
	app.get('/all', (req, res) => {
		
		visits.removeAll();
		readFile('../../data/data.csv')
			.then(dataFromFile => {
				
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				visits.importManyFromArray(dataRawArr);
				res.send(visits.getAll());
				
			}).catch(err => {
				console.log(err);
				res.status(400).send(err);
			}); 
	});

	if(!module.parent){
		app.listen(3000, () => {
			console.log(`Started on port 3000`);
		});
	}

	module.exports = {app};
}
