const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');

const visits = require('../app/modules/visits'); //moduł do przechowywania danych wizyt
const {readFile} = require('../app/modules/utils');

const app = express();

const splitDataToArr = (readTextData) => {
// funkcja dzieląca zczytany plik z danymi na tabelę dwuwymiarową
// - rozdział wierszy na podstawie znaku końca linii
// - rozdział elementów w wierszu na podstawie tabulacji

	return readTextData.split("\r\n").map(line =>line.split("\t")); 
}

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

if(!module.parent){
    app.listen(3000, () => {
        console.log(`Started on port 3000`);
    });
}

module.exports = {app};