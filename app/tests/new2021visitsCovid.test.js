const _ = require('lodash');
const expect = require('expect');

const visits = require('../modules/visits');
// const { saveJSON } = require('../modules/utils');
// const { nfzCodeIsExported } = require('../config/visitsConfig');

beforeEach(() => {
  visits.removeAll();
});



describe('new tests for covid visits from 03.2021', () => {
  beforeEach(() => {
    visits.removeAll();
  });
  
  describe('covid visits:', () => {
    it('Should add proper "covid - teleporada" visit', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', '5.62.01.0000011', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2');

        expect(visits.getAll().length).toBe(1);
        expect(visits.getData.withErrors().length).toBe(0);
        expect(visits.getData.withWarnings().length).toBe(0);

        expect(visits.filterVisits({nfzCode: '5.62.01.0000011'}).length).toBe(1);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000012'}).length).toBe(0);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000013'}).length).toBe(0);
    });

    it('Should add proper "covid - wizyta" visit', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', '5.62.01.0000012', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(1);
        expect(visits.getData.withErrors().length).toBe(0);
        expect(visits.getData.withWarnings().length).toBe(0);

        expect(visits.filterVisits({nfzCode: '5.62.01.0000011'}).length).toBe(0);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000012'}).length).toBe(1);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000013'}).length).toBe(0);
    });

    it('Should add proper "covid - wizyta domowa" visit', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', '5.62.01.0000013', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(1);
        expect(visits.getData.withErrors().length).toBe(0);
        expect(visits.getData.withWarnings().length).toBe(0);

        expect(visits.filterVisits({nfzCode: '5.62.01.0000011'}).length).toBe(0);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000012'}).length).toBe(0);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000013'}).length).toBe(1);
    });

    it('Should reject "covid - teleporada" visit with no "U07.1" code', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U08'], '89.00', '5.62.01.0000011', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        
        expect(visits.filterVisits({nfzCode: '5.62.01.0000011'}).length).toBe(0);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000012'}).length).toBe(0);
        expect(visits.filterVisits({nfzCode: '5.62.01.0000013'}).length).toBe(0);
    });

    it('Should reject "covid - wizyta" visit with no "U07.1" code', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U08'], '89.00', '5.62.01.0000012', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta domowa" visit with no "U07.1" code', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U08'], '89.00', '5.62.01.0000013', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });
    it('Should reject "covid - teleporada" visit with no proper nfzCode', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', 'xxx', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta" visit with no proper nfzCode', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', 'xxx', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta domowa" visit with no proper nfzCode', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', 'xxx', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });
    it('Should reject "covid - teleporada" visit with no proper visitName', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', '5.62.01.0000011', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'xxx');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta" visit with no proper visitName', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', '5.62.01.0000012', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'xxx');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta domowa" visit with no proper visitName', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'U07.1'], '89.00', '5.62.01.0000013', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'xxx');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - teleporada" visit with no covid icd-10 but with covid nfzCode', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'Z10'], '89.00', 'xxx', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta" visit with no covid icd-10 but with covid nfzCode', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'Z10'], '89.00', 'xxx', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta domowa" visit with no covid icd-10 but with covid nfzCode', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'Z10'], '89.00', 'xxx', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });
    it('Should reject "covid - teleporada" visit with no covid icd-10 but with covid visitName', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'Z10'], '89.00', '5.62.01.0000011', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'xxx');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta" visit with no covid icd-10 but with covid visitName', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'Z10'], '89.00', '5.62.01.0000012', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'xxx');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });

    it('Should reject "covid - wizyta domowa" visit with no covid icd-10 but with covid visitName', () => {

        let visitAdded = visits.add('2018-03-01', '84101711219', ['A01', 'B02', 'C03', 'Z10'], '89.00', '5.62.01.0000013', 'JERZY', 'S', 'DUDYCZ JOLANTA', 'xxx');

        expect(visits.getAll().length).toBe(0);
        expect(visits.getData.withErrors().length).toBe(1);
        expect(visits.getData.withWarnings().length).toBe(0);
        expect(visits.getData.withCovid().length).toBe(0);
    });
})

});
