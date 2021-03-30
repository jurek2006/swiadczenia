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

        it('should return undefined when given pesel is empty', () => {
            expect(birthDateFromPesel('')).toBeUndefined();
        });

        it('should return undefined when given pesel is undefined', () => {
            expect(birthDateFromPesel(undefined)).toBeUndefined();
        });

        it('should return undefined when given pesel is false', () => {
            expect(birthDateFromPesel(false)).toBeUndefined();
        });

        it('should return undefined when given pesel is null', () => {
            expect(birthDateFromPesel(null)).toBeUndefined();
        });

        it('should return undefined when given pesel shorter than 11 chars ', () => {
            expect(birthDateFromPesel('8511123321')).toBeUndefined();
        });

        it('should return undefined when given pesel cant include proper birthdate ', () => {
            expect(birthDateFromPesel('aaaaaaaaaaaaaaaaaaaaaaaaaa')).toBeFalsy();
            expect(birthDateFromPesel('84109912211')).toBeUndefined();
        });
    });

    describe('ageFullYearsInDay()', () => {

        // dane do przetestowania
        const personVisitTestData = [
            { visitDate: '2018-05-08', pesel: '16250700000', expectedAge: 2, comment: 'day after 2nd birthday' },
            { visitDate: '2018-05-08', pesel: '16250800000', expectedAge: 2, comment: 'exactly 2nd birthday' },
            { visitDate: '2018-05-08', pesel: '16250900000', expectedAge: 1, comment: 'day before 2nd birthday' },

            { visitDate: '2018-01-02', pesel: '16210100000', expectedAge: 2, comment: 'day after 2nd birthday' },
            { visitDate: '2018-01-01', pesel: '16210100000', expectedAge: 2, comment: 'exactly 2nd birthday' },
            { visitDate: '2017-12-31', pesel: '16210100000', expectedAge: 1, comment: 'day before 2nd birthday' },

            { visitDate: '2018-01-01', pesel: '15323100000', expectedAge: 2, comment: 'day after 2nd birthday' },
            { visitDate: '2017-12-31', pesel: '15323100000', expectedAge: 2, comment: 'exactly 2nd birthday' },
            { visitDate: '2017-12-30', pesel: '15323100000', expectedAge: 1, comment: 'day before 2nd birthday' },

            { visitDate: '2018-02-28', pesel: '16222900000', expectedAge: 2, comment: 'leap year - day before exactly 2nd birthday' },
            { visitDate: '2018-03-01', pesel: '16222900000', expectedAge: 2, comment: 'leap year - day after exactly 2nd birthday' },

            { visitDate: '2020-02-29', pesel: '16222900000', expectedAge: 4, comment: 'leap year - exactly 4th birthday' },
            { visitDate: '2020-02-28', pesel: '16222900000', expectedAge: 3, comment: 'leap year - day before exactly 4th birthday' },
            { visitDate: '2020-03-01', pesel: '16222900000', expectedAge: 4, comment: 'leap year - day after exactly 4th birthday' },
        ];

        // TEST Z POWYŻSZYCH DANYCH
        personVisitTestData.forEach(test => {
            const birthdate = birthDateFromPesel(test.pesel); //wyliczenie daty urodzenia na potrzeby wyświetlenia

            it(`should return age ${test.expectedAge} for visit date ${test.visitDate} born ${birthdate.getFullYear()}-${birthdate.getMonth()+1}-${birthdate.getDate()} and pesel ${test.pesel} (${test.comment})`, () => {
            
                expect(ageFullYearsInDay(test.visitDate, test.pesel)).toBe(test.expectedAge); //osoba urodzona 7 maja 2017 ukończyła 2 lata 1 dzień wcześniej
                
            });
        });

    });
});