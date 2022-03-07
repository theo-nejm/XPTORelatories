const { busesMappedData, dengueMappedData, isSamePerson, formatRelatory } = require('../index');

const peopleDontUseBuses = []

const necessaryColumns = {
    name: 'Nome',
    bornDate: 'Data de nascimento',
    denguesDate: 'Data da dengue'
}

dengueMappedData.forEach(person => {
    busesMappedData.forEach(busesPerson => {
        if(isSamePerson(person, busesPerson)) {
            peopleDontUseBuses.push(person);
        }
    })
})

const filteredPeople = dengueMappedData.filter(person => !peopleDontUseBuses.includes(person));

const formattedRelatory = formatRelatory(filteredPeople, necessaryColumns);

module.exports = {
    relatory: {
        people: formattedRelatory,
        peopleAmount: formattedRelatory.length,
        samplingAmount: dengueMappedData.length,
        amountDontSatisfies: dengueMappedData.length - formattedRelatory.length,
        necessaryColumns,
        fileName: 'Relatorio Saude'
    }
}