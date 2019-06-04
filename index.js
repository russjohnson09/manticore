// Copyright (c) 2018, Livio, Inc.
require('dotenv').config(); //load environment
const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser'); //for parsing JSON
const app = new Koa();
const config = require('./config');

//add ability to parse JSON from posts
app.use(bodyParser());

//serve Manticore webpage if enabled
//Must build it first by running 'npm run build-webpage'
if (!config.webpageDisabled) {
    app.use(serve(__dirname + '/dist'));
}

//setup all koa middleware under the selected version in /api
require(`./api/${config.apiVersion}`)(app);

//uncaught error handler
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.error(err);
    }
});

// app.listen(config.httpPort);


let server  = app.listen(config.httpPort, () => {
    console.log(`Example app listening on port ${server.address().port} using config ${config.httpPort} !`);
});