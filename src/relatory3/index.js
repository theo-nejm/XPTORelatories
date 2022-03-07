const { busesMappedData, dengueMappedData, isSamePerson, formatRelatory } = require('../index');

const peopleUsedBusesAndHadDengue = []

const necessaryColumns = {
    name: 'Nome',
    bornDate: 'Data de nascimento',
    buses: 'Linhas de ônibus'
}

busesMappedData.forEach(person => {
    dengueMappedData.forEach(denguePerson => {
        if(isSamePerson(person, denguePerson)) {
            peopleUsedBusesAndHadDengue.push(person);
        }
    })
})

const filteredPeople = busesMappedData.filter(person => !peopleUsedBusesAndHadDengue.includes(person));

const formattedRelatory = formatRelatory(filteredPeople, necessaryColumns);

module.exports = {
    relatory: {
        people: formattedRelatory,
        peopleAmount: formattedRelatory.length,
        samplingAmount: busesMappedData.length,
        amountDontSatisfies: busesMappedData.length - formattedRelatory.length,
        necessaryColumns,
        fileName: 'Relatorio Mobilidade'
    }
}