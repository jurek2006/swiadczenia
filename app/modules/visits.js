const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const {isIcd10NotRequired, isPatronage, nfzCodeIsAllowed, nfzCodeIsExported} = require('../config/visitsConfig');
const {saveJSON, deepCopy} = require('../modules/utils');

class Visit{
    constructor(date, pesel, icd10, icd9, nfzCode, patientFirstName, patientLastName, staff, visitName){
        this.date = date;
        this.pesel = pesel; 
        this.icd10 = icd10;
        this.icd9 = icd9;
        this.nfzCode = nfzCode;
        this.patientFirstName = patientFirstName;
        this.patientLastName = patientLastName;
        this.staff = staff;
        this.visitName = visitName;
    }
}

const visits = [];
const dataWithErrors = []; //wiersze danych, których nie udało się skonwertować na dane wizyty
const dataWithWarnings = []; //wiersze danych, które udało się skonwertować na dane wizyty, jednak wystąpiły pewne wątpliwości - stąd ostrzeżenia
const multipleVisitsOfDayObj = {}; //obiekt w którym zapisywane są 'wieloktorne wizyty w dniu' czyli jeśli jeden pacjent ma więcej niż jedną wizytę danego dnia (tylko wizyty eksportowane do NFZ, na podstawie kodu NFZ)

