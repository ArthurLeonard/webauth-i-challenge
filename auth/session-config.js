const session = require('express-session');
const sessionStore = require('connect-session-knex')(session);
const configuredKnex = require('../data/dbConfig.js');

module.exports = {
    name: 'session',
    secret: 'Gaumarjost Sakartvelos',
    cookie: {
        maxAge: 1000 * 60 * 15, // session duration in milliseconds
        secure: true, // only send cookies over https (not over http)
        httpOnly: true // false means javascript can access the cookie on the browser
    },
    resave: false, //avoid recreating unchanged sesssions **
    saveUninitialized: false, //GDPR compliance
    store: new sessionStore ({
        knex: configuredKnex,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000 * 60 * 60 // delete expired sessions every hour
    })


}