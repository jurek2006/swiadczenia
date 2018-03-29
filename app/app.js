const _ = require('lodash')
const fs = require('fs');
const bcrypt = require('bcrypt');

const readDataFromFile = (pathToFile) => {
	return new Promise((resolve, reject) =>{
		fs.readFile(pathToFile, 'utf8', (err, data) => {
			if (err) reject(err);

			resolve(data);
		});
	});
}

const convertReadDataToVisitsArr = (readTextData) => {

	const visitsInLines = readTextData.split("\r\n"); //utworzenie tablicy, gdzie element to (text) danych poszczególnej wizyty
	// tutaj weryfikacja pierwszego wiersza (nagłówka) - DODAĆ
	visitsInLines.shift(); //usunięcie nagłówka	

	// przetworzenie danych wizyt na tablicę obiektów (gdzie każdy obiekt zawiera dane poszczególnej wizyty)
	// rozdzielenie poszczególnych pól względem tabulacji
	const visitsArr = visitsInLines.map(line => {
		const visit = line.split("\t");
		// zczytanie wszystkich procedur I10 dla świadczenia
		const icd10 = [];
		for(let i=0; i < 4; i++){
			if(visit[4+i] !== ''){
				icd10.push(visit[4+i]);
			}
		}

		return {
			data: visit[0].split(' ')[0], //obcięcie zbędnej godziny ze stringa daty
			pesel: visit[19], //pierwsze sześć cyfr pesel
			// pesel: visit[19] !== undefined ? visit[19].slice(0,6) : '', //pierwsze sześć cyfr pesel
			icd10,
			imie: visit[18] !== undefined ? visit[18].slice(visit[18].lastIndexOf(' ')) : '', //imię - ostatni człon stringa nazwisko i imię
			nazwisko: visit[18] !== undefined ? visit[18][0] : '', //pierwsza litera nazwiska
			personel:  visit[20],
			nazwa: visit[3]
		}
	});

	return visitsArr;
}

readDataFromFile('../data/data.csv')
.then(dataFromFile => {
	console.log(convertReadDataToVisitsArr(dataFromFile));
}).catch(err => {
	console.log(`Nie udało się odczytać pliku. Błąd: ${err}`);
	console.log(err);
	
});