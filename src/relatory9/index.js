const { studentsMappedData, isSamePerson, dengueMappedData, formatRelatory } = require('../index.js');

const peopleHadDengueAndWentToSchool = []

const necessaryColumns = {
    name: 'Nome',
    bornDate: 'Data de nascimento',
    denguesDate: 'Data da dengue'
}

dengueMappedData.forEach(person => {
    studentsMappedData.forEach(student => {
        if(isSamePerson(person, student)) {
            peopleHadDengueAndWentToSchool.push(person);
        }
    })
})

const filteredPeople = dengueMappedData.filter(person => !peopleHadDengueAndWentToSchool.includes(person));

const formattedRelatory = formatRelatory(filteredPeople, necessaryColumns);

module.exports = {
    relatory: {
        people: formattedRelatory,
        peopleAmount: formattedRelatory.length,
        samplingAmount: dengueMappedData.length,
        amountDontSatisfies: dengueMappedData.length - formattedRelatory.length,
        necessaryColumns,
        fileName: 'Relatorio 9'
    }
}