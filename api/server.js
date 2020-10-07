const express = require('express');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const server = express();

const sessionConfig = {
    name: 'jcsession',
    secret: 'special secret',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore({
        knex: require('../dbConfig.js'),
        tablename: 'session',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000 * 60 * 60
    })
};

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter)

module.exports = server;