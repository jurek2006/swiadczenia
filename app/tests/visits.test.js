const _ = require('lodash');
const expect = require('expect');

const visits = require('../modules/visits');
const {saveJSON} = require('../modules/utils');
const {nfzCodeIsExported} = require('../config/visitsConfig');

beforeEach(() => {
    visits.removeAll();
});

describe('Module visits', () => {

    describe('visits.add()', () => {

        describe('success:', () => {
            it('Should add doctors\' visits', () => {

                let visitAdded = visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                // expect(visits.filterVisits({
                //     date: '2018-03-01',
                //     pesel: '84101711210',
                //     icd10: ['A01', 'B02', 'C03'], 
                //     icd9: '89.00',
                //     nfzCode: '5.01.00.0000121',
                //     patientFirstName: 'JERZY',
                //     patientLastName: 'S',
                //     staff: 'DUDYCZ JOLANTA',
                //     visitName: 'porada lekarska udzielona w miejscu udzielania świadczeń'
                // }).length).toBe(1);

                visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta');
                visits.add('2018-03-04', '84101711213', ['X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(4);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add doctors\' visits with warning - when some invalid icd10 codes found', () => {
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C3'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', '84101711211', ['B02', false], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'C'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta');
                visits.add('2018-03-04', '84101711213', ['X11', 100], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(4);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(4);
            });

            it('Should add nurses\' visits - "świadczenia świadczenie profilaktyczne", "świadczenie diagnostyczne" and "świadczenie pielęgnacyjne"', () => {
                visits.add('2018-03-15', '84101711210', [], '89.05','100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
                visits.add('2018-03-16', '84101711211', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
                visits.add('2018-03-17', '84101711212', [], '89.05','100206', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add nurses\' patronages', () => {
                visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add midwifes\' patronages', () => {
                visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
                visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add midwifes\' home visit', () => {
                visits.add('2018-03-15', '84101711210', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta domowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta domowa');
                visits.add('2018-03-17', '84101711212', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta domowa');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add patronages when also other valid but non-patronage icd10 given', () => {
                // patronaże pielęgniarki
                visits.add('2018-03-15', '84101711210', ['Z76.2', 'Z01'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-16', '84101711211', ['Z10', 'Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', '84101711212', ['A10', 'Z76.2', 'B11'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39', 'Z10'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['C11', 'Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
                visits.add('2018-03-17', '84101711212', ['D13', 'Z39', 'B18'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

                expect(visits.getAll().length).toBe(6);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add patronages and add to warnings when also other icd10 (invalid at all) given', () => {
                // patronaże pielęgniarki
                visits.add('2018-03-16', '84101711211', ['Z76.2', true], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', '84101711212', ['Z76.2', 'Z0'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39', 100], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2', ''], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

                expect(visits.getAll().length).toBe(4);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(4);
            });

            it('Should add visits with anonymised pesels', () => {
                const visitsArr = [
                    // wizyty poprawne
                    new visits.Visit('2018-03-02', '84101711211a', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                    new visits.Visit('2018-03-03', '84101711212a', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta'),
                    new visits.Visit('2018-03-04', '84101711213a', ['X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                    new visits.Visit('2018-03-15', '84101711210a', [], '89.05','100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
                    new visits.Visit('2018-03-16', '84101711211a', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne'),
                    new visits.Visit('2018-03-17', '84101711212a', [], '89.05','100206', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-17', '84101711212a', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-17', '84101711212a', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta domowa'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta domowa'),
                    new visits.Visit('2018-03-17', '84101711212a', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta domowa'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z76.2', 'Z01'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z10', 'Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-17', '84101711212a', ['A10', 'Z76.2', 'B11'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39', 'Z10'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-16', '84101711211a', ['C11', 'Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-17', '84101711212a', ['D13', 'Z39', 'B18'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa'),
                    // wizyty z ostrzeżeniami
                    new visits.Visit('2018-03-01', '84101711210a', ['A01', 'B02', 'C3'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-02', '84101711211a', ['B02', false], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-03', '84101711212a', ['A01', 'B02', 'C03', 'C'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-04', '84101711213a', ['X11', 100], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-16', '84101711211a', ['Z76.2', true], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-17', '84101711212a', ['Z76.2', 'Z0'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39', 100], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-16', '84101711211a', ['Z39.2', ''], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa'), // z ostrzeżeniem ze względu na icd10
                ];

                // dodanie wszystkich wizyt do Visits
                visitsArr.forEach(currVisit => {visits.addInstance(currVisit)});
                // sprawdzenie poprawnych ilości
                expect(visits.getAll().length).toBe(29);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(8);
            });

            it('Should omit empty lines', () => {
                const visitsArr = [
                    // wizyty poprawne
                    new visits.Visit('2018-03-02', '84101711211a', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                    new visits.Visit('2018-03-03', '84101711212a', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta'),
                    new visits.Visit('2018-03-04', '84101711213a', ['X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                    new visits.Visit('2018-03-15', '84101711210a', [], '89.05','100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
                    new visits.Visit('2018-03-16', '84101711211a', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne'),
                    new visits.Visit('2018-03-17', '84101711212a', [], '89.05','100206', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-17', '84101711212a', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-17', '84101711212a', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta domowa'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta domowa'),
                    new visits.Visit('2018-03-17', '84101711212a', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta domowa'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z76.2', 'Z01'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-16', '84101711211a', ['Z10', 'Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-17', '84101711212a', ['A10', 'Z76.2', 'B11'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39', 'Z10'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-16', '84101711211a', ['C11', 'Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa'),
                    new visits.Visit('2018-03-17', '84101711212a', ['D13', 'Z39', 'B18'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa'),
                    // wizyty z ostrzeżeniami
                    new visits.Visit('2018-03-01', '84101711210a', ['A01', 'B02', 'C3'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-02', '84101711211a', ['B02', false], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-03', '84101711212a', ['A01', 'B02', 'C03', 'C'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-04', '84101711213a', ['X11', 100], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-16', '84101711211a', ['Z76.2', true], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-17', '84101711212a', ['Z76.2', 'Z0'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39', 100], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'), // z ostrzeżeniem ze względu na icd10
                    new visits.Visit('2018-03-16', '84101711211a', ['Z39.2', ''], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa'), // z ostrzeżeniem ze względu na icd10
                    // wizyty błędne
                    new visits.Visit('', '84101711210a', ['Z76.2', 'Z01'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-16', '84101711211a', [], '89.00', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-17', '', ['A10', 'Z76.2', 'B11'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz'),
                    new visits.Visit('2018-03-15', '84101711210a', ['Z39', 'Z10'], '89.05', '5.01.00.0000089', '', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
                    // do pominięcia - nie dodawane do wizyt błędnych
                    new visits.Visit('', '', [], '', '', '', '', '', ''),
                ];

                // dodanie wszystkich wizyt do Visits
                visitsArr.forEach(currVisit => {visits.addInstance(currVisit)});
                // sprawdzenie poprawnych ilości
                expect(visits.getAll().length).toBe(29);
                expect(visits.getData.withErrors().length).toBe(4);
                expect(visits.getData.withWarnings().length).toBe(8);
            });
        });

        describe('failure:', () => {
            it('Should not add visits because an parameter is missing', () => {
                // świadczenia lekarza
                visits.add('84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-03', '84101711212', '89.00', '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-04', '84101711213', ['X11'], '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // świadczenia pielęgniarki
                visits.add('2018-03-15', '84101711210', [], '89.05', '100204', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
                visits.add('2018-03-16', '84101711211', [], '89.05', '100204', 'JERZY', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
                visits.add('2018-03-17', '84101711212', [], '89.05', '100204', 'JERZY', 'S', 'świadczenie pielęgnacyjne');
                // patronaże pielęgniarki
                visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', '100204', 'JERZY', 'S', 'DUDYCZ JOLANTA');
                visits.add('84101711211', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39'], '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', '5.01.00.0000089', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
                visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'BEATA NOWAK', 'wizyta patronażowa');

                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(16);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong date parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add(undefined, '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(null, '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(false, '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(true, '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(102, '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(2018-03-02, '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('    ', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-022', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-0', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(10);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong pesel parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', undefined, ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', null, ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', false, ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', true, ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', 102, ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', 84101711210, ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '   ', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '884101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '4101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121','JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(10);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong icd9 parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], undefined, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], undefined, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], null, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], null, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], false, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], false, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], true, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], true, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 100, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], 100, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '   ', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '   ', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'jurek', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], 'jurek', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89-00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '89-00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '9.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '9.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.0', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '89.0', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');

                expect(visits.getAll().length).toBe(2);
                expect(visits.getData.withErrors().length).toBe(22);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong patientFirstName parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', undefined, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', null, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', false, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', true, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 100, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', '', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', '  ', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(7);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong patientLastName parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', undefined, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', null, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', false, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', true, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 1, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', '', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'SK', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                
                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(7);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong visitName argument', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', undefined);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', null);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', false);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', true);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 5);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', '');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', '    ');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(7);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong nfzCode argument', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000128', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.00001218', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', undefined, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', false, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', null, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', true, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 5.01, 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '   ', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100200', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(11);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            // ICD10

            it('Should not add visits because of wrong icd10 argument type when icd10 required ', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', undefined, '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', null, '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', false, '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', true, '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 100, '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 'Z01', '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', '', '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ' ', '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(8);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong icd10 argument type when icd10 not required (patronage or nurse\'s visit', () => {
                // niepoprawne
                visits.add('2018-03-01', '84101711210', undefined, '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', null, '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', false, '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', true, '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 100, '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 'Z01', '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', '', '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ' ', '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(8);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because icd10 required and didn\'t given any valid', () => {
                // niepoprawne
                visits.add('2018-03-01', '84101711210', [], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['', 'Z0'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['   ', 'X0'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');


                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(3);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because icd10 not required and it is not valid for patronage', () => {
                visits.add('2018-03-01', '84101711210', ['Z10'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [''], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['X0'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [100], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [true], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(5);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because icd9 and icd10 for patronage but visit name not valid for it', () => {
                // patronaże pielęgniarki
                visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(6);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            // nfzCode '5.01.00.0000121',

        });

    });

    describe('isVisitsArr()', () => {

        it('should return true for array of Visit instances', () => {
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
            ];
            
            expect(visits.isVisitsArr(visitsArr)).toBeTruthy();
        });
        
        it('should return false as variable given is array but not with Visit instances only', () => {
            const visitsArr = [
                // poprawne instancje Visits
                new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                
                new visits.Visit('2018-03-15', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
                new visits.Visit('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
                new visits.Visit('2018-03-15', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa'),
                //to nie jest instancja Visits, nawet jeśli zawiera wszystkie wymagane dane
                {date: '2018-03-01', pesel: '84101711210', icd10: ['Y11'], icd9: '89.00', nfzCode: '100204', patientFirstName: 'JERZY', patientLastName: 'S', staff: 'RAHMAN IRENA', visitName: 'porada lekarska udzielona w miejscu udzielania świadczeń'},
                
                // poprawne instancje Visits
                new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '100204', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['Z11'], '89.00',  '100205', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100207',  'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-15', '84101711210', [], '89.05',  '100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
            ];
            
            expect(visits.isVisitsArr(visitsArr)).toBeFalsy();
        });
        
        it('should return false as variable given is not an array', () => {
               expect(visits.isVisitsArr('')).toBeFalsy();
        })
    });

    describe('Visit.toCsv()', () => {
        it('should return csv line for Visit instance in standard order with default separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv()).toBe('2018-03-02\t84101711211\tB02\tC03\t\t\t89.00\t5.01.00.0000121\tJERZY\tS\tRAFAŁ CZEKIEL\tporada lekarska udzielona w miejscu udzielania świadczeń');

            visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'M11', 'N01'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv()).toBe('2018-03-02\t84101711211\tB02\tC03\tM11\tN01\t89.00\t5.01.00.0000121\tJERZY\tS\tRAFAŁ CZEKIEL\tporada lekarska udzielona w miejscu udzielania świadczeń');
            
            visit = new visits.Visit('2018-03-16', '84101711217', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv()).toBe('2018-03-16\t84101711217\t\t\t\t\t89.05\t100205\tJERZY\tS\tRAFAŁ CZEKIEL\tświadczenie diagnostyczne');
        });

        it('should return csv line for Visit instance in standard order with given separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(',')).toBe('2018-03-02,84101711211,B02,C03,,,89.00,5.01.00.0000121,JERZY,S,RAFAŁ CZEKIEL,porada lekarska udzielona w miejscu udzielania świadczeń');

            visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'M11', 'N01'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(',')).toBe('2018-03-02,84101711211,B02,C03,M11,N01,89.00,5.01.00.0000121,JERZY,S,RAFAŁ CZEKIEL,porada lekarska udzielona w miejscu udzielania świadczeń');
            
            visit = new visits.Visit('2018-03-16', '84101711217', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(';')).toBe('2018-03-16;84101711217;;;;;89.05;100205;JERZY;S;RAFAŁ CZEKIEL;świadczenie diagnostyczne');
        });

        it('should return csv line for Visit instance in given order with default separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'A11', 'Z10'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(undefined, ['date', 'pesel', 'staff', 'icd10'])).toBe('2018-03-02\t84101711211\tRAFAŁ CZEKIEL\tB02\tC03\tA11\tZ10');
            
            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02', 'C03', 'D04'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['icd10', 'pesel', 'date'])).toBe('A01\tB02\tC03\tD04\t84101711217\t2018-03-16');

            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['icd10', 'pesel', 'date'])).toBe('A01\tB02\t\t\t84101711217\t2018-03-16');

            visit = new visits.Visit('2018-03-16', '84101711217', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['icd10', 'pesel', 'date'])).toBe('\t\t\t\t84101711217\t2018-03-16');
        });

        it('should return csv line for Visit instance in given order with given separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'A11', 'Z10'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(',', ['date', 'pesel', 'staff', 'icd10'])).toBe('2018-03-02,84101711211,RAFAŁ CZEKIEL,B02,C03,A11,Z10');
            
            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02', 'C03', 'D04'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(';', ['icd10', 'pesel', 'date'])).toBe('A01;B02;C03;D04;84101711217;2018-03-16');

            visit = new visits.Visit('2018-03-16', '84101711217', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(' | ', ['icd10', 'pesel', 'date'])).toBe(' |  |  |  | 84101711217 | 2018-03-16');
        });

        it('should return csv line for Visit instance (with patientFullName property) in given order with default separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'A11', 'Z10'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(undefined, ['date', 'pesel', 'staff', 'icd10', 'patientFullName'])).toBe('2018-03-02\t84101711211\tRAFAŁ CZEKIEL\tB02\tC03\tA11\tZ10\tS JERZY');
            
            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02', 'C03', 'D04'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['icd10', 'pesel', 'date'])).toBe('A01\tB02\tC03\tD04\t84101711217\t2018-03-16');

            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['icd10', 'pesel', 'date'])).toBe('A01\tB02\t\t\t84101711217\t2018-03-16');

            visit = new visits.Visit('2018-03-16', '84101711217', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['icd10', 'pesel', 'date'])).toBe('\t\t\t\t84101711217\t2018-03-16');
        });

        it('should return csv line for Visit instance in given order (with non-existing fields) with default separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'A11', 'Z10'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(undefined, ['date', 'nonExisting', 'pesel', 'nonExisting', 'staff', 'icd10'])).toBe('2018-03-02\t\t84101711211\t\tRAFAŁ CZEKIEL\tB02\tC03\tA11\tZ10');
            
            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02', 'C03', 'D04'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(undefined, ['nonExisting', 'icd10', 'pesel', 'date', 'nonExisting'])).toBe('\tA01\tB02\tC03\tD04\t84101711217\t2018-03-16\t');
        });

        it('should return csv line for Visit instance in given order (with non-existing fields) with given separator', () => {

            let visit = new visits.Visit('2018-03-02', '84101711211', ['B02', 'C03', 'A11', 'Z10'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            expect(visit.toCsv(',', ['date', 'pesel', 'nonExisting', 'staff', 'icd10', 'nonExisting'])).toBe('2018-03-02,84101711211,,RAFAŁ CZEKIEL,B02,C03,A11,Z10,');
            
            visit = new visits.Visit('2018-03-16', '84101711217', ['A01', 'B02', 'C03', 'D04'], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            expect(visit.toCsv(';', ['icd10', 'pesel', 'date', 'nonExisting', 'nonExisting', 'nonExisting' ])).toBe('A01;B02;C03;D04;84101711217;2018-03-16;;;');

        });
    });

    describe('visits.onlyExported()', () => {

        it('should return array of visits only exported to NFZ', () => {

            // EKSPORTOWANE
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C3'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', false], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń'); 
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'C'], '89.00', '5.01.00.0000122', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w domu pacjenta');
            visits.add('2018-03-04', '84101711213', ['X11', 100], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
            // patronaże pielęgniarki
            visits.add('2018-03-15', '84101711210', ['Z76.2', 'Z01'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z10', 'Z76.2'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['A10', 'Z76.2', 'B11'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            // patronaże położnej
            visits.add('2018-03-16', '84101711211', ['C11', 'Z39.2'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            visits.add('2018-03-15', '84101711210', ['Z39', 'Z10'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            visits.add('2018-03-17', '84101711212', ['D13', 'Z39', 'B18'], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
            
            // patronaże pielęgniarki
            visits.add('2018-03-16', '84101711211', ['Z76.2', true], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z76.2', 'Z0'], '89.05', '5.01.00.0000107', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            // patronaże położnej
            visits.add('2018-03-15', '84101711210', ['Z39', 100], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            visits.add('2018-03-16', '84101711211', ['Z39.2', ''], '89.05', '5.01.00.0000089', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            
            
            // NIEEKSPORTOWANE
            visits.add('2018-03-15', '84101711210', [], '89.05','100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-16', '84101711211', [], '89.05','100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-17', '84101711212', [], '89.05','100206', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            
            visits.add('2018-03-15', '84101711210', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta domowa');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta domowa');
            visits.add('2018-03-17', '84101711212', ['Z39.2'], '89.05', '100302', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta domowa');
            
            // sprawdzenie czy poprawnie dodano wszystkie wizyty
            expect(visits.getAll().length).toBe(29);
            expect(visits.getData.withErrors().length).toBe(0);

            const visitsOnlyExported = visits.onlyExported();
            expect(visitsOnlyExported.length).toBe(23);

            // sprawdzenie czy każdy z kodów jest z eksportowanych do NFZ
            visitsOnlyExported.forEach(currVisit => {
                expect(nfzCodeIsExported(currVisit.nfzCode)).toBeTruthy();
            });
            
        });
    });

    describe('visits.removeAll()', () => {
        it('Should remove all visits, dataWithErrors and dataWithWarnings arrays', () => {

            // poprawnie dodawane wizyty
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // dodane wizyty z ostrzeżeniami icd10
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', ''], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03', null], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', '    '], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', [true, 'X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // błędne dane
            visits.add('2018-03-01', '84101711210', [' ', '', ''], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', [], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', true, ['A01', 'B02', 'C03'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add(' ', '84101711213', ['X11'], '89.00', '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(8);
            expect(visits.getData.withErrors().length).toBe(4);
            expect(visits.getData.withWarnings().length).toBe(4);

            visits.removeAll();
            
            expect(visits.getAll().length).toBe(0); 
            expect(visits.getData.withErrors().length).toBe(0);
            expect(visits.getData.withWarnings().length).toBe(0);
        }); 
    });

    describe('visits.filterVisits(visitSearchObj)', () => {
        beforeEach(() => {
            visits.removeAll();
            // świadczenia lekarza
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // świadczenia pielęgniarki
            visits.add('2018-03-15', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-16', '84101711211', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-17', '84101711212', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            // patronaże pielęgniarki
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            // patronaże położnej
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
        });

        it('should return all visits matching given pesel', () => {
            const dataPropToFind = {pesel: '84101711210'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(6);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.pesel).toBe(dataPropToFind.pesel);
            });
        });

        it('should return all visits matching given date', () => {
            const dataPropToFind = {date: '2018-03-15'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(4);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.date).toBe(dataPropToFind.date);
            });
        });

        it('should return all visits matching given date and pesel', () => {
            const dataPropToFind = {pesel: '84101711210', date: '2018-03-15'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(3);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.pesel).toBe(dataPropToFind.pesel);
                expect(currFoundVisit.date).toBe(dataPropToFind.date);
            });
        });

        it('should return all visits with given icd9', () => {
            const dataPropToFind = {icd9: '89.05'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(9);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.icd9).toBe(dataPropToFind.icd9);
            });
        });

        it('should return all visits with given staff', () => {
            
            
            const dataPropToFind = {staff: 'RAFAŁ CZEKIEL'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(4);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.staff).toBe(dataPropToFind.staff);
            });
        });

        it('should return all visits with given staff and icd9', () => {
            const dataPropToFind = {staff: 'RAFAŁ CZEKIEL', icd9: '89.05'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(3);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.staff).toBe(dataPropToFind.staff);
                expect(currFoundVisit.icd9).toBe(dataPropToFind.icd9);
            });
        });

        it('should return all visits with given icd9 and visitName', () => {
            const dataPropToFind = {icd9: '89.05', visitName: 'wizyta patronażowa'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(3);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.icd9).toBe(dataPropToFind.icd9);
                expect(currFoundVisit.visitName).toBe(dataPropToFind.visitName);
            });
        });

        it('should return no visit when icd9 and visitName exclude themselves', () => {
            const dataPropToFind = {icd9: '89.00', visitName: 'wizyta patronażowa'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(0);
        });

        it('should return visits matching all properties', () => {
            const dataPropToFind = {date: '2018-03-15', pesel: '84101711210', icd10: ['Z39'], icd9: '89.05', visitName: 'wizyta patronażowa', nfzCode: '5.01.00.0000121', patientFirstName: 'JERZY', patientLastName: 'S', staff: 'DUDYCZ JOLANTA'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(1);
            foundVisits.forEach(currFoundVisit => {
                expect(currFoundVisit.date).toEqual(dataPropToFind.date);
                expect(currFoundVisit.pesel).toEqual(dataPropToFind.pesel);
                expect(currFoundVisit.icd10).toEqual(dataPropToFind.icd10);
                expect(currFoundVisit.icd9).toEqual(dataPropToFind.icd9);
                expect(currFoundVisit.visitName).toEqual(dataPropToFind.visitName);
                expect(currFoundVisit.nfzCode).toEqual(dataPropToFind.nfzCode);
                expect(currFoundVisit.patientFirstName).toEqual(dataPropToFind.patientFirstName);
                expect(currFoundVisit.patientLastName).toEqual(dataPropToFind.patientLastName);
                expect(currFoundVisit.staff).toEqual(dataPropToFind.staff);
            });
        });

        it('should return no visit when just one property is a bit different', () => {
            const dataPropToFind = {date: '2018-03-15', pesel: '84101711210x', icd10: ['Z39'], icd9: '89.05', visitName: 'wizyta patronażowa', nfzCode: '5.01.00.0000121', patientFirstName: 'JERZY', patientLastName: 'S', staff: 'DUDYCZ JOLANTA'};
            const foundVisits = visits.filterVisits(dataPropToFind);
            expect(foundVisits.length).toBe(0);
        });

    });

    describe('visits.findMultipleVisitsOfDay()', () => {
        beforeEach(() => {
            visits.removeAll();
        });

        it('should return object with "multiple visits" for person in day', () => { 
            // BRANE POD UWAGĘ, BO Z KODEM ŚWIADCZEŃ EKSPORTOWANYCH DO NFZ
            // dodawanie świadczeń:
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            visits.add('2018-03-15', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');

            visits.add('2018-03-16', '84101711211', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

            visits.add('2018-03-17', '84101711212', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

            // NIE BRANE POD UWAGĘ BO Z KODEM ŚWIADCZEŃ NIEEKSPORTOWANYCH DO NFZ
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00',  '100204', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', '100205', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00',  '100206', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00',  '100204', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00',  '100205', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100207',  'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            visits.add('2018-03-15', '84101711210', [], '89.05',  '100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '100205', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05',  '100207', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');

            visits.add('2018-03-16', '84101711211', [], '89.05',  '100204', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05',  '100205', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05',  '100207', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

            visits.add('2018-03-17', '84101711212', [], '89.05',  '100204', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05',  '100205', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05',  '100207', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

            // sprawdzenie ilości dodanych wizyt
            expect(visits.getAll().length).toBe(30);
            expect(visits.getData.withErrors().length).toBe(0);

            const multipleVisitsOfDay = visits.findMultipleVisitsOfDay();
            // sprawdzenie ilości znalezionych "dubli" (czyli dni w których było wiele wizyt dla tego samego pacjenta)

            // są duble dla danych
            expect(multipleVisitsOfDay[84101711210]['2018-03-01'].length).toBe(3);
            expect(multipleVisitsOfDay[84101711210]['2018-03-15'].length).toBe(3);
            expect(multipleVisitsOfDay[84101711211]['2018-03-16'].length).toBe(3);
            expect(multipleVisitsOfDay[84101711212]['2018-03-17'].length).toBe(3);

            // nie ma dubli dla tych danych
            expect(multipleVisitsOfDay[84101711211]['2018-03-02']).toBeUndefined();
            expect(multipleVisitsOfDay[84101711212]['2018-03-03']).toBeUndefined();
            expect(multipleVisitsOfDay[84101711213]).toBeUndefined();
        });

        it('should return empty object when there is no "multiple visits"', () => {
            // dodawanie świadczeń:
            visits.add('2018-03-01', '84101711211', ['B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711212', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711213', ['X11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            
            visits.add('2018-03-04', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-05', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-06', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            visits.add('2018-03-07', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-08', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-09', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');

            visits.add('2018-03-10', '84101711211', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-11', '84101711211', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-12', '84101711211', ['Z39.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

            visits.add('2018-03-12', '84101711212', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-13', '84101711212', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-14', '84101711212', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

            const multipleVisitsOfDay = visits.findMultipleVisitsOfDay();
            // sprawdzenie czy znaleziono jakieś "duble" dla zadanych peseli
            expect(multipleVisitsOfDay[84101711210]).toBeUndefined();
            expect(multipleVisitsOfDay[84101711211]).toBeUndefined();
            expect(multipleVisitsOfDay[84101711212]).toBeUndefined();
            expect(multipleVisitsOfDay[84101711213]).toBeUndefined();
        });

        it('should return empty object (not an error) when there are no visits', () => {
            const multipleVisitsOfDay = visits.findMultipleVisitsOfDay();
            expect(JSON.stringify(multipleVisitsOfDay)).toBe(JSON.stringify({}));
        });

    });

    xdescribe('visits.generateReportObj()', () => {
        beforeEach(() => {
            visits.removeAll();
        });

        it('should generate "multiple visits" for person in day in reportObj', () => { 
            // Sprawdza także, czy przez przypadek dla peseli "z dublami" nie raportowane są dane wizyt z dni, kiedy nie nastąpił "dubel" 
            // NIE SPRAWDZA TREŚCI dla wizyty w raporcie, tylko ilości dubli w raporcie dla daneych dni, danych peseli

            // ----------------------------------------------------------------------
            // duble
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            
            visits.add('2018-03-15', '84101711210', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            
            // ----------------------------------------------------------------------
            // bez dubli (nie powinno być raportowane):
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble:
            visits.add('2018-03-16', '84101711211', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            // ----------------------------------------------------------------------
            // bez dubli (nie powinno być raportowane):
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble
            visits.add('2018-03-17', '84101711212', [], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
            // ----------------------------------------------------------------------
            // bez dubli (nie powinno być raportowane):
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            visits.findMultipleVisitsOfDay();
            const reportObj = visits.generateReportObj();
            visits.saveReportAsJSON(); //wyeksportowanie podglądu TYMCZASOWE

            // dla powyższych danych nie powinno być żadnych errorów ani ostrzeżeń
            expect(reportObj.dataWithErrors.length).toBe(0);
            expect(reportObj.dataWithWarnings.length).toBe(0);

            // sprawdzenie dubli
            expect(reportObj.multipleVisits['84101711210']['2018-03-01'].length).toBe(3);
            expect(reportObj.multipleVisits['84101711210']['2018-03-15'].length).toBe(3);
            
            expect(reportObj.multipleVisits['84101711211']['2018-03-16'].length).toBe(3);
            expect(reportObj.multipleVisits['84101711211']['2018-03-02']).toBeUndefined();

            expect(reportObj.multipleVisits['84101711212']['2018-03-17'].length).toBe(3);
            expect(reportObj.multipleVisits['84101711212']['2018-03-03']).toBeUndefined();

            expect(reportObj.multipleVisits['84101711213']).toBeUndefined(); //nie ma żadnego dubla dla tego peselu

            
        });
        
    });

    describe('visits.convertAllToCsv', () => {
        it('should convert visits to only header as there is empty visitsArr given, with default separators', () => {

            const csvText = visits.convertAllToCsv([]);
            expect(csvText).toBe('Data\tKod MZ\tKod NFZ\tNazwa\tICD-10 1\tICD-10 2\tICD-10 3\tICD-10 4\tICD-9 1\tICD-9 2\tICD-9 3\tICD-9 4\tICD-9 5\tICD-9 6\tICD-9 7\tICD-9 8\tICD-9 9\tICD-9 10\tPacjent\tPesel\tPersonel\tNumer kuponu RUM\r\n');
        });

        it('should convert visits to only header as there is empty visitsArr given, with given separators', () => {

            const csvText = visits.convertAllToCsv([],', ', '; ');
            expect(csvText).toBe('Data, Kod MZ, Kod NFZ, Nazwa, ICD-10 1, ICD-10 2, ICD-10 3, ICD-10 4, ICD-9 1, ICD-9 2, ICD-9 3, ICD-9 4, ICD-9 5, ICD-9 6, ICD-9 7, ICD-9 8, ICD-9 9, ICD-9 10, Pacjent, Pesel, Personel, Numer kuponu RUM; ');
        });

        it('should return false as given visitsArr is not array with only class Visits instances', () => {
            const visitsArr = [
                {cosTam: false}, //nie jest instancją Visits
                new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '100204', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['Z11'], '89.00',  '100205', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '100207',  'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-15', '84101711210', [], '89.05',  '100204', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne'),
            ];

            expect(visits.convertAllToCsv(visitsArr)).toBeFalsy();
        });

        it('should convert visits arr to csv text, with default separators', () => {

            const visitsArr = [
                // poprawne instancje Visits
                new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                
                new visits.Visit('2018-03-15', '84101711217', [], '89.05',  '100204', 'FRANEK', 'D', 'HOSNER ALINA', 'świadczenie profilaktyczne'),
                new visits.Visit('2018-03-15', '84101711210', ['Z76.2', 'A01', 'B02', 'C03'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
            ];
            const csvText = visits.convertAllToCsv(visitsArr);
            const expectedCsv = 'Data\tKod MZ\tKod NFZ\tNazwa\tICD-10 1\tICD-10 2\tICD-10 3\tICD-10 4\tICD-9 1\tICD-9 2\tICD-9 3\tICD-9 4\tICD-9 5\tICD-9 6\tICD-9 7\tICD-9 8\tICD-9 9\tICD-9 10\tPacjent\tPesel\tPersonel\tNumer kuponu RUM\r\n' 
                                + '2018-03-01\t\t5.01.00.0000121\tporada lekarska udzielona w miejscu udzielania świadczeń\tY11\t\t\t\t89.00\t\t\t\t\t\t\t\t\t\tS JERZY\t84101711210\tRAHMAN IRENA\t\r\n'
                                + '2018-03-01\t\t5.01.00.0000121\tporada lekarska udzielona w miejscu udzielania świadczeń\tA01\tB02\tC03\t\t89.00\t\t\t\t\t\t\t\t\t\tS JERZY\t84101711210\tDUDYCZ JOLANTA\t\r\n'
                                + '2018-03-15\t\t100204\tświadczenie profilaktyczne\t\t\t\t\t89.05\t\t\t\t\t\t\t\t\t\tD FRANEK\t84101711217\tHOSNER ALINA\t\r\n'
                                + '2018-03-15\t\t5.01.00.0000121\twizyta patronażowa pielęgniarki poz\tZ76.2\tA01\tB02\tC03\t89.05\t\t\t\t\t\t\t\t\t\tS JERZY\t84101711210\tDUDYCZ JOLANTA\t\r\n';

            expect(csvText).toBe(expectedCsv);
        });

        it('should convert visits arr to csv text, with given separators , and ;', () => {

            const visitsArr = [
                // poprawne instancje Visits
                new visits.Visit('2018-03-01', '84101711210', ['Y11'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                new visits.Visit('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'),
                
                new visits.Visit('2018-03-15', '84101711217', [], '89.05',  '100204', 'FRANEK', 'D', 'HOSNER ALINA', 'świadczenie profilaktyczne'),
                new visits.Visit('2018-03-15', '84101711210', ['Z76.2', 'A01', 'B02', 'C03'], '89.05',  '5.01.00.0000121', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz'),
            ];
            const csvText = visits.convertAllToCsv(visitsArr, ',', ';');
            const expectedCsv = 'Data,Kod MZ,Kod NFZ,Nazwa,ICD-10 1,ICD-10 2,ICD-10 3,ICD-10 4,ICD-9 1,ICD-9 2,ICD-9 3,ICD-9 4,ICD-9 5,ICD-9 6,ICD-9 7,ICD-9 8,ICD-9 9,ICD-9 10,Pacjent,Pesel,Personel,Numer kuponu RUM;' 
                                + '2018-03-01,,5.01.00.0000121,porada lekarska udzielona w miejscu udzielania świadczeń,Y11,,,,89.00,,,,,,,,,,S JERZY,84101711210,RAHMAN IRENA,;'
                                + '2018-03-01,,5.01.00.0000121,porada lekarska udzielona w miejscu udzielania świadczeń,A01,B02,C03,,89.00,,,,,,,,,,S JERZY,84101711210,DUDYCZ JOLANTA,;'
                                + '2018-03-15,,100204,świadczenie profilaktyczne,,,,,89.05,,,,,,,,,,D FRANEK,84101711217,HOSNER ALINA,;'
                                + '2018-03-15,,5.01.00.0000121,wizyta patronażowa pielęgniarki poz,Z76.2,A01,B02,C03,89.05,,,,,,,,,,S JERZY,84101711210,DUDYCZ JOLANTA,;';

            expect(csvText).toBe(expectedCsv);
        });

    });
});