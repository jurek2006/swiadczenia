const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const yargs = require('yargs');

const visits = require('../app/modules/visits'); //moduł do przechowywania danych wizyt
const {readFile, saveFile, saveJSON, splitDataToArr} = require('../app/modules/utils');
const {anonymiseVisits} = require('./modules/anonymise');

const importAnonymiseAndSave = (pathToFileToAnonymise, pathToSaveAfter) => {
	
	if(!pathToSaveAfter){
		// jeśli niezdefiniowano ścieżki zapisu tworzy ją na podstawie ścieżki do odczytywanego pliku - dodając domyślny przyrostek
		// np. '../tests/anonymiseTestsData/test1.csv' > '../tests/anonymiseTestsData/test1_an.csv'
		const suffixDefault = '_an';
		pathToSaveAfter = pathToFileToAnonymise.substring(0, pathToFileToAnonymise.lastIndexOf('.')).concat(suffixDefault, pathToFileToAnonymise.substring(pathToFileToAnonymise.lastIndexOf('.')))
	}

	return new Promise((resolve, reject) => {
		visits.removeAll();
		readFile(pathToFileToAnonymise)
			.then(dataFromFile => {
				// import wizyt
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				visits.importManyFromArray(dataRawArr);

				const visitsAnonymised = anonymiseVisits(visits.getAll()); //anonimizacja wszystkich wizyt
				return saveFile(visits.convertAllToCsv(visitsAnonymised), pathToSaveAfter); // konwersja wszystkich zanonimizowanych wizyt do CSV i zapisanie do pliku

			})
			.then(res => {resolve(
				{					
					fileSaved: res.fileSaved, 
					message: `Plik ${pathToFileToAnonymise} został zanonimizowany i zapisany do ${res.fileSaved}`
				}
			)})
			.catch(err => {
				reject(err);
		}); 
	})
}

// -------------------- funkcje do przeniesienia do modułu utils albo anonimizacji
const readAnonymiseDefaultsPaths = (pathToStoringJSON) => {
// wczytuje domyślne ścieżki i nazwy plików zdefiniowane dla anonimizacji (zapisane w pliku pathToStoringJSON) 

		// obiekt defaults z niezdefiniowanymi wartościami 
		let defaultsToSave = {
			input: {
				defaultPath: undefined,
				defaultFilename: undefined
			},
			output: {
				defaultPath: undefined,
				defaultFilename: undefined
			}
		}

		return readFile(pathToStoringJSON)
			.then(res => {
				const read = JSON.parse(res);
				
				if(read.input){
		
					if(read.input.defaultPath){
						defaultsToSave.input.defaultPath = read.input.defaultPath
					}
					if(read.input.defaultFilename){
						defaultsToSave.input.defaultFilename = read.input.defaultFilename
					}
				}
		
				if(read.output){
					if(read.output.defaultPath){
						defaultsToSave.output.defaultPath = read.output.defaultPath
					}
					if(read.output.defaultFilename){
						defaultsToSave.output.defaultFilename = read.output.defaultFilename
					}
				}
				
				return defaultsToSave;
			})
			.catch(err => {
				
				console.log(`Nie udało się wczytać pliku domyślnych ścieżek/nazw plików: \r\nr${err}\r\nDomyślne ścieżki ustawiono na niezdefiniowane`);
			});

}

