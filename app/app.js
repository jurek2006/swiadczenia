const _ = require('lodash')
const fs = require('fs');
const bcrypt = require('bcrypt');


fs.readFile('../data/data.csv', 'utf8', (err, data) => {
	if (err) throw err;
	
	const readData = data.split("\r\n");
	// tutaj weryfikacja pierwszego wiersza (nagłówka) - DODAĆ
	readData.shift(); //usunięcie nagłówka
	const outputData = readData.map(line => {
		const split = line.split("\t");
		// zczytanie wszystkich procedur I10 dla świadczenia
		const icd10 = [];
		for(let i=0; i < 4; i++){
			if(split[4+i] !== ''){
				icd10.push(split[4+i]);
			}
		}

		return {
			data: split[0].split(' ')[0], //obcięcie zbędnej godziny ze stringa daty
			pesel: split[19], //pierwsze sześć cyfr pesel
			// pesel: split[19] !== undefined ? split[19].slice(0,6) : '', //pierwsze sześć cyfr pesel
			icd10,
			imie: split[18] !== undefined ? split[18].slice(split[18].lastIndexOf(' ')) : '', //imię - ostatni człon stringa nazwisko i imię
			nazwisko: split[18] !== undefined ? split[18][0] : '', //pierwsza litera nazwiska
			personel:  split[20],
			nazwa: split[3]
		}
	});
	console.clear();
	// console.log(JSON.stringify(outputData, undefined, 2));
	
	// znalezienie wszystkich Z10
    console.log(outputData.filter(line => line.icd10.includes('Z10')));
    
});
