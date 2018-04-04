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

            // it('Should not add visits because icd10 required and didn\'t given any valid', () => {
            //     // niepoprawne
            //     visits.add('2018-03-01', '84101711210', [], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            //     visits.add('2018-03-01', '84101711210', ['', 'Z0'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            //     visits.add('2018-03-01', '84101711210', ['   ', 'X0'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');


            //     expect(visits.getAll().length).toBe(0);
            //     expect(visits.getData.withErrors().length).toBe(3);
            //     expect(visits.getData.withWarnings().length).toBe(0);
            // });
        });

        // it('Should add visits using add() for proper data', () => {


        // }); 

        // it('Should not add visits with undefined or empty or not string date argument', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano date ale to ostatni argument będzie undefined
        //     visits.add('', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('   ', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-4', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date za krótka
        //     visits.add(true, '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
        //     visits.add(100, '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
        //     visits.add(null, '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
        //     // dodać testowanie porawności daty

        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(7);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add visits with undefined or empty or not string pesel argument', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('2018-03-01', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano pesel ale to ostatni argument będzie undefined
        //     visits.add('2018-03-01', '', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-01', '    ', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-01', '8410111213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel za krótki
        //     visits.add('2018-03-01', true, ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
        //     visits.add('2018-03-01', 100, ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
        //     visits.add('2018-03-01', null, ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
        //     // dodać testowanie porawności pesel

        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(7);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add visits with undefined or empty or notString patientFirstName argument', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano patientFirstName ale  to visitName będzie undefined
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '    ', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 100, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', true, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', null, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem

        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(6);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add visits with undefined or empty or notString patientLastName argument. Has to be only one character long', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', '', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', ' ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', '    ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'SK', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', true, 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 333, 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');


        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(7);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add visits with undefined or empty or notString staff argument', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', '', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', '   ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', true, 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 999, 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(5);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add visits with undefined or empty or notString visitName argument', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', '');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', '  ');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', false);
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 888);
            
        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(5);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add visits with empty icd10 array argument when icd9 is different from allowing it', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // niepoprawne:
        //     visits.add('2018-03-01', '84101711210', [], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', [''], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['', '   ', ' '], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X1'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
        //     visits.add('2018-03-04', '84101711213', [true, null, 100], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        //     expect(visits.getData.withErrors().length).toBe(5);
        // });

        // it('Should add visits and add to withWarnings with at least one valid element in icd10 argument and any invalid', () => {
        //     // poprawne dane:
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     // dane z ostrzeżeniem:
        //     visits.add('2018-03-04', '84101711213', ['X11', '', ' '], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //jeden kod jest poprawny
        //     visits.add('2018-03-04', '84101711213', ['A21', null, true], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //jeden kod jest poprawny

        //     expect(visits.getAll().length).toBe(6);
        //     expect(visits.getData.withWarnings().length).toBe(2);
        //     expect(visits.getData.withErrors().length).toBe(0);
        // });

        // it('Should add visits with empty icd10 array argument when icd9 allows it', () => {
        //     // poprawne, bo dla zadanego icd9 nie jest potrzebne żadne icd10
        //     visits.add('2018-03-01', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', [], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
        //     visits.add('2018-03-04', '84101711213', [], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

        //     expect(visits.getAll().length).toBe(5);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        //     expect(visits.getData.withErrors().length).toBe(0);
        // });

        // it('Should not add visits when given icd9 which allows(and requires) to not have any icd10 and given any icd10', () => {
        //     //błędne, bo gdy icd9 pozwala na brak icd10 to icd10 nie może zawierać żadnego poprawnego icd10
        //     visits.add('2018-03-02', '84101711211', ['Z10'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['', '   ', 'Z11'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X1', null], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
        //     visits.add('2018-03-04', '84101711213', ['F11', 'K12'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

        //     //również błędne, bo gdy icd9 pozwala na brak icd10 to icd10 powinno być pustą tablicą
        //     visits.add('2018-03-02', '84101711211', [''], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['', '   ', ' '], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['X1'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
        //     visits.add('2018-03-04', '84101711213', [true, null, 100], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

        //     expect(visits.getAll().length).toBe(0);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        //     expect(visits.getData.withErrors().length).toBe(8);
        // });

        // it('Should not add visits when given icd9 which allows(and requires) to not have any icd10 but icd10 given undefined or not other not an array', () => {
        //     // niepoprawne dane:
        //     visits.add('2018-03-01', '84101711210', undefined, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', 100, '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', 'Z10', '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', null, '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
        //     visits.add('2018-03-04', '84101711213', true, '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

        //     expect(visits.getAll().length).toBe(0);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        //     expect(visits.getData.withErrors().length).toBe(5);
        // });

        // it('Should add midwife\'s visits - when isIcd10NotRequired (and not allowed) but there\'s icd10 and it is in icd10MidwifeAllowed ', () => {
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', 'Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'Z39.2', 'C03'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['Z39'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     expect(visits.getAll().length).toBe(4);
        //     expect(visits.getData.withErrors().length).toBe(0);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should not add midwife\'s visits - when isIcd10NotRequired (and not allowed) but none of icd10 is in icd10MidwifeAllowed ', () => {
        //     visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', 'Z19'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-02', '84101711211', ['B02', 'Z39.1', 'C03'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'Z29'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
        //     visits.add('2018-03-04', '84101711213', ['B39'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

        //     expect(visits.getAll().length).toBe(0);
        //     expect(visits.getData.withErrors().length).toBe(4);
        //     expect(visits.getData.withWarnings().length).toBe(0);
        // });

        // it('Should add visits for "świadczenia świadczenie profilaktyczne", "świadczenie diagnostyczne" and "świadczenie pielęgnacyjne"', () => {
        //     visits.add('2018-03-14', '84101712823', [], '89.05', 'JERZY', 'S', 'HOSNER-JEKA ALINA', 'świadczenie profilaktyczne');
        //     visits.add('2018-03-14', '84101712823', [], '89.05', 'JERZY', 'S', 'HOSNER-JEKA ALINA', 'świadczenie diagnostyczne');
        //     visits.add('2018-03-14', '84101712823', [], '89.05', 'JERZY', 'S', 'HOSNER-JEKA ALINA', 'świadczenie lecznicze');
        // });

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
})