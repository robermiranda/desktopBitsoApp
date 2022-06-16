
const crypto = require('crypto');
const config = require('./config');
    
exports.getOptions = function(params) {

    if (!params) return;

    let queryParams = '';
    if (params.queryParams) {
        for (const k of Object.keys(params.queryParams)) {
            queryParams  += `${k}=${params.queryParams[k]}&`;
        }
    }

    const requestPath = `${config.env.PATH}/${params.requestFunction}?${queryParams}`;

    const nonce = new Date().getTime();

    let message = nonce + params.httpMethod + requestPath;
    
    // Needed for POST endpoints requiring data
    const payload = JSON.stringify(params.payload)
    if (params.httpMethod === "POST") message += payload;

    const signature = crypto
    .createHmac('sha256', config.credentials.SECRET)
    .update(message)
    .digest('hex');

    const authHeader = `Bitso ${config.credentials.KEY}:${nonce}:${signature}`;

    return {
        https : {
            host: config.env.HOST,
            path: requestPath,
            method: params.httpMethod,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        },
        
        payload
    };
}
