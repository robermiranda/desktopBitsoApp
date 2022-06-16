
const hostEnv = {
    DEV : 'api-dev.bitso.com',
    PROD : 'api.bitso.com'
};

exports.credentials = {
    KEY: process.env.KEY,
    SECRET: process.env.SECRET
};

exports.env = {
    HOST : hostEnv.PROD,
    PATH : '/v3'
}

