const { studentsMappedData, busesMappedData, isSamePerson } = require('../index.js');

const peopleUsedBuses = []

const necessaryColumns = {
    id: 'ID',
    name: 'Nome',
    bornDate: 'Data de nascimento',
    buses: 'Linhas de ônibus'
}

studentsMappedData.forEach(student => {
    busesMappedData.forEach(busesPerson => {
        if(isSamePerson(student, busesPerson)) {
            peopleUsedBuses.push({
                id: student.id,
                name: student.name,
                bornDate: student.bornDate,
                buses: busesPerson.buses
            })
        }
    })
})

module.exports = {
    relatory: {
        people: peopleUsedBuses,
        peopleAmount: peopleUsedBuses.length,
        samplingAmount: studentsMappedData.length,
        amountDontSatisfies: studentsMappedData.length - peopleUsedBuses.length,
        necessaryColumns,
        fileName: 'Relatorio Educacao e Mobilidade'
    }
}