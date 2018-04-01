const expect = require('expect');

const visits = require('../modules/visits');

beforeEach(() => {
    visits.removeAll();
});

describe('Module visits', () => {

    describe('visits.add()', () => {

        it('Should add visits using add() for proper data', () => {

            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(0);
            expect(visits.getData.withWarnings().length).toBe(0);
        }); 

        it('Should not add visits with undefined or empty or not string date argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano date ale to ostatni argument będzie undefined
            visits.add('', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('   ', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-4', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date za krótka
            visits.add(true, '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
            visits.add(100, '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
            visits.add(null, '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //date nie jest stringiem
            // dodać testowanie porawności daty

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(7);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or not string pesel argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano pesel ale to ostatni argument będzie undefined
            visits.add('2018-03-01', '', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '    ', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-01', '8410111213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel za krótki
            visits.add('2018-03-01', true, ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
            visits.add('2018-03-01', 100, ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
            visits.add('2018-03-01', null, ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //pesel nie jest stringiem
            // dodać testowanie porawności pesel

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(7);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString patientFirstName argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //nie podano patientFirstName ale  to visitName będzie undefined
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], '', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], '    ', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 100, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', true, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', null, 'porada lekarska udzielona w miejscu udzielania świadczeń'); //patientFirstName nie jest stringiem

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(6);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString patientLastName argument. Has to be only one character long', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', '', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', ' ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', '    ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'SK', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', true, 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 333, 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');


            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(7);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString staff argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', '', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', '   ', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', true, 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 999, 'porada lekarska udzielona w miejscu udzielania świadczeń');

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(5);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with undefined or empty or notString visitName argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', '');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', '  ');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', false);
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 888);
            
            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withErrors().length).toBe(5);
            expect(visits.getData.withWarnings().length).toBe(0);
        });

        it('Should not add visits with empty icd10 array argument', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // niepoprawne:
            visits.add('2018-03-01', '84101711210', [], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', [''], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['', '   ', ' '], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X1'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //za któtki kod icd10
            visits.add('2018-03-04', '84101711213', [true, null, 100], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //żaden z elementów icd10 nie jest stringiem

            expect(visits.getAll().length).toBe(4);
            expect(visits.getData.withWarnings().length).toBe(0);
            expect(visits.getData.withErrors().length).toBe(5);
        });

        it('Should add visits and add to withWarnings with at least one valid element in icd10 argument and any invalid', () => {
            // poprawne dane:
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // dane z ostrzeżeniem:
            visits.add('2018-03-04', '84101711213', ['X11', '', ' '], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //jeden kod jest poprawny
            visits.add('2018-03-04', '84101711213', ['A21', null, true], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń'); //jeden kod jest poprawny

            expect(visits.getAll().length).toBe(6);
            expect(visits.getData.withWarnings().length).toBe(2);
            expect(visits.getData.withErrors().length).toBe(0);
        });

    });

    describe('visits.removeAll()', () => {
        it('Should remove all visits, dataWithErrors and dataWithWarnings arrays', () => {

            // poprawnie dodawane wizyty
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03'], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // dodane wizyty z ostrzeżeniami icd10
            visits.add('2018-03-01', '84101711210', ['A01', 'B02', 'C03', ''], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', ['B02', 'C03', null], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', '84101711212', ['A01', 'B02', '    '], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-04', '84101711213', [true, 'X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

            // błędne dane
            visits.add('2018-03-01', '84101711210', [' ', '', ''], 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-02', '84101711211', [], 'JERZY', 'S', 'RAFAŁ CZEKIEL', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add('2018-03-03', true, ['A01', 'B02', 'C03'], 'JERZY', 'S', 'BEATA NOWAK', 'porada lekarska udzielona w miejscu udzielania świadczeń');
            visits.add(' ', '84101711213', ['X11'], 'JERZY', 'S', 'RAHMAN IRENA', 'porada lekarska udzielona w miejscu udzielania świadczeń');

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