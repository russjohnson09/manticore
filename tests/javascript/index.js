

const WiFiTransport = require('./WiFiTransport');





//SDL_PORT=1 node index.js

async function start()
{
    let host = `m.sdl.tools`;
    let port = process.env.SDL_PORT;


    if (!port)
    {
        console.log(`SDL_PORT is required`);


        process.exit(1);
    }


    console.log(`***** Attempting to create TCP connection ***** ${host}:${port}`)

    let transport = await WiFiTransport.create({
        port,
        host
    });

    console.log(`***** WiFiTransport successful sock connection *****`);
    // bytearray(b'\x10\x07\x01\x00\x00\x00\x00\x00')

    //overflow puts it back to 0
    let arr = new Uint8Array([255555]);
    // [67]

    arr = new Uint8Array([0xFF]);

    arr = new Uint8Array([
        16,7,1,0,0,0,0,0
        // 0x10,0x07,0x01,0x00,0x00,0x00,0x00,0x00
    ]);

    console.log(arr);


    // {/*<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 01 f4 01 f4 00 00 ff db 00 43 00 08 ...>*/}
    // console.log(b'\x10\x07\x01\x00\x00\x00\x00\x00')

    //8 bit signed
    // 0 - 255
    // 0x00 - 0xFF
    // new Uint8Array(); // new in ES2017
    // new Uint8Array(length);
    // new Uint8Array(typedArray);
    // new Uint8Array(object);
    // new Uint8Array(buffer [, byteOffset [, length]]);
    // new Buffer()







    //
// ***** WiFiTransport end connect *****
// ***** Connected *****


}




(async () => {
    await start();
})();










// ***** Packet completed through PSM *****
// version:  1
// encryption:  False
// frame type:  0
// service type:  7
// frame info:  1
// session id:  0
// data length:  0
// message id:  0
// payload :  b''
// ***** Attempting to create TCP connection ***** m.sdl.tools:18456
// ***** WiFiTransport init *****
// ***** WiFiTransport end init *****
// ***** WiFiTransport connect ***** m.sdl.tools:18456
// ***** WiFiTransport successful sock connection *****
// ***** WiFiTransport end connect *****
// ***** Connected *****
// Read data:  b'@\x07\x02\x01\x00\x00\x00\x04\x00\x00\x00\x17\x00\x01\x00\xf1'
// version:  4
// encryption:  False
// frame type:  0
// service type:  7
// frame info:  2
// session id:  1
// data length:  4
// message id:  23
// payload :  bytearray(b'\x00\x01\x00\xf1')
// Handling control packet in session
