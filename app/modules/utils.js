const fs = require('fs');
const path = require('path');

const saveJSON = (objToSave, pathRelative, fileName) => {
// funkcja zapisująca obiekt do pliku JSON
// nazwę pliku można zawrzeć w pathRelative lub w filename
    let pathToWrite;

    if(fileName){
        pathToWrite = path.join(__dirname, pathRelative, fileName);
    } else {
        pathToWrite = path.join(__dirname, pathRelative);
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(pathToWrite, JSON.stringify(objToSave), 
            (err) => {
                if (err) reject(err);
            
                resolve(`Plik JSON ${pathToWrite} został zapisany`);
            }
        ); 
    });
    
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
                fileSaved: pathToWrite
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

module.exports = {saveJSON, readFile, saveFile, deepCopy, splitDataToArr}