const fs = require('fs');

class Visit{
    constructor(date, pesel, icd10, patientFirstName, patientLastName, staff, visitName){
        this.date = date;
        this.pesel = pesel; 
        this.icd10 = icd10;
        this.patientFirstName = patientFirstName;
        this.patientLastName = patientLastName;
        this.staff = staff;
        this.visitName = visitName;
    }
}

const visits = [];
const dataWithErrors = []; //wiersze danych, których nie udało się skonwertować na dane wizyty
const dataWithWarnings = []; //wiersze danych, które udało się skonwertować na dane wizyty, jednak wystąpiły pewne wątpliwości - stąd ostrzeżenia

const add = (date, pesel, icd10, patientFirstName, patientLastName, staff, visitName) => {
// dodaje wizytę, jako instancję klasy Visit do tablicy visits
// jeśli dane wizyty są niepoprawne dodaje je do dataWithErrors
// dane z ostrzeżeniami dodawane są do wizyt ale także do tablicy dataWithWarnings

    // zmienna zliczające ile poprawnie zwalidowanych rozpoznań jest w tablicy - argumencie icd10
    const icd10validatedCount = typeof icd10 === 'object' ? icd10.filter(currCode => (typeof currCode === 'string' && currCode.trim().length > 2 )).length : 0;

    // SPRAWDZENIE BŁĘDU DANYCH
    if(typeof date === 'string' && date.trim().length === 10 
    && typeof pesel === 'string' && pesel.trim().length === 11 
    && icd10validatedCount > 0
    && typeof patientFirstName === 'string' && patientFirstName.trim().length > 0
    && typeof patientLastName === 'string' && patientLastName.trim().length === 1
    && typeof staff === 'string' && staff.trim().length > 0 
    && typeof visitName === 'string' && visitName.trim().length > 0){
        visits.push(new Visit(date, pesel, icd10, patientFirstName, patientLastName, staff, visitName));

        // jeśli liczba zwalidowanych rozpoznań w tablicy argumentu icd10 jest różna od liczby zadanych w niej argumentów
        // czyli, że były rozpoznania, które nie przeszły walidacji - dane są dodawane do tablicy dataWithWarnings
        if(icd10validatedCount < icd10.length){
            dataWithWarnings.push({
                date,
                pesel,
                icd10,
                patientFirstName,
                patientLastName,
                staff,
                visitName
            });
        }

        return true;
} else {
    
    dataWithErrors.push({
        date,
        pesel,
        icd10,
        patientFirstName,
        patientLastName,
        staff,
        visitName
    });
    return false;
}
    
};

const importManyFromArray = (rawDataArr, hasHeader = true) => {
// funkcja importująca wizyty z tablicy dwuwymiarowej danych
// hasHeader - określa czy pierwszy wiersz tablicy zawiera nagłówek zamiast danych
// jeśli jest nagłówek dokonywana jest najpierw walidacja, czy dane są w odpowiednich kolumnach - jeśli jest ok - nagłówek jest usuwany, jeśli nie rzucany jest błąd

    const verifyHeaderAndDelete = (rawDataArr) => {
	    // sprawdza czy nagłówek dokumentu zawiera odpowiednie dane - jeśli tak - usuwa nagłówek, jeśli nie - rzuca error
		const headersExpected = [ 	'Data', 'Kod MZ', 'Kod NFZ', 'Nazwa', 'ICD-10 1', 'ICD-10 2', 'ICD-10 3', 'ICD-10 4', 'ICD-9 1', 'ICD-9 2', 'ICD-9 3', 'ICD-9 4', 'ICD-9 5', 'ICD-9 6', 'ICD-9 7', 'ICD-9 8', 'ICD-9 9', 'ICD-9 10', 'Pacjent', 'Pesel', 'Personel', 'Numer kuponu RUM' ];

		// porównanie nagłówków zczytanych z pierwszego wiersza z tablicą wymaganych nagłówków (czyli rodzielonym względem spacji pierwszym wierszem)
        if (JSON.stringify(headersExpected) === JSON.stringify(rawDataArr[0])) {
            
            rawDataArr.shift(); //usunięcie nagłówka
            return rawDataArr;

        } else {
			throw new Error('Błędne nagłówki pliku z danymi. Sprawdź plik.');
		}
	}
    
    const convertRowToVisitAndAddToVisits = (rawRowDataArr) => {
    // konwertuje dane z wiersza wizyty (tablica) na obiekt wizyty (klasa Visit), który zwraca
        
        // zczytanie wszystkich procedur I10 dla świadczenia
		const icd10 = [];
		for(let i=0; i < 4; i++){
			if(rawRowDataArr[4+i] !== ''){
				icd10.push(rawRowDataArr[4+i]);
			}
		}

		// przetworzenie odpowiednich kolumn na pola obiektu wizyty
		const date = rawRowDataArr[0].split(' ')[0]; //obcięcie zbędnej godziny ze stringa daty
		const pesel = rawRowDataArr[19]; //pierwsze sześć cyfr pesel
		const patientFirstName = rawRowDataArr[18] !== undefined ? rawRowDataArr[18].slice(rawRowDataArr[18].lastIndexOf(' ')) : ''; //imię - ostatni człon stringa patientLastName i imię
		const patientLastName = rawRowDataArr[18] !== undefined ? rawRowDataArr[18][0] : ''; //pierwsza litera nazwiska
		const staff = rawRowDataArr[20];
		const visitName = rawRowDataArr[3];
        
        // return new Visit(date, pesel, icd10, patientFirstName, patientLastName, staff, visitName);
        add(date, pesel, icd10, patientFirstName, patientLastName, staff, visitName);
    }

    rawDataArr = verifyHeaderAndDelete(rawDataArr);

    // konwersja wszystkich wierszy tabeli na wizytę i dodanie ich do tablicy visits
    rawDataArr.forEach(currRow => convertRowToVisitAndAddToVisits(currRow));

}

const showAll = () => {
    if(visits.length > 0){
        visits.forEach(currVis => console.log(JSON.stringify(currVis, undefined, 2)));
    } else {
        console.log('Brak wizyt');
        
    }
}

const getAll = () => {
// zwraca "shallow copy" tablicy visits
    return visits.slice();
}

const getData = {
    withErrors: () => dataWithErrors.slice(),
    withWarnings: () => dataWithWarnings.slice(),
}

const removeAll = () => {
// usuwa wszystkie elementy tablicy visits, czyści także tablice dataWithErrors i dataWithWarnings
    while( (visits.shift()) !== undefined ) { };
    while( (dataWithErrors.shift()) !== undefined ) { };
    while( (dataWithWarnings.shift()) !== undefined ) { };
}

const exportToJSON = () => {
    fs.writeFile('../exports/data.json', JSON.stringify({
        visits, 
        dataWithErrors,
        dataWithWarnings
    }), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
}

module.exports = {add, importManyFromArray, showAll, getAll, removeAll, getData, exportToJSON};