const { busesMappedData, isSamePerson, dengueMappedData, formatRelatory, studentsMappedData } = require('../index.js');

const peopleHadDengueAndUsedBus = []

const necessaryColumns = {
    name: 'Nome',
    bornDate: 'Data de nascimento',
    denguesDate: 'Data da dengue'
}

dengueMappedData.forEach(person => {
    busesMappedData.forEach(busesPerson => {
        if(isSamePerson(person, busesPerson)) {
            peopleHadDengueAndUsedBus.push(person);
        }
    })
})

const firstFilteredPeople = dengueMappedData.filter(person => !peopleHadDengueAndUsedBus.includes(person));

const peopleHadDengueAndDontUsedBusesAndWenToSchool = []

firstFilteredPeople.forEach(person => {
    studentsMappedData.forEach(student => {
        if(isSamePerson(person, student)) {
            peopleHadDengueAndDontUsedBusesAndWenToSchool.push(person);
        }
    })
})

const filteredPeople = firstFilteredPeople.filter(person => !peopleHadDengueAndDontUsedBusesAndWenToSchool.includes(person))

const formattedRelatory = formatRelatory(filteredPeople, necessaryColumns);


module.exports = {
    relatory: {
        people: formattedRelatory,
        peopleAmount: formattedRelatory.length,
        samplingAmount: dengueMappedData.length,
        amountDontSatisfies: dengueMappedData.length - formattedRelatory.length,
        necessaryColumns,
        fileName: 'Relatorio 10'
    }
}