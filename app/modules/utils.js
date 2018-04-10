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
            
                console.log(`Plik JSON ${pathToWrite} został zapisany`);
                resolve(true);
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

module.exports = {saveJSON, readFile}