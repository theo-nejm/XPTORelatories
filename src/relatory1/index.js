const { studentsMappedData, dengueMappedData, isSamePerson, formatRelatory } = require('../index.js');

const studentsGotDengue = []

const necessaryColumns = {
    id: 'ID',
    name: 'Nome',
    bornDate: 'Data de nascimento'
}

studentsMappedData.forEach(student => {
    dengueMappedData.forEach(denguePerson => {
        if(isSamePerson(student, denguePerson)) {
            studentsGotDengue.push(student.id);
        }
    })
})

const studentsThatDontGotDengueFiltered = studentsMappedData.filter(student => !studentsGotDengue.includes(student.id));

const formattedRelatory = formatRelatory(studentsThatDontGotDengueFiltered, necessaryColumns);

module.exports = {
    relatory: {
        people: formattedRelatory,
        peopleAmount: formattedRelatory.length,
        samplingAmount: studentsMappedData.length,
        amountDontSatisfies: studentsMappedData.length - formattedRelatory.length,
        necessaryColumns,
        fileName: 'Relatorio Educacao'
    }
}