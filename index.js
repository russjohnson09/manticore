// Copyright (c) 2018, Livio, Inc.
require('dotenv').config(); //load environment
const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser'); //for parsing JSON
const app = new Koa();
const config = require('./config');
console.log(`app will listen on port ${config.httpPort}`);


//https://github.com/koajs/koa/issues/905
//middleware functions must all be async?

//
//10.0.2.2:4100
//http://10.0.2.2:4100/policy.json

//add ability to parse JSON from posts
app.use(bodyParser());

// app.use(`/static/policy.json`,serve(__dirname + '/static/policy.json'));
// app.use(serve(__dirname + '/static/policy.json'));
// app.use(serve(__dirname + '/static'));
// app.use(serve(__dirname + '/dist'));

// require('./policy/manticore-policy')();


app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.error(err);
    }
});


//serve Manticore webpage if enabled
// Must build it first by running 'npm run build-webpage'
if (!config.webpageDisabled) {
    app.use(serve(__dirname + '/dist'));
}

// setup all koa middleware under the selected version in /api
require(`./api/${config.apiVersion}`)(app);

// uncaught error handler
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.error(err);
    }
});

let server  = app.listen(config.httpPort, () => {
    console.log(`App listing on port ${server.address().port} using config ${config.httpPort} !`);
});







setTimeout(function() {
    console.log(`starting broker`);
    require('./broker/index');


    setTimeout(function() {
        console.log(`starting logger`);
        require('./logstream/server');

    }, 1000 * 1)
}, 1000 * 2);


