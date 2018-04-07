const _ = require('lodash')
const fs = require('fs');
const bcrypt = require('bcrypt');

const visits = require('../app/modules/visits'); //moduł do przechowywania danych wizyt

const readDataFromFile = (pathToFile) => {
	return new Promise((resolve, reject) =>{
		fs.readFile(pathToFile, 'utf8', (err, data) => {
			if (err) reject(err);

			resolve(data);
		});
	});
}

const splitDataToArr = (readTextData) => {
// funkcja dzieląca zczytany plik z danymi na tabelę dwuwymiarową
// - rozdział wierszy na podstawie znaku końca linii
// - rozdział elementów w wierszu na podstawie tabulacji

	return readTextData.split("\r\n").map(line =>line.split("\t")); 
}

const findIcd10inVisits = (icd10toFind, visitsArr) => {
	
	return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
}

readDataFromFile('../data/data.csv')
.then(dataFromFile => {
	
	const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
	visits.importManyFromArray(dataRawArr);
	// visits.showAll();
	visits.findMultipleVisitsOfDay();
	visits.exportToJSON();
	visits.exportReportAsJSON();
	
	// console.log( findIcd10inVisits('Z10', visitsArr) );
	 
}).catch(err => {
	console.log(`Nie udało się odczytać pliku. Błąd: ${err}`);
	console.log(err);
	
}); 