const _ = require('lodash');
const expect = require('expect');

const visits = require('../modules/visits');
// const { saveJSON } = require('../modules/utils');
// const { nfzCodeIsExported } = require('../config/visitsConfig');

beforeEach(() => {
  visits.removeAll();
});

describe('new tests for visits - 2020', () => {
  beforeEach(() => {
    visits.removeAll();
  });

  it('Should add "świadczenia profilaktyczne" without error/warning', () => {
    visits.add(
      '2018-03-15',
      '84101711210',
      [],
      '89.05',
      '100204',
      'JERZY',
      'S',
      'D JOLANTA',
      'świadczenie profilaktyczne'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });

  it('Should add "świadczenia diagnostyczne" without error/warning', () => {
    visits.add(
      '2018-03-16',
      '84101711211',
      [],
      '89.05',
      '100205',
      'JERZY',
      'S',
      'RAFAŁ C.',
      'świadczenie diagnostyczne'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });

  it('Should add "świadczenia pielegnacyjne" without error/warning', () => {
    visits.add(
      '2018-03-17',
      '84101711212',
      [],
      '89.05',
      '100206',
      'JERZY',
      'S',
      'BEATA N.',
      'świadczenie pielęgnacyjne'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });

  it('Should add "wizyta w gabinecie pielęgniarki poz" without error/warning', () => {
    visits.add(
      '2018-03-17',
      '84101711212',
      [],
      '89.05',
      '100203',
      'JERZY',
      'S',
      'BEATA N.',
      'wizyta w gabinecie pielęgniarki poz'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });

  it('Should add "iniekcja lub zabieg zrealizowana na podstawie zlecenia lekarza ubezpieczenia zdrowotnego" without error/warning', () => {
    visits.add(
      '2018-03-17',
      '84101711212',
      [],
      '89.05',
      '100210',
      'JERZY',
      'S',
      'BEATA N.',
      'iniekcja lub zabieg zrealizowana na podstawie zlecenia lekarza ubezpieczenia zdrowotnego'
    );

    expect(visits.getData.withErrors().length).toBe(0);
    expect(visits.getData.withWarnings().length).toBe(0);
    expect(visits.getAll().length).toBe(1);
  });
});
