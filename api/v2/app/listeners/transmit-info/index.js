// Copyright (c) 2018, Livio, Inc.
const config = require('../../config.js');
const {store, job, logger, websocket} = config;

//module that handles transmitting information to clients connected over websockets

let cachedInfo = {};

module.exports = {
    //clears cached info of removed users
    "removed-request": async (ctx, next) => {
        clearUser(ctx.id);
        next();
    },
    //for transmitting position information ASAP to non-claimed users
    "post-request": async (ctx, next) => {
        //get all the non-claimed requests
        const nonClaimedRequests = [];

        for (let id in ctx.waitingState) {
            if (ctx.waitingState[id].state !== "claimed") {
                nonClaimedRequests.push(ctx.waitingState[id]);
            }
        }

        await manageNonClaimedRequests(nonClaimedRequests);

        next();
    },
    //for transmitting services and position information to users
    "post-waiting-job-advance": async (ctx, next) => {
        //split up requests into two categories
        const claimedRequests = [];
        const nonClaimedRequests = [];

        for (let id in ctx.waitingState) {
            if (ctx.waitingState[id].state === "claimed") {
                claimedRequests.push(ctx.waitingState[id]);
            }
            else {
                nonClaimedRequests.push(ctx.waitingState[id]);
            }
        }

        //clear out the cache of request data that doesn't exist anymore
        clearCache(ctx.waitingState);

        await manageNonClaimedRequests(nonClaimedRequests);

        await manageClaimedRequests(claimedRequests);

        next();
    },
    "ws-connect": async (ctx, next) => {
        // process.exit(1);
        console.log(`ws-connect`,ctx.id,ctx);
        //if instance information already exists for this user, then send it
        const positionInfo = getInfo(ctx.id, "position");
        const serviceInfo = getInfo(ctx.id, "services");
        console.log(`ws-connect positionInfo serviceInfo`,ctx.id, positionInfo, serviceInfo);

        if (true)
        {
            let data = {type: "position", data: {position: 0, wait: true}};
            console.log(`ws-connect send`,data);
            // websocket.send(ctx.id,JSON.stringify(data));
            ctx.websocket.send(JSON.stringify(data));
            // # Expose the following ports
            // #   3001: Expose SDL Core's file system
            // #   12345: Expose SDL Core's primary port. Used to communicate with the SDL Core instance over TCP
            // #   5050: Expose video streaming port
            // #   5080: Expose audio streaming port
            // #   8090: Expose time testing port
            // #   8888: Expose websocket port for core log streaming
            // #   9000: Websocket connection to the broker
            // #   9898: Expose miniature policy server port
            // #EXPOSE 3001 12345 5050 5080 8090 8888 9000 9898
            setTimeout(() => {
                let data = {type: "position", data: {position: 0, wait: false}};


                console.log(`ws-connect send`,data);
                ctx.websocket.send(JSON.stringify(data));

                // # Expose the following ports
                // #   3001: Expose SDL Core's file system
                // #   12345: Expose SDL Core's primary port. Used to communicate with the SDL Core instance over TCP
                // #   5050: Expose video streaming port
                // #   5080: Expose audio streaming port
                // #   8090: Expose time testing port
                // #   8888: Expose websocket port for core log streaming
                // #   9000: Websocket connection to the broker
                // #   9898: Expose miniature policy server port
                // #EXPOSE 3001 12345 5050 5080 8090 8888 9000 9898

                //{brokerAddress: "wss://ncjgvmpiaoyy1sj2.mstaging.sdl.tools:444", tcpAddress: "197.168.1.57:12345", userAddress: "hmi2.localhost", logAddress: "ws://197.168.1.57:8888", policyAddress: "https://udahoewemfgfmzsf.mstaging.sdl.tools"}
                // brokerAddress: "wss://ncjgvmpiaoyy1sj2.mstaging.sdl.tools:444"
                // logAddress: "ws://197.168.1.57:8888"
                // policyAddress: "https://udahoewemfgfmzsf.mstaging.sdl.tools"
                // tcpAddress: "197.168.1.57:12345"
                // userAddress: "hmi2.localhost"

                // brokerAddress: "wss://suu3xmm3l0xutksk.mstaging.sdl.tools:444"
                // logAddress: "wss://xhab3cu493shyjmd.mstaging.sdl.tools:444"
                // policyAddress: "https://537834fyag6hllg7.mstaging.sdl.tools"
                // tcpAddress: "mstaging.sdl.tools:15294"
                // userAddress: "https://pbmivi3fna2ro976.mstaging.sdl.tools" //hmi-user

                //https://stackoverflow.com/questions/21410435/connect-websocket-server-by-lan-ip-address
                setTimeout(() => {
                    let data =
                      {"type":"services","data":
                            {
                                // "core-tcp":"197.168.1.57:9010",
                                // "core-broker":"ws://197.168.1.57:9011",
                                // "core-file":"197.168.1.57:9012",
                                // "core-log":"ws://197.168.1.57:9013",
                                "core-log": process.env.CORE_LOG_ADDRESS || "ws://localhost:8888",
                                "core-tcp":process.env.CORE_TCP_ADDRESS  || "localhost:12345",
                                "core-broker":"ws://localhost:" + process.env.BROKER_PORT,
                                "core-file":process.env.CORE_FILE_ADDRESS || "localhost:9012",

                                "core-policy":"https://udahoewemfgfmzsf.mstaging.sdl.tools", //TODO don't really need to worry about this?
                                // "hmi-user":"https://0iutt3k15ttntisp.mstaging.sdl.tools"

                                "hmi-user": process.env.GENERIC_HMI_ADDRESS || "generic_hmi.localhost", //generic_hmi host location //userAddress
                                // "hmi-user": "http://localhost:8081" //generic_hmi host location
                            }};

                    console.log(`ws-connect send`,data);
                    ctx.websocket.send(JSON.stringify(data));

                    next();
                },1000);
            },1000);





            return;
        }

        if (positionInfo) {
            await websocket.send(ctx.id, JSON.stringify(positionInfo));
        }
        if (serviceInfo) {
            const serviceInfoCopy = JSON.parse(JSON.stringify(serviceInfo));
            serviceInfoCopy.data = job.formatAddresses(ctx.id, serviceInfoCopy.data);
            await websocket.send(ctx.id, JSON.stringify(serviceInfoCopy));
        }
        next();
    }
}