const add = (date, pesel, icd10, icd9, nfzCode, patientFirstName, patientLastName, staff, visitName) => {
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
    && typeof nfzCode === 'string' && nfzCodeIsAllowed(nfzCode) 
    && typeof patientFirstName === 'string' && patientFirstName.trim().length > 0
    && typeof patientLastName === 'string' && patientLastName.trim().length === 1
    && typeof staff === 'string' && staff.trim().length > 0 
    && typeof visitName === 'string' && visitName.trim().length > 0){
        const visitToAdd = new Visit(date, pesel, icd10, icd9, nfzCode, patientFirstName, patientLastName, staff, visitName);
        visits.push(visitToAdd);

        // jeśli liczba zwalidowanych rozpoznań w tablicy argumentu icd10 jest różna od liczby zadanych w niej argumentów
        // czyli, że były rozpoznania, które nie przeszły walidacji - dane są dodawane do tablicy dataWithWarnings
        if(icd10validatedCount < icd10.length){
            dataWithWarnings.push({
                date,
                pesel,
                icd10,
                icd9,
                nfzCode,
                patientFirstName,
                patientLastName,
                staff,
                visitName
            });
        }

        return visitToAdd;
} else {
    
    dataWithErrors.push({
        date,
        pesel,
        icd10,
        icd9,
        nfzCode,
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
        const nfzCode = rawRowDataArr[2];
        const icd9 =  rawRowDataArr[8];
		const pesel = rawRowDataArr[19]; //pierwsze sześć cyfr pesel
		const patientFirstName = rawRowDataArr[18] !== undefined ? rawRowDataArr[18].slice(rawRowDataArr[18].lastIndexOf(' ') + 1) : ''; //imię - ostatni człon stringa patientLastName i imię
		const patientLastName = rawRowDataArr[18] !== undefined ? rawRowDataArr[18][0] : ''; //pierwsza litera nazwiska
		const staff = rawRowDataArr[20];
		const visitName = rawRowDataArr[3];
        
        // return new Visit(date, pesel, icd10, patientFirstName, patientLastName, staff, visitName);
        add(date, pesel, icd10, icd9, nfzCode, patientFirstName, patientLastName, staff, visitName);
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

const onlyExported = () => {
// zwraca kopię tablicy visits tylko z wizytami, które są eksportowane do NFZ
    return visits.filter(currVisit => nfzCodeIsExported(currVisit.nfzCode));
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
    // czyszczenie multipleVisitsOfDayObj
    for (var prop in multipleVisitsOfDayObj) { if (multipleVisitsOfDayObj.hasOwnProperty(prop)) { delete multipleVisitsOfDayObj[prop]; } }
}

const filterVisits = (visitsSearchObj) => {
// funkcja filtrująca wizyty z visits na podstawie zgodności właściwości visitsSearchObj z wizytą
    return _.filter(visits, visitsSearchObj);
}

const findMultipleVisitsOfDay = () => {
// funkcja wyszukuje w visits, wizyty kiedy jest więcej niż jedna w dniu dla tego samego pacjenta 
// jednak bierze pod uwagę tylko wizyty eksportowane do NFZ
// i zapisuje to w zmiennej globalnej modułu multipleVisitsOfDayObj
// struktura multipleVisitsOfDayObj:
// {pesel: {
//      data: [] - tablica wizyt
// }}
// w tym obiekcie elementy tylko dla dubli (jeśli jest jedno świadczenie dla pacjenta danego dnia, nie jest to brane pod uwagę)

    let visitsTemp = onlyExported(); //tylko wizyty eksportowane

    while((currVisit = visitsTemp.shift()) !== undefined){
    // dopóki zdjęty pierwszy element tablicy wizyt nie jest undefined - ściągamy go z tej tablicy
        
        // znalezienie "dubli" czyli filtrowanie wszystkich wizyt dla tego samego peselu w ten sam dzień co currVisit 
        const foundDoubles = _.filter(visitsTemp, {date: currVisit.date, pesel: currVisit.pesel});

        if(foundDoubles.length > 1){
        // jeśli znaleziono jakieś duble dodanie ich do obiektu 
            
            // przygotowanie odpowiednich właściwości obiektu, jeśli nie istnieją
            if(!multipleVisitsOfDayObj[currVisit.pesel]){
                multipleVisitsOfDayObj[currVisit.pesel] = {
                    patient: `${currVisit.patientLastName}. ${currVisit.patientFirstName}`
                }
            }
            if(!multipleVisitsOfDayObj[currVisit.pesel][currVisit.date]){
                multipleVisitsOfDayObj[currVisit.pesel][currVisit.date] = [];
            }
            
            // zapisanie pierwszej (znalezionej) wizyty do doubles
            multipleVisitsOfDayObj[currVisit.pesel][currVisit.date].push(currVisit);

            foundDoubles.forEach(currDouble => {
                // dla każdego dubla - dodanie tej wizyty take do dubli
                multipleVisitsOfDayObj[currVisit.pesel][currVisit.date].push(currDouble);
            });
            
            _.pullAll(visitsTemp, foundDoubles); // usunięcie wszystkich dubli z tablicy visitsTemp (żeby ponownie dla niego nich nie były wyszukiwane duble)
            
        }
            
    }
    return deepCopy(multipleVisitsOfDayObj);
}

const generateReportObj = () => {
// generuje raport z wizyt jako obiekt
    const reportObj = {};

    // raport z danych z błędami i ostrzeżeniami przy wczytywaniu
    reportObj.dataWithErrors = dataWithErrors;
    reportObj.dataWithWarnings = dataWithWarnings;

    // raport z wielokrotnych wizyt pacjenta w dniu
    reportObj.multipleVisits = deepCopy(multipleVisitsOfDayObj); //kopia obiektu z "dublami"
  
    
    // dla każdego peselu, dla którego występują duble
    for (let currPesel in reportObj.multipleVisits){
        // dla każdego dnia dla tego peselu
        
        for(let currDate in reportObj.multipleVisits[currPesel]){
            // dla każdej wizyty w dniu - pętla po każdej wizycie w tablicy
            const currVisits = reportObj.multipleVisits[currPesel][currDate];

            for(let i = 0; i < currVisits.length; i++){
                // podmiana obiektu danych wizyty na string danych wizyty
                currVisits[i] = `${currVisits[i].staff} | ${currVisits[i].icd10} | ${currVisits[i].icd9} | ${currVisits[i].visitName} | ${currVisits[i].nfzCode}`;
            }
        }
    }

    return reportObj;
}

const saveReportAsJSON = () => {

    saveJSON({ report: generateReportObj() }, '../../exports', 'report.json').then(res => console.log(res)).catch(err => console.log(err));
}

const saveAllToJSON = () => {
// zapisuje dane o wizytach, danych z błędami i ostrzeżeniami importu, wielokrotnych wizytach do JSON

      saveJSON({
        visits, 
        dataWithErrors,
        dataWithWarnings,
        multipleVisitsOfDayObj
    }, '../../exports', 'dataAll.json').then(res => console.log(res)).catch(err => console.log(err));
}

module.exports = {add, importManyFromArray, showAll, getAll, onlyExported, removeAll, getData, filterVisits, findMultipleVisitsOfDay, generateReportObj, saveReportAsJSON, saveAllToJSON};