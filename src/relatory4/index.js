const { studentsMappedData, dengueMappedData, isSamePerson } = require('../index.js');

const denguePeople = []

const necessaryColumns = {
    id: 'ID',
    name: 'Nome',
    bornDate: 'Data de nascimento',
    denguesDate: 'Data da dengue'
}

const initialStudentsLength = studentsMappedData.length;

studentsMappedData.forEach(student => {
    dengueMappedData.forEach(denguePerson => {
        if(isSamePerson(student, denguePerson)) {
            denguePeople.push({ id: student.id, name: student.name, bornDate: student.bornDate, denguesDate: denguePerson.denguesDate });
        }
    })
})

module.exports = {
    relatory: {
        people: denguePeople,
        peopleAmount: denguePeople.length,
        samplingAmount: studentsMappedData.length,
        amountDontSatisfies: initialStudentsLength - denguePeople.length,
        necessaryColumns,
        fileName: 'Relatorio Educacao e Saude'
    }
}