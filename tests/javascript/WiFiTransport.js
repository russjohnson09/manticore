const Net = require('net');

const SdlPsm = require('./SdlPsm');


module.exports = class WiFiTransport {


    //props

    //client

    //tcpConnectionOpts


    constructor(opts)
    {
        let {port,host} = opts;

        this.tcpConnectionOpts = {
            port,
            host
        };

        this.sdlPsm = new SdlPsm();

        // console.log(`sdl`,this.sdlPsm);
        // process.exit(0);


    }

    async initClientListeners()
    {
        let self = this;

        self.client.on('data',self.dataHandler.bind(self));
        // client.on('data', function(chunk) {
        //
        // }
    }


    async sendTestData1()
    {
        // 15475 INFO  [19:10:48,316][ProtocolHandler] Processing incoming data of size 8 for connection 1142
        // 15476 WARN  [19:10:48,316][ProtocolHandler] Unknown version:1
        // 15477 WARN  [19:10:48,316][ProtocolHandler] Unknown version:1
        // 15478 INFO  [19:10:48,316][ProtocolHandler] Created and passed 1 packets
        // 15479 WARN  [19:10:48,317][ConnectionHandler] Connection not found !
        // 15480 INFO  [19:10:48,317][ProtocolHandler] StartSession ID 0 and Connection ID 1142
        // 15481 WARN  [19:10:48,317][ConnectionHandler] Session not found in this connection!

        //after writing this which will log a session not found we should receive a response to get data to initialize the
        //session using a control packet returned from core.

        let arr = new Uint8Array([
            16,7,1,0,0,0,0,0
            // 0x10,0x07,0x01,0x00,0x00,0x00,0x00,0x00
        ]);

        // this.client.write('Hello, server.');
        this.client.write(arr);
    }


    //    session.init(tcp.write)
    // need to initialize and use the session with tcp.write

    async sendTestData()
    {
        let arr = new Uint8Array([
            16,7,1,0,0,0,0,0
            // 0x10,0x07,0x01,0x00,0x00,0x00,0x00,0x00
        ]);

        // this.client.write('Hello, server.');
        this.client.write(arr);


        // Read data:  b'@\x07\x02\x01\x00\x00\x00\x04\x00\x00\x00\x07\x00\x01\x00\x14'
        // version:  4
        // encryption:  False
        // frame type:  0
        // service type:  7
        // frame info:  2
        // session id:  1
        // data length:  4
        // message id:  7
        // payload :  bytearray(b'\x00\x01\x00\x14')
        // Handling control packet in session
        // {"syncMsgVersion": {"majorVersion": 4, "minorVersion": 5, "patchVersion": 0}, "appName": "Dummy", "appID": "5234523452", "isMediaApplication": true, "languageDesired": "EN-US", "hmiDisplayLanguageDesired": "EN-US"}


    }

    async init()
    {
        await this.tcpConnectionInit();

        await this.initClientListeners();

        await this.sendTestData();
    }


    //russ_manticore/tests/SdlProxy/transport/SdlPsm.py


    //Need to handle the data by putting it together until the entire request has completed.
    dataHandler(chunk)
    {
        console.log(`dataHandler called`,chunk);

        for (let byte of chunk)
        {
            console.log(`read btype`,byte);
            this.sdlPsm.readByte(byte)

        }

        // version:  4
        // encryption:  False
        // frame type:  0
        // service type:  7
        // frame info:  2
        // session id:  2
        // data length:  4
        // message id:  16
        // payload :  bytearray(b'\x00\x02\x01\xbf')


        //Read data:  b'@\x07\x02\x02\x00\x00\x00\x04\x00\x00\x00\x10\x00\x02\x01\xbf'
        // dataHandler called <Buffer 40 07 02 01 00 00 00 04 00 00 00 13 00 01 00 cc>


        //chunk is a bytearray that needs to be parse.



        // console.log(`Data received from the server: ${chunk.toString()}.`);

        // Request an end to the connection after the data has been received.
        // client.end();
    }


    async tcpConnectionInit()
    {
        const client = new Net.Socket();
        this.client = client;
// Send a connection request to the server.
        return new Promise((resolve,reject) => {
            console.log(`create client connection with options`,this.tcpConnectionOpts);
            client.connect(this.tcpConnectionOpts, function (err) {
                console.log(err);

                // If there is no error, the server has accepted the request and created a new
                // socket dedicated to us.

                console.log('TCP connection established with the server.');





                // client.write('Hello, server.');
                // 13878 WARN  [18:43:55,750][ProtocolHandler] Unknown version:6
                // 13879 WARN  [18:43:55,750][ProtocolHandler] Unknown version:6
                // 13880 WARN  [18:43:55,750][ProtocolHandler] Packet validation failed
                // 13881 WARN  [18:43:55,750][ProtocolHandler] Unknown version:6
                // 13882 WARN  [18:43:55,750][ProtocolHandler] Unknown version:6
                // 13883 WARN  [18:43:55,750][ProtocolHandler] Packet validation failed
                // 13884 INFO  [18:43:55,750][ProtocolHandler] Invalid service type: 32
                // 13885 WARN  [18:43:55,750][ProtocolHandler] Invalide service type32
                // 13886 WARN  [18:43:55,750][ProtocolHandler] Packet validation failed
                // 13887 INFO  [18:43:55,750][ProtocolHandler] Invalid service type: 115
                // 13888 WARN  [18:43:55,750][ProtocolHandler] Invalide service type115
                // 13889 WARN  [18:43:55,750][ProtocolHandler] Packet validation failed
                // 13890 WARN  [18:43:55,750][ProtocolHandler] No packets have been created.
                // 13891 WARN  [18:43:55,750][ProtocolHandler] Malformed message occurs, connection id 587

                resolve();
            })
        });


    }

    static async create(opts)
    {
        let obj = new this(opts);


        await obj.init();

        return obj;
    }
}