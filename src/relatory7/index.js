const { busesMappedData, isSamePerson, dengueMappedData, studentsMappedData } = require('../index.js');

const peopleUsedBusesAndHadDengue = []

const necessaryColumns = {
    name: 'Nome',
    bornDate: 'Data de nascimento',
    denguesDate: 'Data da dengue',
    buses: 'Linhas de ônibus'
}

busesMappedData.forEach(busesPerson => {
    dengueMappedData.forEach(denguePerson => {
        if(isSamePerson(busesPerson, denguePerson)) {
            peopleUsedBusesAndHadDengue.push({
                name: busesPerson.name,
                fathersName: busesPerson.fathersName.length > denguePerson.fathersName.length ? busesPerson.fathersName : denguePerson.fathersName,
                mothersName: busesPerson.mothersName.length > denguePerson.mothersName.length ? busesPerson.mothersName : denguePerson.mothersName,
                bornDate: busesPerson.bornDate,
                denguesDate: denguePerson.denguesDate,
                buses: busesPerson.buses
            });
        }
    })
})

const filteredData = peopleUsedBusesAndHadDengue.filter((person) => 
        studentsMappedData.some((student) => isSamePerson(person, student))
    ).map(person => ({ 
                name: person.name,
                bornDate: person.bornDate,
                denguesDate: person.denguesDate,
                buses: person.buses 
            }));

console.log(filteredData);

module.exports = {
    relatory: {
        people: filteredData,
        peopleAmount: filteredData.length,
        samplingAmount: dengueMappedData.length,
        amountDontSatisfies: dengueMappedData.length - filteredData.length,
        necessaryColumns,
        fileName: 'Relatorio Saude, Mobilidade e Educacao'
    }
}