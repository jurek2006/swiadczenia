const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const visits = require('../app/modules/visits'); //moduł do przechowywania danych wizyt
const {readFile} = require('../app/modules/utils');



const splitDataToArr = (readTextData) => {
// funkcja dzieląca zczytany plik z danymi na tabelę dwuwymiarową
// - rozdział wierszy na podstawie znaku końca linii
// - rozdział elementów w wierszu na podstawie tabulacji

	return readTextData.split("\r\n").map(line =>line.split("\t")); 
}

const findIcd10inVisits = (icd10toFind, visitsArr) => {
	
	return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
}

readFile('../../data/data.csv')
.then(dataFromFile => {
	
	const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
	visits.importManyFromArray(dataRawArr);
	// visits.showAll();
	visits.findMultipleVisitsOfDay();
	visits.saveAllToJSON();
	visits.saveReportAsJSON();
	
	 
}).catch(err => {
	console.log(`Nie udało się odczytać pliku. Błąd: ${err}`);
	console.log(err);
	
}); 