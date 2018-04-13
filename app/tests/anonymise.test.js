const _ = require('lodash');
const expect = require('expect');

const visits = require('../modules/visits');
const {anonymiseVisits} = require('../modules/anonymise');
const {anonymisePesel} = require('../config/hiddenConfig');

beforeEach(() => {
    visits.removeAll();
});

describe('Module anonymise', () => {
    it('should anonymise visits', () => {

        visits.add('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-01', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
    
        visits.add('2018-03-15', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
        visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
        visits.add('2018-03-15', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
        
        visits.add('2018-03-01', '84101711210', ['Y11'], '89.00',  '100204', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-01', '84101711210', ['Z11'], '89.00',  '100205', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100207',  'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-15', '84101711210', [], '89.05',  '100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
    
        visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-16', '84101711211', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
        visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
        visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
        visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00',  '100204', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-16', '84101711211', [], '89.05',  '100204', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
        visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05',  '100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
        visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05',  '100207', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

        visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-17', '84101711212', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
        visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
        visits.add('2018-03-17', '84101711212', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
        visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', '100205', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-17', '84101711212', [], '89.05',  '100204', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
        visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05',  '100205', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
        visits.add('2018-03-17', '84101711212', ['Z39'], '89.05',  '100207', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
        
        visits.add('2018-03-15', '84101711213', ['X11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-15', '84101711213', ['X11'], '89.00',  '100206', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        visits.add('2018-03-15', '84101711217', ['Z76.2'], '89.05',  '100205', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');

        visits.add('2018-03-15', '84101711218', ['Z39'], '89.05',  '100207', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
        
        expect(visits.getAll().length).toBe(30);
        const anonymised = anonymiseVisits(visits.getAll());

        expect(anonymised.length).toBe(30); //po anonimizacji ilość wizyt powinna zostać taka sama
        // sprawdzenie, czy po anonimizacji nadal zgadza się ilość wizyt dla poszczególnych peseli:
        expect(_.filter(anonymised, {pesel: anonymisePesel('84101711210')}).length).toBe(10);
        expect(_.filter(anonymised, {pesel: anonymisePesel('84101711211')}).length).toBe(8);
        expect(_.filter(anonymised, {pesel: anonymisePesel('84101711212')}).length).toBe(8);
        expect(_.filter(anonymised, {pesel: anonymisePesel('84101711213')}).length).toBe(2);
        expect(_.filter(anonymised, {pesel: anonymisePesel('84101711217')}).length).toBe(1);
        expect(_.filter(anonymised, {pesel: anonymisePesel('84101711218')}).length).toBe(1);
         
    }); 

    it('should throw TypeError as not array given', () => {
        try {
            anonymiseVisits({test: 'test'});
        } catch (err) {
            expect(err.name).toBe('TypeError');
            expect(err.message).toBe('visitsArr is not an array');
        }
    });

    it('should throw TypeError as not all items in given array are instances of Visit', () => {

        const visitsArr = [
            // poprawne instancje Visits
            new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
            new visits.Visit('2018-03-01', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
            new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
            
            new visits.Visit('2018-03-15', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
            new visits.Visit('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
            new visits.Visit('2018-03-15', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
            
            new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '100204', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
            new visits.Visit('2018-03-01', '84101711210', ['Z11'], '89.00',  '100205', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
            new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100207',  'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
            new visits.Visit('2018-03-15', '84101711210', [], '89.05',  '100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
            //to nie jest instancja Visits, nawet jeśli zawiera wszystkie wymagane dane
            {date: '2018-03-01', pesel: '84101711210', icd10: ['Y11'], icd9: '89.00', nfzCode: '100204', patientFirstName: 'JERZY', patientLastName: 'S', staff: 'RAHMAN IRENA', visitName: 'porada lekarska udzielona w miejscu udzielania świadczeń'}
        ];

        let gotError;
        try {
            anonymiseVisits(visitsArr);
        } catch (err) {
            gotError = err;
        }

        expect(gotError).toExist();
        expect(gotError.name).toBe('TypeError');
        expect(gotError.message).toBe(`One or more items in visitsArr is not an Visit class instance`);
    });

});