async function manageNonClaimedRequests (requests) {
    //sort non-claimed requests by lowest queue number
    requests.sort( (a, b) => {
        return a.queue - b.queue;
    });

    //parse through all non-claimed requests and send the following:
    //the position in the queue they are in
    //whether they need to wait in the queue (is the user in a waiting state?)
    requests.forEach((request, index) => {
        const id = request.id;
        const positionInfo = {
            type: "position",
            data: {
                position: index,
                wait: request.state === "waiting"
            }
        };
        const sameInfo = storeInfo(id, "position", positionInfo); //cache position info
        if (sameInfo) return; //don't sent redundant info
        websocket.send(id, JSON.stringify(positionInfo));
    });
}

async function manageClaimedRequests (requests) {
    //parse through all claimed requests and send the address information to the clients
    requests.forEach(request => {
        const id = request.id;
        const serviceInfo = {
            type: "services",
            data: request.services
        };
        const sameInfo = storeInfo(id, "services", serviceInfo); //cache service info
        if (sameInfo) return; //don't sent redundant info
        const serviceInfoCopy = JSON.parse(JSON.stringify(serviceInfo));
        serviceInfoCopy.data = job.formatAddresses(id, serviceInfoCopy.data);
        websocket.send(id, JSON.stringify(serviceInfoCopy));
    });
}

//cache-related functions

//returns whether the stored information is the same
function storeInfo (id, property, value) {
    if (!cachedInfo[id]) {
        cachedInfo[id] = {};
    }
    const sameInfo = JSON.stringify(value) === JSON.stringify(getInfo(id, property));
    cachedInfo[id][property] = value;
    return sameInfo;
}

function getInfo (id, property) {
    if (!cachedInfo[id]) return null;
    return cachedInfo[id][property];
}

//remove parts of the cache depending on the waiting state found
function clearCache (waitingState) {
    for (let id in cachedInfo) {
        if (!waitingState[id]) {
            clearInfo(id, "position");
            clearInfo(id, "services");
        }
        else if (waitingState[id].state !== "claimed") {
            clearInfo(id, "services");
        }
    }
}

function clearInfo (id, property) {
    delete cachedInfo[id][property];
}

function clearUser (id) {
    delete cachedInfo[id];
}
