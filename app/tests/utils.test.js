const expect = require('expect');

const {birthDateFromPesel, ageFullYearsInDay} = require('../modules/utils');

describe('Module utils', () => {

    describe('birthDateFromPesel()', () => {

        it('should return proper birth dates from pesel (between 1900 - 1999)', () => {
            
            expect(birthDateFromPesel('84101711210').getFullYear()).toBe(1984);
            expect(birthDateFromPesel('84101711210').getMonth()).toBe(9); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('84101711210').getDate()).toBe(17); //dzień miesiąca
            
            expect(birthDateFromPesel('80041100000').getFullYear()).toBe(1980);
            expect(birthDateFromPesel('80041100000').getMonth()).toBe(3); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('80041100000').getDate()).toBe(11); //dzień miesiąca
            
            expect(birthDateFromPesel('00010100000').getFullYear()).toBe(1900);
            expect(birthDateFromPesel('00010100000').getMonth()).toBe(0); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('00010100000').getDate()).toBe(1); //dzień miesiąca
            
            expect(birthDateFromPesel('99123100000').getFullYear()).toBe(1999);
            expect(birthDateFromPesel('99123100000').getMonth()).toBe(11); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('99123100000').getDate()).toBe(31); //dzień miesiąca
            
        });
        
        it('should return proper birth dates from pesel (between 1800 - 1899)', () => {
            
            expect(birthDateFromPesel('84901711210').getFullYear()).toBe(1884);
            expect(birthDateFromPesel('84901711210').getMonth()).toBe(9); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('84901711210').getDate()).toBe(17); //dzień miesiąca
            
            expect(birthDateFromPesel('80841100000').getFullYear()).toBe(1880);
            expect(birthDateFromPesel('80841100000').getMonth()).toBe(3); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('80841100000').getDate()).toBe(11); //dzień miesiąca
            
            expect(birthDateFromPesel('00810100000').getFullYear()).toBe(1800);
            expect(birthDateFromPesel('00810100000').getMonth()).toBe(0); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('00810100000').getDate()).toBe(1); //dzień miesiąca
            
            expect(birthDateFromPesel('99923100000').getFullYear()).toBe(1899);
            expect(birthDateFromPesel('99923100000').getMonth()).toBe(11); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('99923100000').getDate()).toBe(31); //dzień miesiąca
            
        });
        
        it('should return proper birth dates from pesel (between 2200 - 2299)', () => {
            
            expect(birthDateFromPesel('84701711210').getFullYear()).toBe(2284);
            expect(birthDateFromPesel('84701711210').getMonth()).toBe(9); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('84701711210').getDate()).toBe(17); //dzień miesiąca
            
            expect(birthDateFromPesel('80641100000').getFullYear()).toBe(2280);
            expect(birthDateFromPesel('80641100000').getMonth()).toBe(3); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('80641100000').getDate()).toBe(11); //dzień miesiąca
            
            expect(birthDateFromPesel('00610100000').getFullYear()).toBe(2200);
            expect(birthDateFromPesel('00610100000').getMonth()).toBe(0); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('00610100000').getDate()).toBe(1); //dzień miesiąca
            
            expect(birthDateFromPesel('99723100000').getFullYear()).toBe(2299);
            expect(birthDateFromPesel('99723100000').getMonth()).toBe(11); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('99723100000').getDate()).toBe(31); //dzień miesiąca
            
        });
        
        it('should return proper birth dates from pesel (between 2100 - 2199)', () => {
            
            expect(birthDateFromPesel('84501711210').getFullYear()).toBe(2184);
            expect(birthDateFromPesel('84501711210').getMonth()).toBe(9); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('84501711210').getDate()).toBe(17); //dzień miesiąca
            
            expect(birthDateFromPesel('80441100000').getFullYear()).toBe(2180);
            expect(birthDateFromPesel('80441100000').getMonth()).toBe(3); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('80441100000').getDate()).toBe(11); //dzień miesiąca
            
            expect(birthDateFromPesel('00410100000').getFullYear()).toBe(2100);
            expect(birthDateFromPesel('00410100000').getMonth()).toBe(0); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('00410100000').getDate()).toBe(1); //dzień miesiąca
            
            expect(birthDateFromPesel('99523100000').getFullYear()).toBe(2199);
            expect(birthDateFromPesel('99523100000').getMonth()).toBe(11); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('99523100000').getDate()).toBe(31); //dzień miesiąca
            
        });
        
        it('should return proper birth dates from pesel (between 2000 - 2099)', () => {
            
            expect(birthDateFromPesel('84301711210').getFullYear()).toBe(2084);
            expect(birthDateFromPesel('84301711210').getMonth()).toBe(9); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('84301711210').getDate()).toBe(17); //dzień miesiąca
            
            expect(birthDateFromPesel('80241100000').getFullYear()).toBe(2080);
            expect(birthDateFromPesel('80241100000').getMonth()).toBe(3); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('80241100000').getDate()).toBe(11); //dzień miesiąca
            
            expect(birthDateFromPesel('00210100000').getFullYear()).toBe(2000);
            expect(birthDateFromPesel('00210100000').getMonth()).toBe(0); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('00210100000').getDate()).toBe(1); //dzień miesiąca
            
            expect(birthDateFromPesel('99323100000').getFullYear()).toBe(2099);
            expect(birthDateFromPesel('99323100000').getMonth()).toBe(11); //0 to styczeń, 11 to grudzień
            expect(birthDateFromPesel('99323100000').getDate()).toBe(31); //dzień miesiąca
            
        });

        it('should return false when given pesel empty, undefined, false or null', () => {
            expect(birthDateFromPesel('').getFullYear()).toBeFalsy()
            expect(birthDateFromPesel(undefined).getFullYear()).toBeFalsy()
            expect(birthDateFromPesel(false).getFullYear()).toBeFalsy()
            expect(birthDateFromPesel(null).getFullYear()).toBeFalsy()
        });
    });

    describe('ageFullYearsInDay()', () => {

        it('should return proper age (in given day) in full years for pesel', () => {
            
            expect(ageFullYearsInDay('2018-05-08', '16250700000')).toBe(2); //osoba urodzona 7 maja 2017 ukończyła 2 lata 1 dzień wcześniej
            expect(ageFullYearsInDay('2018-05-08', '16250800000')).toBe(2); //osoba urodzona 8 maja 2017 ukończyła 2 lata w danym dniu
            expect(ageFullYearsInDay('2018-05-08', '16250900000')).toBe(1); //osoba urodzona 9 maja 2017 ukończy 2 lata za 1 dzień

            expect(ageFullYearsInDay('2018-01-02', '16210100000')).toBe(2); //osoba urodzona 1 stycznia 2016 ukończyła 2 lata 1 dzień wcześniej
            expect(ageFullYearsInDay('2018-01-01', '16210100000')).toBe(2); //osoba urodzona 1 stycznia 2016 ukończyła 2 lata w danym dniu
            expect(ageFullYearsInDay('2017-12-31', '16210100000')).toBe(1); //osoba urodzona 1 stycznia 2016 ukończy 2 lata za 1 dzień

            expect(ageFullYearsInDay('2018-01-01', '15323100000')).toBe(2); //osoba urodzona 31 grudnia 2015 ukończyła 2 lata 1 dzień wcześniej
            expect(ageFullYearsInDay('2017-12-31', '15323100000')).toBe(2); //osoba urodzona 31 grudnia 2015 ukończyła 2 lata w danym dniu
            expect(ageFullYearsInDay('2017-12-30', '15323100000')).toBe(1); //osoba urodzona 31 grudnia 2015 ukończy 2 lata za 1 dzień
            
        });


    });
});