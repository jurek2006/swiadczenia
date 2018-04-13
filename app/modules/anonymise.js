const _ = require('lodash');
const visits = require('./visits'); 
const {anonymisePesel} = require('../config/hiddenConfig');

const anonymiseVisits = (visitsArr) => {
// anonimizuje wizyty z tablicy visitsArr tablica [obiektów instancji klasy Visits] tak żeby zachować "odwzorowanie peseli" czyli dla każdej wizyty jednego pacjenta dostaje on zawsze ten sam, zmodyfikowany pesel

    // sprawdzenie, czy visitsArray jest tablicą
    if(!Array.isArray(visitsArr)){
        throw new TypeError('visitsArr is not an array');
    }

    // sprawdzenie, czy każdy element tablicy jest instancją klasy Visits
    visitsArr.forEach(vis => { 
        if (!(vis instanceof visits.Visit)){
            throw new TypeError(`One or more items in visitsArr is not an Visit class instance`);
        }
    });

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