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

	const verifyReadData = (firstLineData) => {
	// sprawdza czy nagłówek dokumentu zawiera odpowiednie dane - jeśli nie - rzuca error
		// console.log(firstLineData.split("\t"));
		const headersExpected = [ 	'Data',
									'Kod MZ',
									'Kod NFZ',
									'Nazwa',
									'ICD-10 1',
									'ICD-10 2',
									'ICD-10 3',
									'ICD-10 4',
									'ICD-9 1',
									'ICD-9 2',
									'ICD-9 3',
									'ICD-9 4',
									'ICD-9 5',
									'ICD-9 6',
									'ICD-9 7',
									'ICD-9 8',
									'ICD-9 9',
									'ICD-9 10',
									'Pacjent',
									'Pesel',
									'Personel',
									'Numer kuponu RUM' 
		];

		// porównanie nagłówków zczytanych z pierwszego wiersza z tablicą wymaganych nagłówków (czyli rodzielonym względem spacji pierwszym wierszem)
		if (JSON.stringify(headersExpected) !== JSON.stringify(firstLineData.split("\t"))) {
			throw new Error('Błędne nagłówki pliku z danymi. Sprawdź plik.');
		}
	}

	const visitsInLines = readTextData.split("\r\n"); //utworzenie tablicy, gdzie element to (text) danych poszczególnej wizyty
	verifyReadData(visitsInLines[0]);
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

		// przetworzenie odpowiednich kolumn na pola obiektu wizyty
		return {
			date: visit[0].split(' ')[0], //obcięcie zbędnej godziny ze stringa daty
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

const findMultipleVisits = (visitsArr) => {
	// iswd['841017']['2018-03-24'] = 1;
	const visitsCounter = []; //tablica do zliczania ilości wizyt danej osoby konkretnego dnia

	visitsArr.forEach(visit => {
		// console.log(visit.date, visit.pesel);
		if(!visitsCounter[visit.pesel]){
			visitsCounter[visit.pesel] = [];
		}
		if(!visitsCounter[visit.pesel][visit.date]){
			visitsCounter[visit.pesel][visit.date] = 1;
		} else {
			visitsCounter[visit.pesel][visit.date]++;
		}
	});
	// odfiltrowanie tak, żeby zostały tylko dni (w elemencie użytkownika) dla których było więcej niż 1 wizyta
	const filteredCounter = [];
	
	for(let x in visitsCounter){
		console.log(x, visitsCounter[x]);
		for(let y in visitsCounter[x]){
			console.log(y, visitsCounter[x][y]);
			
		}
	}



	console.log('Counter:');
	
	// console.log(visitsCounter);

	console.log('test:');
	console.log(visitsCounter['84101714011']);
	
	
}

const findIcd10inVisits = (icd10toFind, visitsArr) => {
	
	return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
}

readDataFromFile('../data/data.csv')
.then(dataFromFile => {
	console.clear();
	console.log('---START---');
	
	const visitsArr = convertReadDataToVisitsArr(dataFromFile); //zapisanie wizyt do tablicy obiektów wizyt
	// console.log( findIcd10inVisits('Z10', visitsArr) );
	findMultipleVisits(visitsArr);
	 
}).catch(err => {
	console.log(`Nie udało się odczytać pliku. Błąd: ${err}`);
	console.log(err);
	
}); 