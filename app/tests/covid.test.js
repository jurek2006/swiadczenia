const expect = require('expect');
const {covidConfig} = require('../config/visitsConfig');

const {shouldBeCovidVisit, isValidCovidVisit, isCovidVerified, getArrIntersection, isAnyCommonElement, includesObject} = require('../modules/covid');

describe('covid functions', () => {

    describe('shouldBeCovidVisit()', () => {
        it('Should return true as covid visit when U07.1 in icd-10 and no nfzCode for covid', () => {
            const result = shouldBeCovidVisit({
                icd10: ['U07.1'], 
                nfzCode: 'x', 
                visitName: 'y'
            })
            expect(result).toBe(true);
        })
        it('Should return true as covid visit when U07.1 among many in icd-10 and no nfzCode for covid', () => {
            const result = shouldBeCovidVisit({
                icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                nfzCode: 'x', 
                visitName: 'y'
            })
            expect(result).toBe(true);
        })
        it('Should return true as nfzCode for covid regardless if icd10 does not contain code for covid', () => {
            const result = shouldBeCovidVisit({
                icd10: ['Z10', 'Z01', 'U09', 'N40'], 
                nfzCode: '5.62.01.0000011', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            })
            expect(result).toBe(true);
        })
        it('Should return false as covid visit as U07.1 is NOT among many in icd-10  and no nfzCode for covid', () => {
            const result = shouldBeCovidVisit({
                icd10: ['Z10', 'Z01', 'U09', 'N40'], 
                nfzCode: 'x', 
                visitName: 'y'
            })
            expect(result).toBe(false);
        })
        it('Should return true as nfzCode is for covid regardless if icd10 does not contain code for covid', () => {
            const result = shouldBeCovidVisit({
                icd10: ['Z10', 'Z01', 'U09', 'N40'], 
                nfzCode: '5.62.01.0000011', 
                visitName: 'xxx'
            })
            expect(result).toBe(true);
        })
        it('Should return true as visitName is for covid regardless if icd10 does not contain code for covid', () => {
            const result = shouldBeCovidVisit({
                icd10: ['Z10', 'Z01', 'U09', 'N40'], 
                nfzCode: 'xxx', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            })
            expect(result).toBe(true);
        })
    })

    describe('isValidCovidVisit()', () => {
        describe('covid validation for teleporada', () => {
            it('Should validate "teleporada covid" with U07.1 as proper covid visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['U07.1'], 
                    nfzCode: '5.62.01.0000011', 
                    visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(true)
            });

            it('Should validate "teleporada covid" with U07.1 among many icd-10 for visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: '5.62.01.0000011', 
                    visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(true)
            });

            it('Should NOT validate "teleporada covid" WITHOUT U07.1 as proper covid visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: [], 
                    nfzCode: '5.62.01.0000011', 
                    visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });

            it('Should NOT validate "teleporada covid" with U07.1 without proper nfzCode', () => {
                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: 'blablabla', 
                    visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });

            it('Should NOT validate "teleporada covid" with U07.1 when nfzCode does not match visitName', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: '5.62.01.0000012', 
                    visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });
        });

        describe('covid validation for porada', () => {
            it('Should validate "porada covid" with U07.1 as proper covid visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['U07.1'], 
                    nfzCode: '5.62.01.0000012', 
                    visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(true)
            });

            it('Should validate "porada covid" with U07.1 among many icd-10 for visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: '5.62.01.0000012', 
                    visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(true)
            });

            it('Should NOT validate "porada covid" WITHOUT U07.1 as proper covid visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: [], 
                    nfzCode: '5.62.01.0000012', 
                    visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });

            it('Should NOT validate "porada covid" with U07.1 without proper nfzCode', () => {
                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: 'blablabla', 
                    visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });

            it('Should NOT validate "porada covid" with U07.1 when nfzCode does not match visitName', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: '5.62.01.0000011', // code for teleporada 
                    visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });
        });

        describe('covid validation for porada', () => {
            it('Should validate "wizyta domowa covid" with U07.1 as proper covid visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['U07.1'], 
                    nfzCode: '5.62.01.0000013', 
                    visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(true)
            });

            it('Should validate "wizyta domowa covid" with U07.1 among many icd-10 for visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: '5.62.01.0000013', 
                    visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(true)
            });

            it('Should NOT validate "wizyta domowa covid" WITHOUT U07.1 as proper covid visit', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: [], 
                    nfzCode: '5.62.01.0000013', 
                    visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });

            it('Should NOT validate "wizyta domowa covid" with U07.1 without proper nfzCode', () => {
                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: 'blablabla', 
                    visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });

            it('Should NOT validate "wizyta domowa covid" with U07.1 when nfzCode does not match visitName', () => {

                const visitCovidStatus = isValidCovidVisit({
                    icd10: ['Z10', 'Z01', 'U07.1', 'N40'], 
                    nfzCode: '5.62.01.0000012', //code for "porada lekarska"
                    visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'
                })
                expect(visitCovidStatus).toBe(false)
            });
        });
    })

    describe('isCovidVerified()', () => {
        it('Should return true as covid has U07.1 and proper data for covid teleporada', () => {
            const visitData = {
                icd10: ['U07.1'], 
                nfzCode: '5.62.01.0000011', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            }
            expect(isCovidVerified(visitData)).toBe(true);
            
        })
        it('Should return true as covid has U07.1 among many icd10 and proper data for covid teleporada', () => {
            const visitData = {
                icd10: ['Z10', 'Z01', 'U07.1', 'N40'],
                nfzCode: '5.62.01.0000011', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            }

            expect(isCovidVerified(visitData)).toBe(true);
        })
        it('Should return false as covid has U07.1 among many icd10 and but not valid nfzCode for covid teleporada', () => {
            const visitData = {
                icd10: ['Z10', 'Z01', 'U07.1', 'N40'],
                nfzCode: 'not covid', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            }

            expect(isCovidVerified(visitData)).toBe(false);
        })
        it('Should return true when there is no U07.1 in icd10 and not valid nfzCode for covid (not covid at all)', () => {
            const visitData = {
                icd10: ['Z10', 'Z01', 'U08', 'N40'],
                nfzCode: 'not covid', 
                visitName: 'not covid'
            }

            expect(isCovidVerified(visitData)).toBe(true);
        })
        it('Should return false as theres is not covid U07.1 among icd10 but nfzCode and visitName are for covid', () => {
            const visitData = {
                icd10: ['Z10', 'Z01', 'U08', 'N40'],
                nfzCode: '5.62.01.0000011', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            }

            expect(isCovidVerified(visitData)).toBe(false);
        })
        it('Should return false as theres is not covid U07.1 among icd10 but nfzCode is for covid', () => {
            const visitData = {
                icd10: ['Z10', 'Z01', 'U08', 'N40'],
                nfzCode: '5.62.01.0000011', 
                visitName: 'different'
            }

            expect(isCovidVerified(visitData)).toBe(false);
        })
        it('Should return false as theres is not covid U07.1 among icd10 but visitName is for covid', () => {
            const visitData = {
                icd10: ['Z10', 'Z01', 'U08', 'N40'],
                nfzCode: 'different', 
                visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'
            }

            expect(isCovidVerified(visitData)).toBe(false);
        })
    })
})

