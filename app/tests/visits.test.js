const _ = require('lodash');
const expect = require('expect');

const visits = require('../modules/visits');

beforeEach(() => {
    visits.removeAll();
});

describe('Module visits', () => {

    describe('visits.add()', () => {

        describe('success:', () => {
            it('Should add doctors\' visits', () => {
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(4);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add doctors\' visits with warning - when some invalid icd10 codes found', () => {
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C3'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', '84101711211', ['B02', false], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'C'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-04', '84101711213', ['X11', 100], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(4);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(4);
            });

            it('Should add nurses\' visits - "świadczenia świadczenie profilaktyczne", "świadczenie diagnostyczne" and "świadczenie pielęgnacyjne"', () => {
                visits.add('2018-03-15', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
                visits.add('2018-03-16', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
                visits.add('2018-03-17', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add nurses\' patronages', () => {
                visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add midwifes\' patronages', () => {
                visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
                visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add midwifes\' home visit', () => {
                visits.add('2018-03-15', '84101711210', ['Z39.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta domowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta domowa');
                visits.add('2018-03-17', '84101711212', ['Z39.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta domowa');

                expect(visits.getAll().length).toBe(3);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add patronages when also other valid but non-patronage icd10 given', () => {
                // patronaże pielęgniarki
                visits.add('2018-03-15', '84101711210', ['Z76.2', 'Z01'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-16', '84101711211', ['Z10', 'Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', '84101711212', ['A10', 'Z76.2', 'B11'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39', 'Z10'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['C11', 'Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
                visits.add('2018-03-17', '84101711212', ['D13', 'Z39', 'B18'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

                expect(visits.getAll().length).toBe(6);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should add patronages and add to warnings when also other icd10 (invalid at all) given', () => {
                // patronaże pielęgniarki
                visits.add('2018-03-16', '84101711211', ['Z76.2', true], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', '84101711212', ['Z76.2', 'Z0'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39', 100], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2', ''], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

                expect(visits.getAll().length).toBe(4);
                expect(visits.getData.withErrors().length).toBe(0);
                expect(visits.getData.withWarnings().length).toBe(4);
            });
        });

        // // poprawne dane zebrane:
        // // świadczenia lekarza
        // visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        // visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        // visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        // visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        // // świadczenia pielęgniarki
        // visits.add('2018-03-15', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
        // visits.add('2018-03-16', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
        // visits.add('2018-03-17', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
        // // patronaże pielęgniarki
        // visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
        // visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
        // visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
        // // patronaże położnej
        // visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
        // visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
        // visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

        describe('failure:', () => {
            it('Should not add visits because an parameter is missing', () => {
                // świadczenia lekarza
                visits.add('84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-03', '84101711212', '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // świadczenia pielęgniarki
                visits.add('2018-03-15', '84101711210', [], '89.05', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
                visits.add('2018-03-16', '84101711211', [], '89.05', 'JERZY', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
                visits.add('2018-03-17', '84101711212', [], '89.05', 'JERZY', 'S', 'świadczenie pielęgnacyjne');
                // patronaże pielęgniarki
                visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA');
                visits.add('84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
                visits.add('2018-03-17', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
                visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'BEATA NOWAK', 'wizyta patronażowa');

                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(15);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong date parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add(undefined, '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(null, '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(false, '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(true, '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(102, '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add(2018-03-02, '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('    ', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-022', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-0', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(10);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong pesel parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', undefined, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', null, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', false, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', true, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', 102, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', 84101711210, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '   ', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '884101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '4101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(10);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong icd9 parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie pielęgnacyjne');
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
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', undefined, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', null, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', false, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', true, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 100, 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', '  ', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(7);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong patientLastName parameter', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', undefined, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', null, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', false, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', true, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 1, 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', '', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'SK', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                
                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(7);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong visitName argument', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', undefined);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', null);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', false);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', true);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 5);
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', '');
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', '    ');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(7);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            // ICD10

            it('Should not add visits because of wrong icd10 argument type when icd10 required ', () => {
                // poprawne
                visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // niepoprawne
                visits.add('2018-03-01', '84101711210', undefined, '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', null, '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', false, '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', true, '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 100, '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 'Z01', '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', '', '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ' ', '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(1);
                expect(visits.getData.withErrors().length).toBe(8);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because of wrong icd10 argument type when icd10 not required (patronage or nurse\'s visit', () => {
                // niepoprawne
                visits.add('2018-03-01', '84101711210', undefined, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', null, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', false, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', true, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 100, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', 'Z01', '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', '', '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ' ', '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(8);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because icd10 required and didn\'t given any valid', () => {
                // niepoprawne
                visits.add('2018-03-01', '84101711210', [], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['', 'Z0'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['   ', 'X0'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');


                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(3);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because icd10 not required and it is not valid for patronage', () => {
                visits.add('2018-03-01', '84101711210', ['Z10'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [''], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', ['X0'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [100], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-01', '84101711210', [true], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(5);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

            it('Should not add visits because icd9 and icd10 for patronage but visit name not valid for it', () => {
                // patronaże pielęgniarki
                visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                // patronaże położnej
                visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
                visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');

                expect(visits.getAll().length).toBe(0);
                expect(visits.getData.withErrors().length).toBe(6);
                expect(visits.getData.withWarnings().length).toBe(0);
            });

        });

    });

    describe('visits.removeAll()', () => {
        it('Should remove all visits, dataWithErrors and dataWithWarnings arrays', () => {

            // poprawnie dodawane wizyty
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // dodane wizyty z ostrzeżeniami icd10
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', ''], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03', null], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', '    '], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', [true, 'X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // błędne dane
            visits.add('2018-03-01', '84101711210', [' ', '', ''], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', [], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', true, ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add(' ', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

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
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // świadczenia pielęgniarki
            visits.add('2018-03-15', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-16', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-17', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            // patronaże pielęgniarki
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            // patronaże położnej
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
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

    });

    describe('visits.findMultipleVisitsOfDay()', () => {
        beforeEach(() => {
            visits.removeAll();
        });

        it('should return array with "multiple visits" for person in day', () => { 
            // dodawanie świadczeń:
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            visits.add('2018-03-15', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');

            visits.add('2018-03-16', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

            visits.add('2018-03-17', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

            const multipleVisitsOfDay = visits.findMultipleVisitsOfDay();
            // sprawdzenie ilości znalezionych "dubli" (czyli dni w których było wiele wizyt dla tego samego pacjenta)
            expect(multipleVisitsOfDay.length).toBe(4);


            // są duble dla danych
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-01', pesel: '84101711210'}).length).toBe(1); //oznacza, że znaleziono więcej niż jedną wizytę dla danego peselu danego dnia
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-15', pesel: '84101711210'}).length).toBe(1); //oznacza, że znaleziono więcej niż jedną wizytę dla danego peselu danego dnia
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-16', pesel: '84101711211'}).length).toBe(1); //oznacza, że znaleziono więcej niż jedną wizytę dla danego peselu danego dnia
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-17', pesel: '84101711212'}).length).toBe(1); //oznacza, że znaleziono więcej niż jedną wizytę dla danego peselu danego dnia

            // nie ma dubli dla tych danych
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-02', pesel: '84101711211'}).length).toBe(0); //oznacza, że nie znaleziono więcej niż jednej wizytę dla danego peselu danego dnia
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-03', pesel: '84101711212'}).length).toBe(0); //oznacza, że nie znaleziono więcej niż jednej wizytę dla danego peselu danego dnia
            expect(_.filter(multipleVisitsOfDay, {date: '2018-03-15', pesel: '84101711213'}).length).toBe(0); //oznacza, że nie znaleziono więcej niż jednej wizytę dla danego peselu danego dnia
        });

        it('should return empty array when there is no "multiple visits"', () => {
            // dodawanie świadczeń:
            visits.add('2018-03-01', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            
            visits.add('2018-03-04', '84101711210', ['Y11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-05', '84101711210', ['Z11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-06', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            visits.add('2018-03-07', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-08', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-09', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');

            visits.add('2018-03-10', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-11', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-12', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');

            visits.add('2018-03-12', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-13', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-14', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');

            const multipleVisitsOfDay = visits.findMultipleVisitsOfDay();
            // sprawdzenie ilości znalezionych "dubli" (czyli dni w których było wiele wizyt dla tego samego pacjenta)
            expect(multipleVisitsOfDay.length).toBe(0);
        });

        it('should return empty array (not an error) when there are no visits', () => {
            const multipleVisitsOfDay = visits.findMultipleVisitsOfDay();
            expect(multipleVisitsOfDay.length).toBe(0);
        });

    });

    describe('visits.generateReportObj()', () => {
        beforeEach(() => {
            visits.removeAll();
        });

        it('should generate "multiple visits" for person in day in reportObj', () => { 
            // Sprawdza także, czy przez przypadek dla peseli "z dublami" nie raportowane są dane wizyt z dni, kiedy nie nastąpił "dubel" 
            // NIE SPRAWDZA TREŚCI dla wizyty w raporcie, tylko ilości dubli w raporcie dla daneych dni, danych peseli

            // ----------------------------------------------------------------------
            // duble
            visits.add('2018-03-01', '84101711210', ['Y11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['Z11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            
            visits.add('2018-03-15', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'świadczenie profilaktyczne');
            visits.add('2018-03-15', '84101711210', ['Z76.2'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-15', '84101711210', ['Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'wizyta patronażowa');
            
            // ----------------------------------------------------------------------
            // bez dubli (nie powinno być raportowane):
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble:
            visits.add('2018-03-16', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'świadczenie diagnostyczne');
            visits.add('2018-03-16', '84101711211', ['Z76.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-16', '84101711211', ['Z39.2'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'wizyta patronażowa');
            // ----------------------------------------------------------------------
            // bez dubli (nie powinno być raportowane):
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            // duble
            visits.add('2018-03-17', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'świadczenie pielęgnacyjne');
            visits.add('2018-03-17', '84101711212', ['Z76.2'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa pielęgniarki poz');
            visits.add('2018-03-17', '84101711212', ['Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'wizyta patronażowa');
            // ----------------------------------------------------------------------
            // bez dubli (nie powinno być raportowane):
            visits.add('2018-03-15', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

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
            expect(reportObj.multipleVisits['84101711211']['2018-03-02']).toNotExist();

            expect(reportObj.multipleVisits['84101711212']['2018-03-17'].length).toBe(3);
            expect(reportObj.multipleVisits['84101711212']['2018-03-03']).toNotExist();

            expect(reportObj.multipleVisits['84101711213']).toNotExist(); //nie ma żadnego dubla dla tego peselu

            
        });
        
    });
});