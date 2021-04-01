const _ = require('lodash');
const { covidConfig } = require('../config/visitsConfig');

// TEMP utils for report
// converts array of visits to object grouped by pesel (and inside by date)
// itemDataChanger is function applyied to every item (if present and is a function)
const groupVisitArrayByPeselAndDate = ({visitArray, itemDataChanger = null}) => {
    if(!Array.isArray(visitArray) || visitArray.length === 0){
        return []
    }

    return foundPesels = visitArray.reduce((acc, item) => {
            
            !acc[item.pesel] && (acc[item.pesel] = {patient: `${item.patientLastName}. ${item.patientFirstName}`})
            !acc[item.pesel][item.date] && (acc[item.pesel][item.date] = [])

            acc[item.pesel][item.date] = [...acc[item.pesel][item.date], itemDataChanger && _.isFunction(itemDataChanger) ? itemDataChanger(item) : item]
            return acc
        }, 
        {});
}

const prettyStringForVisitObj = ({staff, icd10, icd9, visitName, nfzCode} = {}) => `${staff} | ${Array.isArray(icd10) ? icd10.toString() : 'undefined'} | ${icd9} | ${visitName} | ${nfzCode}`

// TEMP utils functions to move somewhere else
// returns common elements of two arrays
const getArrIntersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x));
const isAnyCommonElement = (arr1, arr2) => {
    return getArrIntersection(arr1,arr2).length > 0;
}
// returns true if object can be found in arr (compares properties, not comparing objects as JS do) otherwise false
const includesObject = ({arrHay, objectNeedle}) => typeof _.find(arrHay, objectNeedle) !== "undefined"

// returns true if visit with passed data should be treated as covid visit (at least one of icd10, nfzCode or visitName is for covid)
const shouldBeCovidVisit = ({icd10, nfzCode, visitName}) => isAnyCommonElement(icd10, covidConfig.icd10) || includesObject({objectNeedle: {nfzCode}, arrHay: covidConfig.nfzCodeAndVisitName}) || includesObject({objectNeedle: {visitName}, arrHay: covidConfig.nfzCodeAndVisitName});

// validates if given data is for proper covid visit (checking icd10, nfzCode and visitName) - true/false
const isValidCovidVisit = ({icd10, nfzCode, visitName}) => {
    // verify it there's proper icd10 for covid
    if(!isAnyCommonElement(icd10, covidConfig.icd10)){
        return false
    }
    // verifies if nfzCode and visitName exist in allowed for teleporada (true/false)
    return includesObject({objectNeedle: {nfzCode, visitName}, arrHay: covidConfig.nfzCodeAndVisitName})
}

// returns true when visit is not covid (has no covid icd-10 nor nfzCode nor visitName for covid) or is covid but valid (icd10 and nfzCode and visitName)
const isCovidVerified = ({icd10, nfzCode, visitName}) => !shouldBeCovidVisit({icd10, nfzCode, visitName}) || isValidCovidVisit({icd10, nfzCode, visitName})

module.exports = {shouldBeCovidVisit, isValidCovidVisit, isCovidVerified, getArrIntersection, isAnyCommonElement, includesObject, groupVisitArrayByPeselAndDate, prettyStringForVisitObj}