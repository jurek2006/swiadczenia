const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const {isIcd10NotRequired, isPatronage, nfzCodeIsAllowed, nfzCodeIsExported} = require('../config/visitsConfig');
const {saveJSON, deepCopy, birthDateFromPesel, ageFullYearsInDay} = require('../modules/utils');
const { shouldBeCovidVisit, isValidCovidVisit, isCovidVerified, groupVisitArrayByPeselAndDate, prettyStringForVisitObj } = require('./covid');

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

    toCsv(separator = '\t', fieldsOrderArr) {
    // eksportuje dane wizyty do csv
    // seperator określa znak rozdzielenia pola
    // fieldsOrderArr [opcjonalne] - to tablica kolejności eksportu pól do linii csv (gdy nie ma takiego pola - wstawiana pusta wartość) - gdy nie ma tablicy, po kolei pola Visits
    // jeśli pole nie istnieje - wstawiana jest pusta wartość ''
    // jeśli pole ma wartość false - w ogóle jest pomijane
        
        if(!fieldsOrderArr){
            return `${this.date}${separator}${this.pesel}${separator}${this.icd10.concat(['', '', '', '']).slice(0,4).join(separator)}${separator}${this.icd9}${separator}${this.nfzCode}${separator}${this.patientFirstName}${separator}${this.patientLastName}${separator}${this.staff}${separator}${this.visitName}`;
        } else {
            
            let output = '';
            fieldsOrderArr.forEach((currField, index) => {
                if(this[currField]){
                    // jeśli pole currField istnieje w Visits - dodawana jest wartość pola (bez separatora na końcu, bo to może być ostatnie pole w linii, po którym nie ma separatora)
                    if(currField === 'icd10'){
                    //jeśli pole o nazwie 'icd10'- łączy wszystkie icd10 dla wizyty, jeśli nie ma 4, to dopełnia pustymi stringami
                        output += this.icd10.concat(['', '', '', '']).slice(0,4).join(separator);
                    } else {
                            output += this[currField];
                    }
                } else if(currField === 'patientFullName') {
                //jeśli 'pole' o nazwie 'patientFullName' to łączy nazwisko i imię
                    output += `${this.patientLastName} ${this.patientFirstName}`; 
                }

                if(index < fieldsOrderArr.length -1 && currField !== false){
                // jeśli nie jest to ostatnie pole i nazwa pola jest różna od false - dodajeme separator pola
                    output += separator;
                } 

            });
            
            return output;
        }
    };

    patientAge(){
    // metoda zwracająca wiek pacjenta (w latach) w dniu wizyty
        return ageFullYearsInDay(this.date, this.pesel);
    }
}

const visits = [];
const dataWithErrors = []; //wiersze danych, których nie udało się skonwertować na dane wizyty
const dataWithWarnings = []; //wiersze danych, które udało się skonwertować na dane wizyty, jednak wystąpiły pewne wątpliwości - stąd ostrzeżenia
const dataWithCovid = []; //rows of data, successfully converted to visits, only proper covid visits
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
    && typeof pesel === 'string' && (pesel.trim().length === 11 || ( pesel.trim()[11] === 'a' && pesel.trim().length === 12)) //pesel jest poprawny, jeśli ma 11 znaków (pesel nieanonimizowany) albo ma ich 12 i ostatni to 'a' (pesel anonimizowany)
    && typeof icd9 === 'string' && icd9.trim().length === 5 && icd9[2] === '.' //sprawdzenie formatu kodu icd9 - musi być w stylu 89.00
    && typeof nfzCode === 'string' && nfzCodeIsAllowed(nfzCode) 
    && typeof patientFirstName === 'string' && patientFirstName.trim().length > 0
    && typeof patientLastName === 'string' && patientLastName.trim().length === 1
    && typeof staff === 'string' && staff.trim().length > 0 
    && typeof visitName === 'string' && visitName.trim().length > 0
    && isCovidVerified({icd10, nfzCode, visitName})){
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
        // if it is valid covid visit
        // if(isValidCovidVisit({icd10, nfzCode, visitName})){
        //     dataWithCovid.push({
        //         date,
        //         pesel,
        //         icd10,
        //         icd9,
        //         nfzCode,
        //         patientFirstName,
        //         patientLastName,
        //         staff,
        //         visitName
        //     })
        // }

        return visitToAdd;
    } else {
        // zapisanie w dataWithErrors tych danych, których nie dało się poprawnie importować do Visits
        // wyjątkiem są te dane, dla których wszystkie pola są pustymi stringami, pustymi tablicami (lub o samych pustych wartościach) lub null


        if(!(! date && !pesel && !icd10validatedCount && !icd9 && !nfzCode && !patientFirstName && !patientLastName && !staff && !visitName )){
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
        }
        return false;
    }   

}

const addInstance = (visitInst) => {
// funkcja dodająca do tablicy visits instancję klasy Visit
    return add(visitInst.date, visitInst.pesel, visitInst.icd10, visitInst.icd9, visitInst.nfzCode, visitInst.patientFirstName, visitInst.patientLastName, visitInst.staff, visitInst.visitName);
}

