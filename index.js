'use strict';

const chalk = require('chalk');
const { difference } = require('lodash');
const RequestPromise = require('request-promise');
const { URL, URLSearchParams } = require('url');
const { writeFile: writeFileAsync } = require('jsonfile');
const Promisify = require('es-promisify');
const writeFile = Promisify(writeFileAsync);

async function query (qs) {
    const endpoint = 'https://urapprest.uranalytics.p.azurewebsites.net/api/';
    const url = new URL('asignaturas2', endpoint);
    const uri = url.toString();

    const { data } = await RequestPromise({ uri, qs, json: true });
    return data;
}

async function main () {
    const setA = await query({ tipo: 'PSC', tipoElectiva: '*' });
    const codesA = setA.map(o => o.codAsignatura);
    const setB = await query({ tipo: 'PSC' });
    const codesB = setB.map(o => o.codAsignatura);

    console.debug(chalk`{white.bgRed.bold sizeof(setA) = ${setA.length}}`);
    console.debug(chalk`{white.bgRed.bold sizeof(setB) = ${setB.length}}`);

    const diffCodesAB = difference(codesA, codesB);
    const diffAB = diffCodesAB
        .map(code => setA.find(o => o.codAsignatura === code));

    await writeFile('diffAB.json', diffAB, { spaces: 4 });

    console.debug(chalk`{blue.bgWhite.bold sizeof(diffAB) = ${diffAB.length}}`);
}

main();
