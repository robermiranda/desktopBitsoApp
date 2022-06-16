/**
 * Manda una peticion a bitso.
 * Ejemplo: 'node bitsoTrade balance'
 * Falta agregar la funcionalidad cuando el httpMethod es 'POST'
 * Vease signing.js para agregar dicha funcionalidad
 */

const util = require('./util');
const https = require('https');
const params = JSON.parse(process.argv[2]);

const options = util.getOptions(params);

if (!options) {
    
    const res = {
        succes : false,
        error : {
            mesage : `NO SE OBTUVO EL PARAMETRO "options" PARA ACTION: ${action}`
        }
    }

    console.log(JSON.stringify(res));
    
    return;
}

const req = https.request(options.https, function(res) {

    let rawData = '';
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => process.send(rawData));
});

if (options.https.method === 'POST') req.write(options.payload);

req.end();

req.on('error', error => console.error(JSON.stringify({
    success : false,
    error : {
        message : `ERROR EN LA PETICION. ${error}`
    }
})));
