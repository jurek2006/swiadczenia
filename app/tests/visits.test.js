const expect = require('expect');

const visits = require('../modules/visits');

beforeEach(() => {
    visits.removeAll();
});

describe('Module visits', () => {

    describe('visits.add()', () => {

        it('Should add visits using add() for proper data', () => {

            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(0);
            expect(visits.getData.withWarnings().length).toBe(0);
        }); 

        it('Should not add visits with undefined or empty or not string date argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano date ale to ostatni argument będzie undefined
            visits.add('', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('   ', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-4', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date za krótka
            visits.add(true, '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
            visits.add(100, '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
            visits.add(null, '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
            // dodać testowanie porawności daty

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(7);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or not string pesel argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano pesel ale to ostatni argument będzie undefined
            visits.add('2018-03-01', '', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '    ', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '8410111213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel za krótki
            visits.add('2018-03-01', true, ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
            visits.add('2018-03-01', 100, ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
            visits.add('2018-03-01', null, ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
            // dodać testowanie porawności pesel

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(7);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString patientFirstName argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano patientFirstName ale  to visitName będzie undefined
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '    ', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 100, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', true, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', null, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(6);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString patientLastName argument. Has to be only one character long', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', '', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', ' ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', '    ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'SK', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', true, 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 333, 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');


            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(7);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString staff argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', '', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', '   ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', true, 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 999, 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(5);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString visitName argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', '');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', '  ');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', false);
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 888);
            
            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(5);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with empty icd10 array argument when icd9 is different from allowing it', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', [], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', [''], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['', '   ', ' '], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X1'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
            visits.add('2018-03-04', '84101711213', [true, null, 100], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withWarnings().length).toBe(0);
            expect(visits.getData.withErrors().length).toBe(5);
        });

        it('Should add visits and add to withWarnings with at least one valid element in icd10 argument and any invalid', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '89.00', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '89.00', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // dane z ostrzeżeniem:
            visits.add('2018-03-04', '84101711213', ['X11', '', ' '], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //jeden kod jest poprawny
            visits.add('2018-03-04', '84101711213', ['A21', null, true], '89.00', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //jeden kod jest poprawny

            expect(visits.getAll().length).toBe(6);
            expect(visits.getData.withWarnings().length).toBe(2);
            expect(visits.getData.withErrors().length).toBe(0);
        });

        it('Should add visits with empty icd10 array argument when icd9 allows it', () => {
            // poprawne, bo dla zadanego icd9 nie jest potrzebne żadne icd10
            visits.add('2018-03-01', '84101711210', [], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', [], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', [], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', [], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
            visits.add('2018-03-04', '84101711213', [], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

            expect(visits.getAll().length).toBe(5);
            expect(visits.getData.withWarnings().length).toBe(0);
            expect(visits.getData.withErrors().length).toBe(0);
        });

        it('Should not add visits when given icd9 which allows(and requires) to not have any icd10 and given any icd10', () => {
            //błędne, bo gdy icd9 pozwala na brak icd10 to icd10 nie może zawierać żadnego poprawnego icd10
            visits.add('2018-03-02', '84101711211', ['Z10'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['', '   ', 'Z11'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X1', null], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
            visits.add('2018-03-04', '84101711213', ['F11', 'K12'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

            //również błędne, bo gdy icd9 pozwala na brak icd10 to icd10 powinno być pustą tablicą
            visits.add('2018-03-02', '84101711211', [''], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['', '   ', ' '], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X1'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
            visits.add('2018-03-04', '84101711213', [true, null, 100], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

            expect(visits.getAll().length).toBe(0);
            expect(visits.getData.withWarnings().length).toBe(0);
            expect(visits.getData.withErrors().length).toBe(8);
        });

        it('Should not add visits when given icd9 which allows(and requires) to not have any icd10 but icd10 given undefined or not other not an array', () => {
            // niepoprawne dane:
            visits.add('2018-03-01', '84101711210', undefined, '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', 100, '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', 'Z10', '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', null, '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
            visits.add('2018-03-04', '84101711213', true, '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

            expect(visits.getAll().length).toBe(0);
            expect(visits.getData.withWarnings().length).toBe(0);
            expect(visits.getData.withErrors().length).toBe(5);
        });

        it('Should add midwife\'s visits - when isIcd10NotRequired (and not allowed) but there\'s icd10 and it is in icd10MidwifeAllowed ', () => {
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', 'Z39'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'Z39.2', 'C03'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'Z39'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['Z39'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(0);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add midwife\'s visits - when isIcd10NotRequired (and not allowed) but none of icd10 is in icd10MidwifeAllowed ', () => {
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', 'Z19'], '89.05', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'Z39.1', 'C03'], '89.05', 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03', 'Z29'], '89.05', 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['B39'], '89.05', 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(0);
            expect(visits.getData.withErrors().length).toBe(4);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should add visits for "świadczenia świadczenie profilaktyczne", "świadczenie diagnostyczne" and "świadczenie pielęgnacyjne"', () => {
            visits.add('2018-03-14', '84101712823', [], '89.05', 'JERZY', 'S', 'HOSNER-JEKA ALINA', 'świadczenie profilaktyczne');
            visits.add('2018-03-14', '84101712823', [], '89.05', 'JERZY', 'S', 'HOSNER-JEKA ALINA', 'świadczenie diagnostyczne');
            visits.add('2018-03-14', '84101712823', [], '89.05', 'JERZY', 'S', 'HOSNER-JEKA ALINA', 'świadczenie lecznicze');
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
})