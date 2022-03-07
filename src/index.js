const fs = require('fs');
const path = require('path');
const { arrayBuffer } = require('stream/consumers');

const studentsLinesMappedToIndexes = {
    id: 0,
    name: 1,
    fathersName: 2,
    mothersName: 3,
    gender: 4,
    bornDate: 5,
}

const busesLinesMappedToIndexes = {
    id: 0,
    name: 1,
    fathersName: 2,
    mothersName: 3,
    gender: 4,
    bornDate: 5,
    buses: 6 
}

const dengueLinesMappedToIndexes = {
    id: 0,
    name: 1,
    fathersName: 2,
    mothersName: 3,
    gender: 4,
    bornDate: 5,
    denguesDate: 6 
}

function readFileAndMap(fileName, mapObject) {
    const data = fs.readFileSync(path.resolve('sheets', `${fileName}.csv`), 'utf8');

    const lines = data.split('\r\n');

    lines.shift();

    return lines.map(line => {
        line = line.split(';');

        return Object.fromEntries(Object.keys(mapObject).map(key => [key, line[mapObject[key]]]))
    })
}

function writeFileByRelatory({ people, peopleAmount, samplingAmount, amountDontSatisfies, necessaryColumns, fileName }) {    
    const data = people.map(obj => Object.values(obj));

    const columnKeys = [
        ...Object.values(necessaryColumns), 
        '',
        'Quantidade que satisfaz a condição',
        'Quantidade que não satisfaz',
        'Tamanho do conjunto avaliado'
    ]

    const amountColumns = [peopleAmount, amountDontSatisfies, samplingAmount];

    data.unshift(columnKeys);

    const dataToString = data.map((values, index) => {
        return index === 1
            ? [...values, '', ...amountColumns].join(';')
            : values.join(';')
    }).join('\n');

    fs.writeFileSync(path.resolve('results', `${fileName}.csv`), dataToString);
}

function isStraightSameFirstName(name1, name2) {
    return name1.split(' ')[0] === name2.split(' ')[0]
}

function isStraightFullName(name1, name2) {
    return name1.trim() === name2.trim();
}

function isFirstWordStartsWithSameLetter(string1, string2) {
    return string1.startsWith(string2[0]);
}

function isAllWordsStartsWithSameLetter(string1, string2) {    
    if(string1.split(' ').length !== string2.split(' ').length) return false
    if(string1.length === 1 || string2.length === 1) return false;

    return string1.split(' ')
            .map((word, index) => word.startsWith(string2.split(' ')[index][0]))
            .filter(Boolean)
            .length === string1.split(' ').length
}

function levenshteinDistance(source, target) {
    const result = [];

    for(let i = 0; i <= source.length; i++) result.push([i]);
    for(let j = 0; j < target.length; j++) result[0].push(j);

    for (i = 1; i <= source.length; i++) {
        for (j = 1; j <= target.length; j++) {
            result[i].push(0);

            if(source[i - 1] == target[j - 1]) {
                result[i][j] = result[i - 1][j - 1]
            } else {
                let minimum = Math.min(
                    result[i - 1][j] + 1,
                    result[i][j - 1] + 1
                );

                minimum = Math.min(
                    minimum,
                    result[i - 1][j - 1] + 1
                )

                result[i][j] = minimum;
            }
        }
    }

    return result[source.length][target.length];
}

function isSamePerson(person1, person2) {
    const minAcceptableMatches = 12;
    let matches = 0;

    if(
        person1.name.split(' ').length === 1 && person1.mothersName.split(' ').length && person1.fathersName.split(' ').length
        || person2.name.split(' ').length === 1 && person2.mothersName.split(' ').length && person2.fathersName.split(' ').length
    ) return false;

    if(isStraightFullName(person1.name, person2.name) && person1.name.split(' ').length > 1) return true;

    if(isStraightFullName(person1.fathersName, person2.fathersName) && person1.fathersName.split(' ').length > 1) matches += 2;
    if(isStraightFullName(person1.mothersName, person2.mothersName) && person1.mothersName.split(' ').length > 1) matches += 2;

    if(isFirstWordStartsWithSameLetter(person1.name, person2.name)) matches += 3;
    if(isFirstWordStartsWithSameLetter(person1.fathersName, person2.fathersName)) matches += 3;
    if(isFirstWordStartsWithSameLetter(person1.mothersName, person2.mothersName)) matches += 3;

    if(isStraightSameFirstName(person1.name, person2.name)) matches += 1;
    if(isStraightSameFirstName(person1.fathersName, person2.fathersName)) matches += 1;
    if(isStraightSameFirstName(person1.mothersName, person2.mothersName)) matches += 1;

    if(isAllWordsStartsWithSameLetter(person1.name, person2.name)) matches += 3;
    if(isAllWordsStartsWithSameLetter(person1.fathersName, person2.fathersName)) matches += 3;
    if(isAllWordsStartsWithSameLetter(person1.mothersName, person2.mothersName)) matches += 3;

    if(matches >= minAcceptableMatches) return true;

    const levenshteinDistanceMothersName = levenshteinDistance(person1.mothersName, person2.mothersName);
    const levenshteinDistanceFathersName = levenshteinDistance(person1.fathersName, person2.fathersName);
    const levenshteinDistanceName = levenshteinDistance(person1.name, person2.name);

    if(levenshteinDistanceMothersName <= 3
        && levenshteinDistanceFathersName <= 3
        && person1.fathersName.length > 10 && person1.mothersName.length > 10) matches += 3;

    if(levenshteinDistanceName > 10 && !isFirstWordStartsWithSameLetter(person1.name, person2.name)) matches -= 5; 

    if(levenshteinDistanceName <= 3) matches += 2;

    if(matches < minAcceptableMatches) {
        if(levenshteinDistanceName <= 5
            && levenshteinDistanceMothersName <= 5
            && levenshteinDistanceFathersName <= 5) return true;
    }

    return matches >= minAcceptableMatches;
}

function formatRelatory(filteredData, template) {
    return filteredData.map(person => Object.fromEntries(Object.keys(template).map(key => [key, person[key]])));
}

const studentsMappedData = readFileAndMap('students', studentsLinesMappedToIndexes).sort((a, b) => b.name > a.name ? -1 : 1);
const dengueMappedData = readFileAndMap('dengue', dengueLinesMappedToIndexes).sort((a, b) => b.name > a.name ? -1 : 1);
const busesMappedData = readFileAndMap('buses', busesLinesMappedToIndexes).sort((a, b) => b.name > a.name ? -1 : 1);

module.exports = {
    studentsMappedData,
    dengueMappedData,
    busesMappedData,
    studentsLinesMappedToIndexes,
    busesLinesMappedToIndexes,
    dengueLinesMappedToIndexes,
    isSamePerson,
    isSamePerson,
    formatRelatory
}

let stringDeAviso = '';
let stringProgressBar = '[                                        ]';

const initialTime = new Date().getTime()

for(let i = 1; i < 11; i++) {
    const internalInitialTime = new Date().getTime();
    const { relatory } = require(`./relatory${i}/index.js`);

    writeFileByRelatory(relatory);

    stringDeAviso += `\n${i}° relatory generated successfully ✓ ${(new Date().getTime() - internalInitialTime) / 1000}s\n`;
    stringProgressBar = stringProgressBar.replace('    ', '====');
    console.clear();
    console.log(stringDeAviso);
    console.log(stringProgressBar + ` ${i*10}%`);
    i == 10 && console.log(`\nProcess done in ${((new Date().getTime() - initialTime) / 1000).toFixed(2)} seconds`);
}