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
  
  it('Should add "teleporada covid" without error/warning', () => {
    // 5.62.01.0000011	teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2	U07.1
    visits.add(
      '2018-03-15',
      '84101711219',
      ['U07.1'],
      '89.00',
      '5.62.01.0000011',
      'JERZY',
      'S',
      'D JOLANTA',
      'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });

    it('Should add "porada covid" without error/warning', () => {
    // 5.62.01.0000012	porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2	U07.1
    visits.add(
      '2018-03-15',
      '84101711219',
      ['U07.1'],
      '89.00',
      '5.62.01.0000012',
      'JERZY',
      'S',
      'D JOLANTA',
      'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
    });
  
  it('Should add "wizyta domowa covid" without error/warning', () => {
    // 5.62.01.0000013	lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2	U07.1
    visits.add(
      '2018-03-15',
      '84101711219',
      ['U07.1'],
      '89.00',
      '5.62.01.0000013',
      'JERZY',
      'S',
      'D JOLANTA',
      'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });

});
