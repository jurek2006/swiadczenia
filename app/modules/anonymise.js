const _ = require('lodash');
const visits = require('./visits'); 
const {anonymisePesel} = require('../config/hiddenConfig');

const anonymiseVisits = (visitsArr) => {
// anonimizuje wizyty z tablicy visitsArr tablica [obiektów instancji klasy Visits] tak żeby zachować "odwzorowanie peseli" czyli dla każdej wizyty jednego pacjenta dostaje on zawsze ten sam, zmodyfikowany pesel
    
    // sprawdzenie, czy visitsArray jest tablicą tylko instancji klasy Visits
    if(!visits.isVisitsArr(visitsArr)){
        throw new TypeError(`visitsArr is not an array or contains not only Visit\'s class instances`);
    }

    // znalezienie występujących w wizytach peseli, bez dubli
    const peselsUniq = [...new Set(visitsArr.map(currVis => currVis.pesel))];

    // dla każdego z peseli wygenerowanie nowego i podmienienie go w danych wizyt
    peselsUniq.forEach(pesel => {
        // wyfiltrowanie wizyt z visitsArr o zadanym peselu
        const visitsForPesel = _.filter(visitsArr, {pesel});

        // dla każdej z wizyt wygenerowanie nowego peselu i podmiana w wizytach
        visitsForPesel.forEach(visit => visit.pesel = anonymisePesel(visit.pesel));
    });
    
    return visitsArr;
    
};

module.exports = {anonymiseVisits};