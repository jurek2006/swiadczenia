const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const {isIcd10NotRequired, isPatronage} = require('../config/visitsConfig');
const {saveJSON} = require('../modules/utils');

class Visit{
    constructor(date, pesel, icd10, icd9, patientFirstName, patientLastName, staff, visitName){
        this.date = date;
        this.pesel = pesel; 
        this.icd10 = icd10;
        this.icd9 = icd9;
        this.patientFirstName = patientFirstName;
        this.patientLastName = patientLastName;
        this.staff = staff;
        this.visitName = visitName;
    }
}

const visits = [];
const dataWithErrors = []; //wiersze danych, których nie udało się skonwertować na dane wizyty
const dataWithWarnings = []; //wiersze danych, które udało się skonwertować na dane wizyty, jednak wystąpiły pewne wątpliwości - stąd ostrzeżenia
const multipleVisitsOfDayArr = []; //tablica w której zapisywane są 'wieloktorne wizyty w dniu' czyli jeśli jeden pacjent ma więcej niż jedną wizytę danego dnia

const add = (date, pesel, icd10, icd9, patientFirstName, patientLastName, staff, visitName) => {
// dodaje wizytę, jako instancję klasy Visit do tablicy visits
// jeśli dane wizyty są niepoprawne dodaje je do dataWithErrors
// dane z ostrzeżeniami dodawane są do wizyt ale także do tablicy dataWithWarnings

    // zmienna zliczające ile poprawnie zwalidowanych rozpoznań jest w tablicy - argumencie icd10
    const icd10validatedCount = (Array.isArray(icd10)) ? icd10.filter(currCode => (typeof currCode === 'string' && currCode.trim().length > 2 )).length : 0;

    // SPRAWDZENIE BŁĘDU DANYCH
    if(typeof date === 'string' && date.trim().length === 10 
        //dane są poprawne jeśli podano icd9 dla którego wymagane jest rozpoznanie icd10 (wtedy isIcd10NotRequired(icd9) === false ) i przekazano przynajmniej jeden poprawny kod icd10
        // lub podano icd9 dla którego nie jest wymagane (ani dozwolone) icd10 (wtedy isIcd10NotRequired(icd9) === true ) i nie przekazano żadnego icd10
        // wyjątkiem, kiedy dane są poprawne chociaż icd9 nie wymaga icd10, a te zostały przekazane są patronażami położnej lub pielęgniarki (kiedy isPatronage(icd10, icd9, visitName) === true)
    && ((!isIcd10NotRequired(icd9) && icd10validatedCount > 0 ) || (isIcd10NotRequired(icd9) && Array.isArray(icd10) && (icd10.length === 0 || isPatronage(icd10, icd9, visitName)) ))
    && typeof pesel === 'string' && pesel.trim().length === 11 
    && typeof icd9 === 'string' && icd9.trim().length === 5 && icd9[2] === '.' //sprawdzenie formatu kodu icd9 - musi być w stylu 89.00
    && typeof patientFirstName === 'string' && patientFirstName.trim().length > 0
    && typeof patientLastName === 'string' && patientLastName.trim().length === 1
    && typeof staff === 'string' && staff.trim().length > 0 
    && typeof visitName === 'string' && visitName.trim().length > 0){
        visits.push(new Visit(date, pesel, icd10, icd9, patientFirstName, patientLastName, staff, visitName));

        // jeśli liczba zwalidowanych rozpoznań w tablicy argumentu icd10 jest różna od liczby zadanych w niej argumentów
        // czyli, że były rozpoznania, które nie przeszły walidacji - dane są dodawane do tablicy dataWithWarnings
        if(icd10validatedCount < icd10.length){
            dataWithWarnings.push({
                date,
                pesel,
                icd10,
                icd9,
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
        icd9,
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
        const icd9 =  rawRowDataArr[8];
		const pesel = rawRowDataArr[19]; //pierwsze sześć cyfr pesel
		const patientFirstName = rawRowDataArr[18] !== undefined ? rawRowDataArr[18].slice(rawRowDataArr[18].lastIndexOf(' ') + 1) : ''; //imię - ostatni człon stringa patientLastName i imię
		const patientLastName = rawRowDataArr[18] !== undefined ? rawRowDataArr[18][0] : ''; //pierwsza litera nazwiska
		const staff = rawRowDataArr[20];
		const visitName = rawRowDataArr[3];
        
        // return new Visit(date, pesel, icd10, patientFirstName, patientLastName, staff, visitName);
        add(date, pesel, icd10, icd9, patientFirstName, patientLastName, staff, visitName);
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
    while( (multipleVisitsOfDayArr.shift()) !== undefined ) { };
}

const filterVisits = (visitsSearchObj) => {
// funkcja filtrująca wizyty z visits na podstawie zgodności właściwości visitsSearchObj z wizytą
    return _.filter(visits, visitsSearchObj);
}

const findMultipleVisitsOfDay = () => {
// funkcja wyszukuje w visits, wizyty kiedy jest więcej niż jedna w dniu dla tego samego pacjenta 
// i zapisuje to w zmiennej globalnej modułu multipleVisitsOfDayArr (zwraca też kopię tej tablicy)
// {date, pesel, visitsArr} gdzie visitsArr to tablica Visits danego pacjenta w danym dniu (określane przed date i pesel)
// w tej tablicy elementy tylko dla dubli (jeśli jest jedno świadczenie dla pacjenta danego dnia, nie jest to brane pod uwagę)

    let visitsTemp = getAll();

    while((currVisit = visitsTemp.shift()) !== undefined){
    // dopóki zdjęty pierwszy element tablicy nie jest undefined
        
        const foundDoubles = _.filter(visitsTemp, {date: currVisit.date, pesel: currVisit.pesel});
        if(foundDoubles.length > 1){
        // jeśli znaleziono jakieś duble dodanie ich do tablicy 

            // zapisanie pierwszej (znalezionej) wizyty do doubles
            multipleVisitsOfDayArr.push({ 
                date: currVisit.date,
                pesel: currVisit.pesel,
                visitsArr: [currVisit].concat(foundDoubles) //tablica z danymi wszystkich wizyt danego pacjenta w danym dniu 
            });

            _.pullAll(visitsTemp, foundDoubles); // usunięcie wszystkich dubli z tablicy visitsTemp (żeby ponownie dla niego nich nie były wyszukiwane duble)

        }
        
    }
    
    return multipleVisitsOfDayArr.slice(); //zwraca kopię multipleVisitsOfDayArr
}

const generateReportObj = () => {
// generuje raport z wizyt jako obiekt
    const reportObj = {};

    // raport z danych z błędami i ostrzeżeniami przy wczytywaniu
    reportObj.dataWithErrors = dataWithErrors;
    reportObj.dataWithWarnings = dataWithWarnings;

    // raport z wielokrotnych wizyt pacjenta w dniu
    reportObj.multipleVisits = {};
    
    const peselsArr = [...new Set(multipleVisitsOfDayArr.map(currEl => {return currEl.pesel}))]; //znalezienie peseli dla których znaleziono "wielokrotne wizyty w dniu"
    peselsArr.forEach(currPesel => {
        // dla każdego znalezionego peselu
        
        // REFAKTOR
        const test = _.filter(multipleVisitsOfDayArr, {pesel: currPesel});

        reportObj.multipleVisits[currPesel] = {};
        test.forEach(currDate => {
        reportObj.multipleVisits[currPesel][currDate.date] = [];
            
            currDate.visitsArr.forEach(currVisit => {

                reportObj.multipleVisits[currPesel][currDate.date].push(`${currVisit.staff} | ${currVisit.icd10} | ${currVisit.icd9} | ${currVisit.visitName}`);
            });
            
        });
    });

    return reportObj;
}

const saveReportAsJSON = () => {

    saveJSON({ report: generateReportObj() }, '../../exports', 'report.json');
}

const saveAllToJSON = () => {
// zapisuje dane o wizytach, danych z błędami i ostrzeżeniami importu, wielokrotnych wizytach do JSON

      saveJSON({
        visits, 
        dataWithErrors,
        dataWithWarnings,
        multipleVisitsOfDayArr
    }, '../../exports', 'dataAll.json');
}

module.exports = {add, importManyFromArray, showAll, getAll, removeAll, getData, filterVisits, findMultipleVisitsOfDay, generateReportObj, saveReportAsJSON, saveAllToJSON};