const argv = yargs
	// .command('anonymise', 'Anonimizuje plik csv z danymi wizyt i zapisuje w analogicznym pliku wynikowym', {
	// 	input_filePath: {
	// 		describe: 'Ścieżka względna do pliku csv z danymi wizyt do zanonimizowania (wymagane)',
	// 		demand: true,
	// 		alias: 'i',
	// 		string: true
	// 	},
	// 	output_filePath: {
	// 		describe: 'Ścieżka względna do pliku do zapisu zanonimizowanych wizyt (jeśli nie podane używa nazwy i ścieżki pliku źródłowego dodając _an w nazwie)',
	// 		alias: 'o',
	// 		string: true
	// 	},
	// })
	// .command('setDefaults', 'Ustawia domyślne ścieżki i nazwy plików dla anonimizacji', {
	// 	input: {
	// 		describe: 'Ustawia domyślną ścieżkę źródłową dla plików do anonimizacji',
	// 		alias: 'i',
	// 		boolean: true,
	// 	}, 
	// 	output: {
	// 		describe: 'Ustawia domyślną ścieżkę do zapisu plików po anonimizacji',
	// 		alias: 'o',
	// 		boolean: true
	// 	},
	// 	path: {
	// 		describe: 'Ścieżka',
	// 		alias: 'p',
	// 		string: true
	// 	},
	// 	filename: {
	// 		describe: 'Ścieżka',
	// 		alias: 'f',
	// 		string: true
	// 	}
	// })
	.command('anonymise [input] [output] [defaultPaths]', 'Importuje wizyty z pliku csv [input], anonimizuje i zapisuje do pliku csv [output]', (yargs) => {
		yargs
			.positional('input', {
				describe: 'Ścieżka względna do pliku csv z wizytami do zanonimizowania (jeśli podano parametr defaultPaths to tylko nazwa pliku)',
				alias: 'i',
				type: 'string',
				default: 'defaultInput'
			})
			.positional('output', {
				describe: 'Ścieżka względna do zapisania pliku csv po anonimizacji (jeśli podano parametr defaultPaths to tylko nazwa pliku)',
				alias: 'o',
				type: 'string',
				default: 'defaultOutput'
			})
			.positional('defaultPaths', {
				describe: 'Jeśli podany (true) to używane są domyślne ścieżki do odczytania i zapisania plików (bez nazw plików, które są wtedy definiowane w input i output)',
				alias: ['d', 'dp'],
				type: 'boolean',
				default: 'false'
			})
	})
	.command('setDefault <type> [path] [filename]', 'Ustawia ścieżkę i/lub nazwę pliku csv do importu wizyt do zanonimizowania (input) czy do zapisania po anonimizacji (output)', (yargs) => {
		yargs
		.positional('type', {
			describe: '<input|output> Określa czy ustawiana domyślna wartość dla input lub output',
			alias: 't',
			type: 'string',
		})
		.positional('path', {
			describe: 'Ścieżka, która zostanie ustawiona jako domyślna dla pliku, który będzie wczytywany do zanonimizowania lub zapisania (w zależności od wartości parametru type)',
			alias: 'p',
			type: 'string',
		})
		.positional('filename', {
			describe: 'Nazwa pliku, która zostanie ustawiona jako domyślna dla pliku, który będzie wczytywany do zanonimizowania lub zapisania (w zależności od wartości parametru type)',
			alias: 'f',
			type: 'string',
		})
	})
	.command('showDefault', 'Wyświetla domyślne przy anonimizacji ścieżki i nazwy plików ', (yargs) => {

	})
	// .example('$0 run foo', "shiver me timbers, here's an example for ye")
	// .example('$0 run foo2', "shiver me timbers, here's an example for ye")
	.help()
	.alias('help', 'h')
	.argv;

const argvCommand = argv._[0];
// jeśli uruchomiono app.js anonymise to za pomocą parametrów: 
// -s musi być podana ścieżka do pliku z wizytami, 
// -o może być podana ścieżka do zapisu wizyt po anonimizacji

