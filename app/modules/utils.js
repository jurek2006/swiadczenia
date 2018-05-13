const fs = require('fs');
const path = require('path');

const saveJSON = (objToSave, pathToWrite) => {
// funkcja zapisująca obiekt do pliku JSON

    return saveFile(JSON.stringify(objToSave), pathToWrite);
    
}

const readFile = (pathToFile) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(__dirname, pathToFile), 'utf8', (err, data) => {
			if (err) reject(err);

			resolve(data);
		});
	});
}

const saveFile = (dataToWrite, pathToWrite) => {

    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, pathToWrite), dataToWrite, (err) => {
            if (err) reject(err);

            resolve({
                message: `Plik ${pathToWrite} został zapisany`,
                fileSaved: pathToWrite, //przekazanie ścieżki względnej do pliku
                absoluteFileSavedPath: path.join(__dirname, pathToWrite) //ścieżka względna do zapisanego pliku
            });
        });
    });


}

const splitDataToArr = (readTextData) => {
// funkcja dzieląca zczytany plik z danymi na tabelę dwuwymiarową
// - rozdział wierszy na podstawie znaku końca linii
// - rozdział elementów w wierszu na podstawie tabulacji

    return readTextData.split("\r\n").map(line =>line.split("\t")); 
}

const deepCopy = (sourceObj) => {
// zwraca deep copy obiektu
    return JSON.parse(JSON.stringify(sourceObj));
}

const birthDateFromPesel = (pesel) => {
// zwraca datę (obiekt Date) urodzenia na podstawie numeru pesel

    // standardowo - pesel z lat 1900 - 1999 - do miesiąca nie jest dodawana żadna liczba
    let baseYear = 1900;
    const redMonth = parseInt(pesel.slice(2,4));
    let birthMonth = redMonth - 1; //miesiąc urodzenia wg numeracji, gdzie 0 to styczeń
    const birthDate = parseInt(pesel.slice(4,6)); //dzień miesiąca
    
    
    if(redMonth > 80){
    // pesel z lat 1800 - 1899 - do miesiąca dodawane jest 80
        baseYear = 1800;
        birthMonth = redMonth - 80 - 1;
    } else if(redMonth > 60){
    // pesel z lat 2200 - 2299 - do miesiąca dodawane jest 60
        baseYear = 2200;
        birthMonth = redMonth - 60 - 1; 
    } else if(redMonth > 40){
    // pesel z lat 2100 - 2199 - do miesiąca dodawane jest 40
        baseYear = 2100;
        birthMonth = redMonth - 40 - 1; 
    } else if(redMonth > 20){
    // pesel z lat 2000 - 2099 - do miesiąca dodawane jest 20
        baseYear = 2000;
        birthMonth = redMonth - 20 - 1; 
    }
    
    const birthYear = baseYear + parseInt(pesel.slice(0,2)); //wyliczenie roku urodzenia
    let birth = new Date(birthYear, birthMonth, birthDate, 0, 0, 0, 0);
    return birth;
}

const ageFullYearsInDay = (dayStr, pesel) => {
// funkcja zwracająca wiek osoby o zadanym pesel w dniu dayStr w pełnych latach (czyli np. jeśli zwraca 2 to osoba miała w tym dniu ukończone na pewno 2 lata, a nie ukończone jeszcze 3)
// dayStr jest stringiem w formacie 2018-05-08, który da się przekonwertować na Date()

    const dayDate = new Date(dayStr);
    // wyliczenie różnic w latach na podstawie numeru roku (np. 2018 - 2016)
    const birthDate = birthDateFromPesel(pesel);
    let fullYears = dayDate.getFullYear() - birthDate.getFullYear();

    // sprawdzenie, czy osoba już ukończyła wyliczoną powyżej ilośc lat
    if(dayDate.getTime() < birthDate.getTime()){
    // jeśli data wizyty jest wcześniejsza niż data ukończenia wieku fullYears to odejmuje od fullYears 1
        fullYears -= 1;
    }

    return fullYears;
}

module.exports = {saveJSON, readFile, saveFile, deepCopy, splitDataToArr, birthDateFromPesel, ageFullYearsInDay}