// TEMP - should be moved to utils test
describe('new utils', () => {
    describe('getIntersection()', () => {
        it('Should return one-element intersection of arrays', () => {
            const arr1 = ['A01', 'B02', 'U07.1', 'Z10'];
            const arr2 = ['X99', 'Y02', 'U07.1', 'Z99'];
            expect(getArrIntersection(arr1, arr2)).toHaveLength(1);
            expect(getArrIntersection(arr1, arr2)).toContain('U07.1');
        })
        it('Should return multi-element intersection of arrays', () => {
            const arr1 = ['A01', 'B02', 'U07.1', 'Z10'];
            const arr2 = ['Z10', 'Y02', 'U07.1', 'Z99', 'B02'];
            expect(getArrIntersection(arr1, arr2)).toHaveLength(3);
            expect(getArrIntersection(arr1, arr2)).toContain('U07.1');
            expect(getArrIntersection(arr1, arr2)).toContain('Z10');
            expect(getArrIntersection(arr1, arr2)).toContain('B02');
        })
        it('Should return empty intersection of arrays', () => {
            const arr1 = ['A01', 'B02', 'U08.1', 'Z10'];
            const arr2 = ['X99', 'Y02', 'U07.1', 'Z99'];
            expect(getArrIntersection(arr1, arr2)).toHaveLength(0);
            expect(getArrIntersection(arr1, arr2)).not.toContain('U07.1');
        })
        it('Should return empty intersection when first array empty', () => {
            const arr1 = [];
            const arr2 = ['A01', 'B02', 'U08.1', 'Z10'];
            expect(getArrIntersection(arr1, arr2)).toHaveLength(0);
        })
        it('Should return empty intersection when second array empty', () => {
            const arr1 = ['A01', 'B02', 'U08.1', 'Z10'];
            const arr2 = [];
            expect(getArrIntersection(arr1, arr2)).toHaveLength(0);
        })
        it('Should return empty intersection when both arrays empty', () => {
            const arr1 = [];
            const arr2 = [];
            expect(getArrIntersection(arr1, arr2)).toHaveLength(0);
        })
    })
    describe('isAnyCommonElement()', () => {
        it('Should return true for one common element', () => {
            const arr1 = ['A01', 'B02', 'U07.1', 'Z10'];
            const arr2 = ['X99', 'Y02', 'U07.1', 'Z99'];
            expect(isAnyCommonElement(arr1, arr2)).toBe(true);
        })
        it('Should return true for many common element', () => {
            const arr1 = ['A01', 'B02', 'U07.1', 'Z10'];
            const arr2 = ['Z10', 'Y02', 'U07.1', 'Z99', 'B02'];
            expect(isAnyCommonElement(arr1, arr2)).toBe(true);
        })
        it('Should return false for no common elements', () => {
            const arr1 = ['A01', 'B02', 'U08.1', 'Z10'];
            const arr2 = ['X99', 'Y02', 'U07.1', 'Z99'];
            expect(isAnyCommonElement(arr1, arr2)).toBe(false);
        })
    })
    describe('includesObject()', () => {
        it('Should return true if object found in array of objects', () => {
            const objectNeedle = {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'};
            const arrHay = [
                // list of allowed nfzCodes and corresponding visit names
                {nfzCode: '5.62.01.0000011', visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'},
                {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'},
                {nfzCode: '5.62.01.0000013', visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}
              ]

            expect(includesObject({arrHay, objectNeedle})).toBe(true);
        })
        it('Should return true if object found in array of objects (and objects properties are in different order', () => {
            const objectNeedle = { visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2', nfzCode: '5.62.01.0000012'};
            const arrHay = [
                // list of allowed nfzCodes and corresponding visit names
                {nfzCode: '5.62.01.0000011', visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'},
                {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'},
                {nfzCode: '5.62.01.0000013', visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}
              ]

            expect(includesObject({arrHay, objectNeedle})).toBe(true);
        })
        it('Should return true if object found in array of more complex objects', () => {
            const objectNeedle = {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'};
            const arrHay = [
                // list of allowed nfzCodes and corresponding visit names
                {sthElse: 'notImportant', nfzCode: '5.62.01.0000011', visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'},
                {sthElse: 'notImportant', nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'},
                {sthElse: 'notImportant', nfzCode: '5.62.01.0000013', visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}
              ]

            expect(includesObject({arrHay, objectNeedle})).toBe(true);
        })
        it('Should return false if object not found in array of objects (all properties are different)', () => {
            const objectNeedle = {nfzCode: 'a', visitName: 'b'};
            const arrHay = [
                // list of allowed nfzCodes and corresponding visit names
                {nfzCode: '5.62.01.0000011', visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'},
                {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'},
                {nfzCode: '5.62.01.0000013', visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}
              ]

            expect(includesObject({arrHay, objectNeedle})).toBe(false);
        })
        it('Should return false if object not found in array of objects (one of properties is different)', () => {
            const objectNeedle = {nfzCode: 'notMatching', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'};
            const arrHay = [
                // list of allowed nfzCodes and corresponding visit names
                {nfzCode: '5.62.01.0000011', visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'},
                {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'},
                {nfzCode: '5.62.01.0000013', visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}
              ]

            expect(includesObject({arrHay, objectNeedle})).toBe(false);
        })
        it('Should return false if object not found in array of objects (needle has more properties then object in hay)', () => {
            const objectNeedle = {sthElse: 'nothing', nfzCode: 'notMatching', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'};
            const arrHay = [
                // list of allowed nfzCodes and corresponding visit names
                {nfzCode: '5.62.01.0000011', visitName: 'teleporada lekarska na rzecz pacjenta z dodatnim wynikiem testu SARS-CoV-2'},
                {nfzCode: '5.62.01.0000012', visitName: 'porada lekarska na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'},
                {nfzCode: '5.62.01.0000013', visitName: 'lekarska wizyta domowa na rzecz pacjenta z dodatnim wynikiem testu diagnostycznego w kierunku SARS-CoV-2'}
              ]

            expect(includesObject({arrHay, objectNeedle})).toBe(false);
        })
    })
})