/*
 * Copyright (c) 2018 Livio, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided with the
 * distribution.
 *
 * Neither the name of the Livio Inc. nor the names of its contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var http = require('http');
var server = http.createServer(function(request, response) {});
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;

var numClients = 0;
var conClients = {};
var sdlConnection = {};
var registeredComponents = {};
var sdlWebsocket = new WebSocketClient();

/*
// Connection to Core. This application is treated
// as the client in the implementation.
*/
sdlWebsocket.on('connect', function(connection) {
    console.log('Connected to SDL');
    sdlConnection = connection;
    sdlConnection.on('message', function(message) {
        var msg = message.utf8Data;
        //console.log(msg);
        forwardToClients(msg);
    });



    try {

        server.on('error', function(err) {
            console.log(`in use?`,err);

        })
        // server.listen(8086);

//only start listening once a connection is established.
        server.listen(process.env.BROKER_PORT || 9001, function(err) {
            console.log(`in use?`,err);
        });

    }
    catch(e)
    {
        console.log(`failed to start broker`);
    }




});

sdlWebsocket.on('error', function(err) {
    console.log('failed to connect to sdl',err);

});

sdlWebsocket.on('close', function(err) {
    console.log('failed to connect to sdl closed',err);

});

sdlWebsocket.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());

    // console.log(`attempting to connection to core retry`,{wsUrlCore});
    // sdlWebsocket.connect(wsUrlCore);
});


//12345 is the tcp connection for apps.
// let wsUrlCore = process.env.CORE_WS_CONNECTION || 'ws://localhost:12345';

// LinkToWebHMI = HMI//index.html
// ; WebSocket connection address and port
// ServerAddress = 127.0.0.1
// ServerPort = 8087
let wsUrlCore = process.env.CORE_WS_CONNECTION || 'ws://localhost:8087';

// sdlWebsocket.connect('ws://localhost:8087');
console.log(`attempting to connection to core`,{wsUrlCore});
sdlWebsocket.connect(wsUrlCore);
// sdlWebsocket.connect(wsUrlCore,'echo-protocol');

/*
// Creating websocket server to allow connections
// from different HMI Clients. This app will track
// HMI component registration and will block clients
// from sending duplicate component registerations
// to SDL Core.
*/

var wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(hmi){

    var connection = hmi.accept(null, hmi.origin);
    console.log("Client Connected");
    var id = numClients++;
    conClients[id] = connection;
    conClients[id].registeredComponents = {};

    connection.on('message', function(message) {
        var msg = message.utf8Data;
        console.log(msg);

        console.log(`received message`,message,`hmi`,hmi.origin);

        var rpc = JSON.parse(msg);
        if (rpc.notRpc) { //propagate the message to all HMIs instead of to core
            return forwardToClients(msg);
        }

        switch(rpc.method)  {
            case "MB.registerComponent":
                if(!(rpc.params.componentName in registeredComponents)) {
                    console.log("Registering Component: " + rpc.params.componentName);
                    registeredComponents[rpc.params.componentName] = true;
                    addObserver(id, rpc.params.componentName);
                    forwardToSDL(msg);
                } else {
                    console.log("Component Already Registered");
                    console.log("Adding Client As Observer For" + rpc.params.componentName);
                    addObserver(id, rpc.params.componentName);
                }
                break;
            default:
                forwardToSDL(msg);
                break;
        }
    });

    connection.on('close', function(reasonCode, description) {
        delete conClients[id];
        console.log("Client Disconnected " + id);
        console.log(conClients);
    });
});

/*
// Forward all messages to SDL Core from any
// connected client without filtering.
*/

function forwardToSDL(msg) {
    try {
        sdlConnection.send(msg);

    }
    catch(e)
    {
        console.log(`failed to forward message`,sdlConnection,e);
    }
}

/*
// Only forward component messages to clients
// that have previously registered the
// corresponding component.
*/

function forwardToClients(msg) {
    try {
        var componentName = undefined;
        for(var i in conClients) {
            var rpc = JSON.parse(msg);
            if(rpc.method) {
                componentName = rpc.method.split(".")[0];
                console.log("Extracted Component Name: " + componentName);
                if(conClients[i].registeredComponents[componentName] == true) {
                    conClients[i].send(msg);
                }
            } else {
                componentName = undefined;
                conClients[i].send(msg);
            }
        }
    }
    catch (e)
    {
        console.error(`failed to forwardToClients`,e);
    }

}

function addObserver(id, component) {
    if(!(component in conClients[id].registeredComponents)) {
        conClients[id].registeredComponents[component] = true;
        console.log("Adding Client " + id + " as observer for component " + component);
    }
}