const importManyFromArray = (rawDataArr, hasHeader = true) => {
// funkcja importująca wizyty z tablicy dwuwymiarowej danych
// hasHeader - określa czy pierwszy wiersz tablicy zawiera nagłówek zamiast danych
// jeśli jest nagłówek dokonywana jest najpierw walidacja, czy dane są w odpowiednich kolumnach - jeśli jest ok - nagłówek jest usuwany, jeśli nie rzucany jest błąd
// jeśli udało się skonwertować - zwraca true

    const verifyHeaderAndDelete = (rawDataArr) => {
	    // sprawdza czy nagłówek dokumentu zawiera odpowiednie dane - jeśli tak - usuwa nagłówek, jeśli nie - rzuca error
		const headersExpected = [ 	'Data', 'Kod MZ', 'Kod NFZ', 'Nazwa', 'ICD-10 1', 'ICD-10 2', 'ICD-10 3', 'ICD-10 4', 'ICD-9 1', 'ICD-9 2', 'ICD-9 3', 'ICD-9 4', 'ICD-9 5', 'ICD-9 6', 'ICD-9 7', 'ICD-9 8', 'ICD-9 9', 'ICD-9 10', 'Pacjent', 'Pesel', 'Personel', 'Numer kuponu RUM' ];
        debugger;
		// porównanie nagłówków zczytanych z pierwszego wiersza z tablicą wymaganych nagłówków (czyli rodzielonym względem spacji pierwszym wierszem)
        if (JSON.stringify(headersExpected) === JSON.stringify(rawDataArr[0])) {
            
            rawDataArr.shift(); //usunięcie nagłówka
            return rawDataArr;

        } else {
            let errMessage = 'Błędne nagłówki pliku z danymi. Sprawdź plik:';

            // iteracja po wszystkich kolumnach, żeby uzupełnić komunikat, które kolumny nie są w odpowiedniej kolejności.
            headersExpected.forEach((currHeader, i) => {
                if(currHeader !== rawDataArr[0][i]){
                    errMessage += `\r\nKolumna ${i} powinna być kolumną ${currHeader} - jest natomiast ${rawDataArr[0][i]}`;
                }
            });

			throw new Error(errMessage);
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

    // jeśli nie było błędu zwraca true
    return true;
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

// sprawdza, czy variable jest tablicą i zawiera tylko instancje klasy Visits (zwraca true/false)
const isVisitsArr = (variable) => Array.isArray(variable) && variable.every(currElem => currElem instanceof Visit );

const getData = {
    withErrors: () => dataWithErrors.slice(),
    withWarnings: () => dataWithWarnings.slice(),
    withCovid: () => dataWithCovid.slice()
}

const removeAll = () => {
// usuwa wszystkie elementy tablicy visits, czyści także tablice dataWithErrors i dataWithWarnings (and dataWithCovid)
    while( (visits.shift()) !== undefined ) { };
    while( (dataWithErrors.shift()) !== undefined ) { };
    while( (dataWithWarnings.shift()) !== undefined ) { };
    while( (dataWithCovid.shift()) !== undefined ) { };
    // czyszczenie multipleVisitsOfDayObj
    for (var prop in multipleVisitsOfDayObj) { if (multipleVisitsOfDayObj.hasOwnProperty(prop)) { delete multipleVisitsOfDayObj[prop]; } }
}

const filterVisits = (visitsSearchObj) => {
// funkcja filtrująca wizyty z visits na podstawie zgodności właściwości visitsSearchObj z wizytą
// tablicę icd10 bierze pod uwagę tak, że wszystkie icd10 z visitsSearchObj muszą się znaleźć w wizycie, natomiast może miec ona także inne rozpoznania
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
        
        // znalezienie "dubli" czyli filtrowanie wszystkich wizyt dla tego samego peselu w ten sam dzień co currVisit (currVisit już nie ma, bo zostało zdjęte)
        const foundDoubles = _.filter(visitsTemp, {date: currVisit.date, pesel: currVisit.pesel});

        if(foundDoubles.length > 0){
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

const findIcd10inVisits = (icd10toFind, visitsArr) => {
// zwraca wszystkie wizyty, które mają zadany icd10 (np. Z10)
	
	return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
}

const generateReportObj = () => {
// generuje raport z wizyt jako obiekt

    const wrongZ10 = (visits) => {
    // funkcja generująca fragment raportu o błędnych świadczeniach Z10 (bilans, który jest poprawny tylko dla pacjentów pomiędzy 2 i 18 rokiem życia - w dniu wykonania tego bilansu)
        const z10 = findIcd10inVisits('Z10', visits).filter(currVisit => {
            currVisit.age = currVisit.patientAge();
            return currVisit.patientAge() > 33;
        });

        return z10;
    }

    const reportObj = {};

    // raport z danych z błędami i ostrzeżeniami przy wczytywaniu
    reportObj.dataWithErrors = dataWithErrors;
    reportObj.dataWithWarnings = dataWithWarnings;
    // reportObj.dataWithCovid = dataWithCovid; don't show directly on report

    // generating covid section of report
    // covid data is not printed in report
    const covidData = {
        teleporady: filterVisits({visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'}),
        wizyty: filterVisits({visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}),
        wizytyDomowe: filterVisits({visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'})
    }
    const covidSummary = {
        teleporady: covidData.teleporady.length,
        wizyty: covidData.wizyty.length,
        wizytyDomowe: covidData.wizytyDomowe.length,
    }

    const covidDetails = {
        teleporady: groupVisitArrayByPeselAndDate({visitArray: covidData.teleporady, itemDataChanger: prettyStringForVisitObj}),
        wizyty: groupVisitArrayByPeselAndDate({visitArray: covidData.wizyty, itemDataChanger: prettyStringForVisitObj}),
        wizytyDomowe: groupVisitArrayByPeselAndDate({visitArray: covidData.wizytyDomowe, itemDataChanger: prettyStringForVisitObj}),
    }

    reportObj.covid = {
        covidSummary,
        covidDetails
        // covidData
    };

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

    // raport wizyt posiadających icd10 Z10
    
    reportObj.wrongZ10 = wrongZ10(visits);

    return reportObj;
}

const saveReportAsJSON = ({fileNameSufix = ''} = {}) => {

    saveJSON({ report: generateReportObj() }, `../../exports/report_${fileNameSufix}.json`).then(res => console.log(res)).catch(err => console.log(err));
}

const saveAllToJSON = () => {
// zapisuje dane o wizytach, danych z błędami i ostrzeżeniami importu, wielokrotnych wizytach do JSON

      saveJSON({
        visits, 
        dataWithErrors,
        dataWithWarnings,
        dataWithCovid,
        multipleVisitsOfDayObj
    }, '../../exports', 'dataAll.json').then(res => console.log(res)).catch(err => console.log(err));
}

const convertAllToCsv = (visitsArr = getAll() ,fieldSeparator = '\t', lineSeparator = '\r\n') => {
// konwertuje wszystkie wizyty do tekstu zgodnego z CSV
// jeśli nie zadano argumentu tablicy visitsArr, to pobierane są one z globalnego w module visits
// dodaje nagłówek
// jeśli tablica visitsArr nie jest tablicą Visits - zwraca false
// w dataToExport:
//  - fieldName - nazwa pola (string) z instancji klasy Visit do którego wstawiane są dane (jeśli false, to dane pomijane, chociaż nagłówek dodawany)
//  - headerName - nazwa dla pola, która pojawia się w nagłówku

    if(!isVisitsArr(visitsArr)) return false;    

    const dataToExport = [
            {fieldName: 'date', headerName: 'Data'},
            {fieldName: 'empty', headerName: 'Kod MZ'},
            {fieldName: 'nfzCode', headerName: 'Kod NFZ'},
            {fieldName: 'visitName', headerName: 'Nazwa'},
            {fieldName: 'icd10', headerName: 'ICD-10 1'}, //idc10 generuje 4 pola w danych
            {fieldName: false, headerName: 'ICD-10 2'}, //tylko w nagłówku, bez żadnych danych wstawianych
            {fieldName: false, headerName: 'ICD-10 3'}, //tylko w nagłówku, bez żadnych danych wstawianych
            {fieldName: false, headerName: 'ICD-10 4'}, //tylko w nagłówku, bez żadnych danych wstawianych
            {fieldName: 'icd9', headerName: 'ICD-9 1'},
            {fieldName: 'empty', headerName: 'ICD-9 2'},
            {fieldName: 'empty', headerName: 'ICD-9 3'},
            {fieldName: 'empty', headerName: 'ICD-9 4'},
            {fieldName: 'empty', headerName: 'ICD-9 5'},
            {fieldName: 'empty', headerName: 'ICD-9 6'},
            {fieldName: 'empty', headerName: 'ICD-9 7'},
            {fieldName: 'empty', headerName: 'ICD-9 8'},
            {fieldName: 'empty', headerName: 'ICD-9 9'},
            {fieldName: 'empty', headerName: 'ICD-9 10'},
            {fieldName: 'patientFullName', headerName: 'Pacjent'},
            {fieldName: 'pesel', headerName: 'Pesel'},
            {fieldName: 'staff', headerName: 'Personel'},
            {fieldName: 'empty', headerName: 'Numer kuponu RUM'}
    ];

    //złączenie wszystkich kolejnych headerName z dataExport
    const csvHeader =  dataToExport.reduce((prevVal, currVal, index) => {
        return prevVal + currVal.headerName + (index < (dataToExport.length - 1) ? fieldSeparator : ''); //dodanie seperatora pola, o ile nie jest to ostatnie pole
    }, '') + lineSeparator;

    let csvContent = '';
    const fieldsOrderArr = dataToExport.map(field => field.fieldName);
    
    visitsArr.forEach(currVis => {
        csvContent += currVis.toCsv( fieldSeparator ,fieldsOrderArr) + lineSeparator;
    });

    return csvHeader + csvContent;
}

module.exports = {Visit, add, addInstance, importManyFromArray, showAll, getAll, onlyExported, isVisitsArr, removeAll, getData, filterVisits, findMultipleVisitsOfDay, generateReportObj, saveReportAsJSON, saveAllToJSON, convertAllToCsv};