if(argvCommand === 'anonymise'){
	console.log('Anonimizacja');

	// // obiekt defaults z niezdefiniowanymi wartościami 
	// let defaultsToSave = {
	// 	input: {
	// 		defaultPath: undefined,
	// 		defaultFilename: undefined
	// 	},
	// 	output: {
	// 		defaultPath: undefined,
	// 		defaultFilename: undefined
	// 	}
	// }

	// // wczytanie defaults
	// readFile('../config/anonymise_defaults.json')
	// .then(res => {
	// 	const read = JSON.parse(res);
		
	// 	if(read.input){

	// 		if(read.input.defaultPath){
	// 			defaultsToSave.input.defaultPath = read.input.defaultPath
	// 		}
	// 		if(read.input.defaultFilename){
	// 			defaultsToSave.input.defaultFilename = read.input.defaultFilename
	// 		}
	// 	}

	// 	if(read.output){
	// 		if(read.output.defaultPath){
	// 			defaultsToSave.output.defaultPath = read.output.defaultPath
	// 		}
	// 		if(read.output.defaultFilename){
	// 			defaultsToSave.output.defaultFilename = read.output.defaultFilename
	// 		}
	// 	}

	// 	if(argv.defaultPaths){
	// 		console.log('Domyślne ścieżki');
	// 		console.log(`Wczytanie pliku ${read.input.defaultPath}/${read.input.defaultFilename}`);
	// 		console.log(`Zapisanie po anonimizacji do pliku ${read.output.defaultPath}/${read.output.defaultFilename}`);
	// 		return importAnonymiseAndSave(`${read.input.defaultPath}/${read.input.defaultFilename}`, `${read.output.defaultPath}/${read.output.defaultFilename}`);
	// 	} 
		
	// })
	// .catch(err => {

	// 	console.log(`Nie udało się wczytać pliku domyślnych ścieżek/nazw plików: ${err}`);
	// });

	// ścieżki do faktycznej anonimizacji:
	let inputPath;
	let outputPath;
	
	if(argv.input === 'defaultInput'){
		console.log('Domyślny input');
	} else {
		inputPath = argv.input;
		console.log(`Input: ${argv.input}`);
	}
	
	if(argv.output === 'defaultOutput'){
		inputPath = argv.input;
		console.log('Domyślny output');
	} else {
		outputPath = argv.output;
		console.log(`Output: ${argv.output}`);
	}

	importAnonymiseAndSave(inputPath, outputPath);
	
} else if (argvCommand === 'setDefault'){
	if(argv.type !== 'input' && argv.type !== 'output'){
		console.log('Nie podano prawidłowego parametru type (powinien być input lub output)');
		return;
	}

	// obiekt defaults z niezdefiniowanymi wartościami 
	// let defaultsToSave = {
	// 	input: {
	// 		defaultPath: undefined,
	// 		defaultFilename: undefined
	// 	},
	// 	output: {
	// 		defaultPath: undefined,
	// 		defaultFilename: undefined
	// 	}
	// }

	// // wczytanie dotychczasowych defaults
	// readFile('../config/anonymise_defaults.json')
	// 	.then(res => {
	// 		const read = JSON.parse(res);
			
	// 		if(read.input){

	// 			if(read.input.defaultPath){
	// 				defaultsToSave.input.defaultPath = read.input.defaultPath
	// 			}
	// 			if(read.input.defaultFilename){
	// 				defaultsToSave.input.defaultFilename = read.input.defaultFilename
	// 			}
	// 		}

	// 		if(read.output){
	// 			if(read.output.defaultPath){
	// 				defaultsToSave.output.defaultPath = read.output.defaultPath
	// 			}
	// 			if(read.output.defaultFilename){
	// 				defaultsToSave.output.defaultFilename = read.output.defaultFilename
	// 			}
	// 		}

			
	// 	})
	// 	.catch(err => {

	// 		console.log(`Nie udało się wczytać pliku domyślnych ścieżek/nazw plików: ${err} \r\nWczytano puste`);
	// 	}).then(res => {

	// 		if(argv.path){
	// 			defaultsToSave[argv.type].defaultPath = argv.path;
	// 		}

	// 		if(argv.filename){
	// 			defaultsToSave[argv.type].defaultFilename = argv.filename;
	// 		}

	// 		return saveJSON(defaultsToSave, '../config/anonymise_defaults.json')
	// 	}).then(res => console.log(res))
	// 	.catch(err => console.log(err));

	readAnonymiseDefaultsPaths('../config/anonymise_defaults.json') //wczytuje domyślne ścieżki i nazwy plików zdefiniowane dla anonimizacji 
	.then(defaultsToSave => {
		console.log('Defaults wcześniejsze:', defaultsToSave);
	}) //jeśli się powiodło - wyświetla je
	.catch(err => console.log(err));
		
} else if (argvCommand === 'showDefault'){
	console.log('Domyślne ścieżki i nazwy plików używane w anonimizacji:');

	readAnonymiseDefaultsPaths('../config/anonymise_defaults.json') //wczytuje domyślne ścieżki i nazwy plików zdefiniowane dla anonimizacji 
	.then(defaults => console.log(defaults)) //jeśli się powiodło - wyświetla je
	.catch(err => console.log(err));
	
} else {
// jeśli nie przekazano żadnego z powyższych parametrów

	const app = express();

	const findIcd10inVisits = (icd10toFind, visitsArr) => {
		
		return visitsArr.filter(visit => visit.icd10.includes(icd10toFind) );
	}

	// route GET /report/:filename' - importuje wizyty z pliku :filename i zwraca raport
	app.get('/report/:filename', (req, res) => {
		const filename = req.params.filename;
		
		visits.removeAll();
		readFile('../../data/' + filename)
			.then(dataFromFile => {
				
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				const imported = visits.importManyFromArray(dataRawArr);

				visits.findMultipleVisitsOfDay();
				const report = visits.generateReportObj();

				res.send({
					report
				});
				
			}).catch(err => {
				if(err.message === 'Błędne nagłówki pliku z danymi. Sprawdź plik.'){
					res.status(400).send(err);
				} else {
					res.status(404).send(err);
				}
			}); 
	});

	// route GET /read/:filename' - importuje wizyty z pliku :filename i zwraca je w odpowiedzi
	app.get('/read/:filename', (req, res) => {
		const filename = req.params.filename;
		
		visits.removeAll();
		readFile('../../data/' + filename)
			.then(dataFromFile => {
				
				const dataRawArr =  splitDataToArr(dataFromFile); //tablica danych wizyty - rozdzielona tylko na tablicę dwuwymiarową
				const imported = visits.importManyFromArray(dataRawArr);

				res.send({
					visits: visits.getAll(),
					dataWithWarnings: visits.getData.withWarnings(),
					dataWithErrors: visits.getData.withErrors(),
				});
				
			}).catch(err => {
				if(err.message === 'Błędne nagłówki pliku z danymi. Sprawdź plik.'){
					res.status(400).send(err);
				} else {
					res.status(404).send(err);
				}
			}); 
	});


	if(!module.parent){
		app.listen(3000, () => {
			console.log(`Started on port 3000`);
		});
	}

	module.exports = {app, importAnonymiseAndSave};
}
