const expect = require('expect');

const {isIcd10NotRequired, isPatronage, nfzCodeIsAllowed} = require('../config/visitsConfig');

describe('config.js', () => {
    
    describe('isIcd10NotRequired()', () => {

        it('should return true as given icd9 in array of allowed to not have icd10', () => {
            expect(isIcd10NotRequired('89.05')).toBeTruthy();
        });

        it('should return false as given icd9 is not in array of allowed to not have icd10', () => {
            expect(isIcd10NotRequired('89.00')).toBeFalsy();
        });

        it('should return false as given icd9 is not string', () => {
            expect(isIcd10NotRequired(true)).toBeFalsy();
        });

        it('should return false as given icd9 is empty', () => {
            expect(isIcd10NotRequired('')).toBeFalsy();
        });

        it('should return false as given icd9 is undefined', () => {
            expect(isIcd10NotRequired()).toBeFalsy();
        });

    });

    describe('isPatronage()', () => {

        it('should return true for valid midwifes\'s patronages', () => {
            // prawidłowe patronaże położnej:
            // - przynajmniej jedno icd10 należy do patronage.icd10 (tutaj Z39 lub Z39.2 - patronaże położnej)
            // - icd9 z patronage.icd9
            // - visitName zawiera odpowiednią nazwę z patronage.visitNamesToInclude
            expect(isPatronage(['Z39'], '89.05', 'wizyta patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z39', 'K11'], '89.05', 'wizyta patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z39'], '89.05', 'wizyta patronażowa')).toBeTruthy();
            expect(isPatronage(['Z39.2'], '89.05', 'wizyta patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z39.2', 'K11'], '89.05', 'wizyta patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z19', 'Z39.2', 'Z39'], '89.05', 'wizyta patronażowa')).toBeTruthy();
        });

        it('should return true for valid nurses\'s patronages', () => {
            // prawidłowe patronaże pielęgniarki:
            // - przynajmniej jedno icd10 należy do patronage.icd10 (tutaj Z76.2 - patronaże położnej)
            // - icd9 z patronage.icd9
            // - visitName zawiera odpowiednią nazwę z patronage.visitNamesToInclude
            expect(isPatronage(['Z76.2'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z76.2', 'K11'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z76.2'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeTruthy();
            expect(isPatronage(['Z76.2'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z76.2', 'K11'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeTruthy();
            expect(isPatronage(['Z01', 'Z19', 'Z76.2', 'Z39'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeTruthy();
        });

        it('should return false when it is not patronage (icd10 not for patronages)', () => {
            // nieprawidłowe patronaże położnej i pielęgniarki:
            // - ŻADNE z icd10 nie należy do patronage.icd10
            // - POPRAWNE:
                // - icd9 z patronage.icd9
                // - visitName zawiera odpowiednią nazwę z patronage.visitNamesToInclude
            expect(isPatronage([], '89.05', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'K11'], '89.05', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11'], '89.05', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z39.4'], '89.05', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19.2', 'K11'], '89.05', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19'], '89.05', 'wizyta patronażowa')).toBeFalsy();

            expect(isPatronage(['Z09'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z29'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z39.9'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z39.7', 'K11'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'Z39.5', 'Z49'], '89.05', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
        });

        it('should return false when it is not patronage (icd9 not for patronages)', () => {
            
            // nieprawidłowe patronaże położnej i pielęgniarki:
            // - icd9 NIE NALEŻDY DO allowedIcd9whenIcd10NotReqired
            // - POPRAWNE:
                // - przynajmniej jedno icd10 należy do patronage.icd10
                // - visitName zawiera odpowiednią nazwę z patronage.visitNamesToInclude

            expect(isPatronage(['Z39'], '89.00', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z39', 'K11'], '89.00', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z39'], '89.00', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z39.2'], '89.00', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z39.2', 'K11'], '89.00', 'wizyta patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'Z39.2', 'Z39'], '89.00', 'wizyta patronażowa')).toBeFalsy();

            expect(isPatronage(['Z76.2'], '89.00', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z76.2', 'K11'], '89.00', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z76.2'], '89.00', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z76.2'], '89.00', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z76.2', 'K11'], '89.00', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'Z76.2', 'Z39'], '89.00', 'wizyta patronażowa pielęgniarki poz patronażowa')).toBeFalsy();
        });

        it('should return false when it is not patronage (visitName not for patronage)', () => {
            // nieprawidłowe patronaże położnej i pielęgniarki:
            // - visitName NIE ZAWIERA odpowiedniej nazwy z patronage.visitNamesToInclude
            // - POPRAWNE:
                // - przynajmniej jedno icd10 należy do patronage.icd10 (tutaj Z39 lub Z39.2 - patronaże położnej)
                // - icd9 z patronage.icd9
            expect(isPatronage(['Z39'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z39', 'K11'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z39'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z39.2'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z39.2', 'K11'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'Z39.2', 'Z39'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();

            expect(isPatronage(['Z76.2'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z76.2', 'K11'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'K11', 'Z76.2'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z76.2'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z76.2', 'K11'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
            expect(isPatronage(['Z01', 'Z19', 'Z76.2', 'Z39'], '89.05', 'porada lekarska udzielona w miejscu udzielania świadczeń')).toBeFalsy();
        });

        it('should return false for "świadczenia świadczenie profilaktyczne", "świadczenie diagnostyczne" and "świadczenie pielęgnacyjne" which are not patronages', () => {
            expect(isPatronage([], '89.05', 'świadczenie profilaktyczne')).toBeFalsy();
            expect(isPatronage([], '89.05', 'świadczenie diagnostyczne')).toBeFalsy();
            expect(isPatronage([], '89.05', 'świadczenie lecznicze')).toBeFalsy();
            
        });
    });

    describe('nfzCodeIsAllowed()', () => {
        it('should return true when allowed nfzCode given', () => {
            expect(nfzCodeIsAllowed('5.01.00.0000089')).toBeTruthy();
        });

        it('should return false when not allowed nfzCode given', () => {
            expect(nfzCodeIsAllowed('5.01.00.1000089')).toBeFalsy();
        });
    });
}); 