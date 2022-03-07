const { busesMappedData, isSamePerson, dengueMappedData } = require('../index.js');

const peopleUsedBusesAndHadDengue = []

const necessaryColumns = {
    name: 'Nome',
    bornDate: 'Data de nascimento',
    denguesDate: 'Data da dengue',
    buses: 'Linhas de ônibus'
}

dengueMappedData.forEach(person => {
    busesMappedData.forEach(busesPerson => {
        if(isSamePerson(person, busesPerson)) {
            peopleUsedBusesAndHadDengue.push({
                name: person.name,
                bornDate: person.bornDate,
                denguesDate: person.denguesDate,
                buses: busesPerson.buses
            });
        }
    })
})

module.exports = {
    relatory: {
        people: peopleUsedBusesAndHadDengue,
        peopleAmount: peopleUsedBusesAndHadDengue.length,
        samplingAmount: dengueMappedData.length,
        amountDontSatisfies: dengueMappedData.length - peopleUsedBusesAndHadDengue.length,
        necessaryColumns,
        fileName: 'Relatorio Saude e Mobilidade'
    }
}