// Zawiera konfigurację wizyt razem z funkcjami sprawdzającymi:
// - isIcd10NotRequired(icd9) - czy kod icd10 nie jest wymagany dla danego kodu icd9 wizyty
// - isPatronage(icd10arr, icd9, visitName) - czy jest to wizyta patronażowa (położnej lub pielęgniarki) lub wizyta domowa położnej

// tablica określająca kody icd9, kiedy nie jest wymagany żaden kod  icd10
const allowedIcd9whenIcd10NotReqired = ['89.05']; //89.05 to świadczenia pielęgniarki jak i patronaże położnej i pielęgniarki

// obiekt określający dane, kiedy jest to patronaż
const patronage = {
  icd9: allowedIcd9whenIcd10NotReqired, //tablica dozwolonych kodów icd9 - tutaj to po prostu tablica allowedIcd9whenIcd10NotReqired
  icd10: ['Z39', 'Z39.2', 'Z76.2'], // tablica dozwolonych kodów icd10 dla patronaży (położnej i pielęgniarek)
  visitNamesToInclude: ['wizyta patronażowa', 'wizyta domowa'], //tablica dozwolonych nazw z których przynajmniej jeden musi się zawierać w nazwie wizyty dla patronażu
};

// funkcja sprawdzająca czy dla zadanego kodu icd9 nie jest wymagany żadne rozpoznanie icd10 (gdy nie jest zwraca true)
const isIcd10NotRequired = (icd9) =>
  allowedIcd9whenIcd10NotReqired.includes(icd9);

// funkcja sprawdzająca czy jest to patronaż (położnej lub pielęgniarki)
// (wtedy icd9 jest w patronage.icd9 i przynajmniej jedno icd10 jest w patronage.icd10 i visitName zawiera tekst z możliwych dla patronaży w  patronage.visitNamesToInclude)
const isPatronage = (icd10arr, icd9, visitName) => {
  if (!icd10arr || !icd9 || !visitName) return false; //sprawdzenie czy przekazano wszystkie argumenty

  return (
    patronage.icd9.includes(icd9) &&
    icd10arr.filter((currIcd10) => patronage.icd10.includes(currIcd10)).length >
      0 &&
    patronage.visitNamesToInclude.filter((currVisitName) =>
      visitName.includes(currVisitName)
    ).length > 0
  );
};

const nfzCodesAllowed = {
  exportedToNfz: [
    '5.01.00.0000089', //wizyta patronażowa
    '5.01.00.0000104', //bilans zdrowia
    '5.01.00.0000107', //wizyta patronażowa pielęgniarki poz
    '5.01.00.0000121', //porada lekarska udzielona w miejscu udzielania świadczeń
    '5.01.00.0000122', //porada lekarska udzielona w domu pacjenta
    '5.01.00.0000152', //teleporada lekarza poz
  ],
  notExported: [
    '100203', //wizyta w gabinecie pielęgniarki poz
    '100204', //świadczenie profilaktyczne
    '100205', //świadczenie diagnostyczne
    '100206', //świadczenie pielęgnacyjne
    '100207', //świadczenie lecznicze
    '100208', //świadczenie rehabilitacyjne
    '100210', //iniekcja lub zabieg zrealizowana na podstawie zlecenia lekarza ubezpieczenia zdrowotnego
    '100302', //wizyta domowa
  ],
};

const nfzCodeIsAllowed = (nfzCode) =>
  nfzCodesAllowed.exportedToNfz
    .concat(nfzCodesAllowed.notExported)
    .includes(nfzCode); //sprawdza czy przekazany kod jest na liście dozwolonych (obojętnie czy eksportowanych, czy nie)
const nfzCodeIsExported = (nfzCode) =>
  nfzCodesAllowed.exportedToNfz.includes(nfzCode); //sprawdza czy przekazany kod jest na liście kodów (świadczeń z tym kodem) eksportowanych do NFZ

module.exports = {
  isIcd10NotRequired,
  isPatronage,
  nfzCodeIsAllowed,
  nfzCodeIsExported,
};
