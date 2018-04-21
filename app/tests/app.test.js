const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');

const {app, importAnonymiseAndSave} = require('../app');
const {readFile, splitDataToArr, deepCopy} = require('../modules/utils');
const {anonymisePesel} = require('../config/hiddenConfig');
const visits = require('../modules/visits');


beforeEach(() => {
    visits.removeAll();
});

describe('app', () => {
    describe('GET /read/:filename', () => {

        it('should return 404 as file not found', done => {
                request(app)
                .get('/read/notExisting.csv')
                .expect(404)
                .end(done)
        });

        it('should return 200 as file was found', done => {
            request(app)
            .get('/read/test1.csv')
            .expect(200)
            .end(done);
        });

        it('should import visits from file test1.csv', done => {
            request(app)
            .get('/read/test1.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie, czy wczytano wszystkie wizyty poprawne, ostrzeżenia i zapisano dane z błędami
                    expect(res.body.visits.length).toBe(14);
                    expect(res.body.dataWithWarnings.length).toBe(2);
                    expect(res.body.dataWithErrors.length).toBe(4);

                    done();

            });
        });

        it('should import nothing from empty file test2.csv', done => {
            request(app)
            .get('/read/test2.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie, czy wczytano wszystkie wizyty poprawne, ostrzeżenia i zapisano dane z błędami
                    expect(res.body.visits.length).toBe(0);
                    expect(res.body.dataWithWarnings.length).toBe(0);
                    expect(res.body.dataWithErrors.length).toBe(0);

                    done();

            });
        });

        it('should throw 400 as test3.csv is empty, witout proper header', done => {
            request(app)
            .get('/read/test3.csv')
            .expect(400)
            .end(done);
        });

    });

    describe('GET /report/:filename', () => {
        it('should return 404 as file not found', done => {
            request(app)
            .get('/report/notExisting.csv')
            .expect(404)
            .end(done)
        });

        it('should return 200 as file was found', done => {
            request(app)
            .get('/report/test1.csv')
            .expect(200)
            .end(done);
        });

        it('should import nothing from empty file test2.csv', done => {
            request(app)
            .get('/report/test2.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie, czy raport jest pusty
                    expect(res.body.report.dataWithErrors.length).toBe(0);
                    expect(res.body.report.dataWithWarnings.length).toBe(0);
                    expect(res.body.report.multipleVisits).toEqual({});

                    done();

            });
        });

        it('should return empty object as test3.csv is empty, witout proper header', done => {
            request(app)
            .get('/report/test3.csv')
            .expect(400)
            .end(done);
        });

        it('should import visits from file test1.csv and generate report', done => {
            request(app)
            .get('/report/test1.csv')
            .expect(200)
            .end((err, res) => {
                    if(err){
                        return err;
                    }
                    
                    // sprawdzenie ostrzeżeń i errorów przy imporcie wizyt
                    expect(res.body.report.dataWithWarnings.length).toBe(2);
                    expect(res.body.report.dataWithErrors.length).toBe(4);
                    
                    // sprawdzenie wielokrotnych wizyt w dniu
                    expect(res.body.report.multipleVisits['84101711210']['2018-03-01'].length).toBe(3);
                    expect(res.body.report.multipleVisits['84101711213']['2018-03-01'].length).toBe(5);
                    expect(res.body.report.multipleVisits['84101711215']['2018-03-01'].length).toBe(2);

                    done();

            });
        });
    });

    describe('importAnonymiseAndSave()', () => {
            const filePathToAnonymise = '../tests/anonymiseTestsData/test1.csv';
            const filePathToSaveAfter = '../tests/anonymiseTestsData/test1_anonymised.csv';

        it('should anonymise pesels in given file and write it back to new csv', () => {

            return importAnonymiseAndSave(filePathToAnonymise, filePathToSaveAfter)
                .then(res => {
                    expect(res).toBe(`Plik ${filePathToSaveAfter} został zapisany`);
            });
        });

        it('TO REFACTOR!!! should anonymise pesels in given file, write it back to new csv and then import properly visits from this anonymised file', () => {

            // DODAĆ SPRAWDZENIE DLA KAŻDEJ WIZYTY, KTÓRĄ ZAIMPORTOWANO Z ORYGINALNEGO PLIKU CZY W PLIKU ZAPISYWANYM (I PO IMPORCIE) pesel jest odpowiednio zanonimizowany, a wszystkie inne dane się zgadzają

            // wczytanie pliku niezanonimizowanego i zapisanie wizyt przez niego importowanych (deepCopy) do visitsBeforeAnonymise, 
            // żeby mieć materiał do porównywania z danymi wczytanymi na końcu z pliku po anonimizacji
            let visitsBeforeAnonymise;
            visits.removeAll();
            readFile(filePathToAnonymise)
                .then(dataFromFile => {
                    
                    const dataRawArr =  splitDataToArr(dataFromFile); 
                    visits.importManyFromArray(dataRawArr);

                    visitsBeforeAnonymise = deepCopy(visits.getAll());
                    console.log('visitsBeforeAnonymise:', visitsBeforeAnonymise.length);
                    
                    visits.removeAll(); 
                });
            
            // uruchomienie testowanej funkcji
            return importAnonymiseAndSave(filePathToAnonymise, filePathToSaveAfter)
                .then(res => {
                    expect(res).toBe(`Plik ${filePathToSaveAfter} został zapisany`);
                    return readFile(filePathToSaveAfter);
                }).then(dataFromFile => {
                // gdy udało się bez błędów - wczytanie i importowanie danych wizyt z pliku po anonimizacji
                    
                    // wyczyszczenie zaimportowanych wizyt

                    visits.removeAll();
                    expect(visits.getAll().length).toEqual(0); 

                    const dataRawArr =  splitDataToArr(dataFromFile); 
                    const imported = visits.importManyFromArray(dataRawArr);
                    
                    // sprawdzenie czy udało się zapisać do i importować z nowego pliku taką samą ilośc wizyt jak zaimportowano poprawnie z pierwszego
                    expect(visits.getAll().length).toEqual(visitsBeforeAnonymise.length);

                    // dla każdej wizyty wczytanej z pliku oryginalnego sprawdzić anonimizację pesel i identyczność pozostałych danych
                    debugger;
                    visitsBeforeAnonymise = visitsBeforeAnonymise.map(currVisit => {
                        const t = _.omit(currVisit, ['pesel']);
                        t['pesel'] = anonymisePesel(currVisit['pesel']);
                        return t;
                    });

                    visitsBeforeAnonymise.forEach(element => {
                        const found = visits.filterVisits(element);
                        //standardowo powinien być dla każdego elementu znaleziony dokładnie jeden element, ale z powodu działania 
                        // visits.filterVisits(), która w odniesieniu do icd10 nie działa 'strict' i ze względu na potencjalne "identyczne duble" w danych, może być więcej niż 1, więc powinno być nie mniej niż jeden
                        expect(found.length).toBeMoreThan(0); 
                    });
                    
                });
        });

        it('should return ENOENT error as file with data does not exists', () => {
        // testowanie czy zaistniał odpowiedni błąd - o kodzie ENOENT - nie można odczytać lub zapisać pliku
            const filePathToAnonymise = '../../data/notExisting.csv'; //PLIK NIE ISTNIEJE
            const filePathToSaveAfter = '../../data/dataAfterAn.csv';

            return importAnonymiseAndSave(filePathToAnonymise, filePathToSaveAfter)
                .then(res => {
                    console.log('res', res);
                    return Promise.reject(new Error(`Plik istnieje`)); //rzucenie błędu, żeby przejść do catch, skoro promise zakończone sukcesem
                })
                .catch(err => {
                    expect(err.code).toBe('ENOENT');
                })
        });

        it('should return ENOENT error as path to save file does not exists', () => {
            // testowanie czy zaistniał odpowiedni błąd - o kodzie ENOENT - nie można odczytać lub zapisać pliku
            const filePathToAnonymise = '../../data/dataBeforeAn.csv';
            const filePathToSaveAfter = '../../notExistingPath/dataAfterAn.csv'; //ŚCIEŻKA DO ZAPISU NIE ISTNIEJE

            return importAnonymiseAndSave(filePathToAnonymise, filePathToSaveAfter)
                .then(res => {
                    console.log('res', res);
                    return Promise.reject(new Error(`Plik istnieje`)); //rzucenie błędu, żeby przejść do catch, skoro promise zakończone sukcesem
                })
                .catch(err => {
                    expect(err.code).toBe('ENOENT');
                })
        });
    });
});