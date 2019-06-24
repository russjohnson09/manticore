const Net = require('net');
const SdlPacket = require('./SdlPacket');

const SdlPsm = class SdlPsm {


    constructor()
    {
        this.state = 0;

        this.state = SdlPsm.START_STATE;


        this.version = 0;

    }


    readByte(byte)
    {
        let self = this;
        // print("Current state: ", self.state)
        self.state = self.transitionOnInput(byte, self.state);
        console.log(`readByte`,byte,self.state);

        if (self.state === SdlPsm.ERROR_STATE)
        {
            return false
        }
        else {
            return true;
        }
    }

    getVersionFromByte(byte)
    {
        let version = (byte & SdlPsm.VERSION_MASK) >> 4;
        console.log(`getVersionFromByte`,byte, SdlPsm.VERSION_MASK,version);

        return version;
    }

    handleControlFrameInfoState(raw_byte)
    {
        let self = this;
        self.controlFrameInfo = raw_byte & 0xFF;

        if (
            self.frameType === SdlPacket.FRAME_TYPE_CONTROL ||
            self.frameType === SdlPacket.FRAME_TYPE_CONSECUTIVE
        )
        {
            return; //pseudo break;
        }
        else if (self.frameType === SdlPacket.FRAME_TYPE_SINGLE
        || self.frameType === SdlPacket.FRAME_TYPE_SINGLE
        )
        {

        }






        //     self.controlFrameInfo = raw_byte & 0xFF
    //     if self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_CONTROL or self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_CONSECUTIVE:
    //     self.pseudo_break()
    //     elif self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_SINGLE \
    //                 or self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_FIRST:
    //     # Fall through since they are both the same
    //     if self.controlFrameInfo != 0x00:
    //     return self.ERROR_STATE
    // else:
    //     return self.ERROR_STATE
    }


    transitionOnInput(raw_byte,state)
    {
        let self = this;

        if (state === SdlPsm.START_STATE)
        {
            this.version = this.getVersionFromByte(raw_byte);
            if (self.version === 0)
            {
                return SdlPsm.ERROR_STATE;
            }

            self.compression = (1 == ((raw_byte & SdlPsm.COMPRESSION_MASK) >> 3));

            self.frameType = raw_byte & SdlPsm.FRAME_TYPE_MASK;


            // # Log.trace(TAG, raw_byte + " = Frame Type: " + frameType);

            // # These are known versions supported by this library.
        // if (self.version < 1 or self.version > 5) and self.frameType != SdlPacket.SdlPacket.FRAME_TYPE_CONTROL:
        //     return self.ERROR_STATE

            // if self.frameType < SdlPacket.SdlPacket.FRAME_TYPE_CONTROL \
            // or self.frameType > SdlPacket.SdlPacket.FRAME_TYPE_CONSECUTIVE:
            // return self.ERROR_STATE
            //
            // # We made it through.
            return SdlPsm.SERVICE_TYPE_STATE;

        }
        else if (state === SdlPsm.SERVICE_TYPE_STATE)
        {
            self.serviceType = (raw_byte & 0xFF);

            return SdlPsm.CONTROL_FRAME_INFO_STATE
        }
        else if (state === SdlPsm.CONTROL_FRAME_INFO_STATE)
        {
            return self.handleControlFrameInfoState(raw_byte);
        }
        else {

        }
        //
        //     elif state == self.CONTROL_FRAME_INFO_STATE:
        //     self.controlFrameInfo = raw_byte & 0xFF
        //     if self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_CONTROL or self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_CONSECUTIVE:
        //     self.pseudo_break()
        //     elif self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_SINGLE \
        //                 or self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_FIRST:
        //     # Fall through since they are both the same
        //     if self.controlFrameInfo != 0x00:
        //     return self.ERROR_STATE
        // else:
        //     return self.ERROR_STATE
        //
        //     return self.SESSION_ID_STATE
        //     elif state == self.SESSION_ID_STATE:
        //     self.sessionId = (raw_byte & 0xFF)
        //     return self.DATA_SIZE_1_STATE
        //     elif state == self.DATA_SIZE_1_STATE:
        //     # First data size byte
        //     self.dataLength += (raw_byte & 0xFF) << 24  # 3 bytes x 8 bits
        //     return self.DATA_SIZE_2_STATE
        //     elif state == self.DATA_SIZE_2_STATE:
        //     self.dataLength += (raw_byte & 0xFF) << 16  # 2 bytes x 8 bits
        //     return self.DATA_SIZE_3_STATE
        //     elif state == self.DATA_SIZE_3_STATE:
        //     self.dataLength += (raw_byte & 0xFF) << 8  # 1 byte x 8 bits
        //     return self.DATA_SIZE_4_STATE
        //     elif state == self.DATA_SIZE_4_STATE:
        //     self.dataLength += raw_byte & 0xFF
        //     if self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_SINGLE or self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_CONSECUTIVE:
        //     SdlPsm.pseudo_break()
        //     elif self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_CONTROL:
        //     # Ok, well here's some interesting bit of knowledge.
        //     # Because the start session request is from the phone with no knowledge of version it sends out a
        //     # v1 packet.THEREFORE there is no message id field.
        //     # ** ** Now you know and knowing is half the battle ** **
        //     if self.version == 1 and self.controlFrameInfo == SdlPacket.SdlPacket.FRAME_INFO_START_SERVICE:
        //     if self.dataLength == 0:
        //     return self.FINISHED_STATE  # We are done if we don't have any payload
        //     if self.dataLength <= SdlProtocol.SdlProtocol.V1_V2_MTU_SIZE - SdlProtocol.SdlProtocol.V1_HEADER_SIZE:
        //     self.payload = bytearray(self.dataLength)
        // else:
        //     return self.ERROR_STATE
        //     self.dumpSize = self.dataLength
        //     return self.DATA_PUMP_STATE
        //     elif self.frameType == SdlPacket.SdlPacket.FRAME_TYPE_FIRST:
        //     if self.dataLength == self.FIRST_FRAME_DATA_SIZE:
        //     SdlPsm.pseudo_break()
        // else:
        //     return self.ERROR_STATE
        //
        //     if self.version == 1:  # Version 1 packets will not have message id's
        //     if self.dataLength == 0:
        //     return self.FINISHED_STATE # We are done if we don't have any payload
        //     if self.dataLength <= SdlProtocol.SdlProtocol.V1_V2_MTU_SIZE - SdlProtocol.SdlProtocol.V1_HEADER_SIZE:
        //     self.payload =  bytearray(self.dataLength)
        // else :
        //     return self.ERROR_STATE
        //     self.dumpSize = self.dataLength
        //     return self.DATA_PUMP_STATE
        // else:
        //     return self.MESSAGE_1_STATE
        //     elif state == self.MESSAGE_1_STATE:
        //     self.messageId += (raw_byte & 0xFF) << 24 # 3bytesx8bits
        //     return self.MESSAGE_2_STATE
        //     elif state == self.MESSAGE_2_STATE:
        //     self.messageId += (raw_byte & 0xFF) << 16 # 2bytesx8bits
        //     return self.MESSAGE_3_STATE
        //     elif state == self.MESSAGE_3_STATE:
        //     self.messageId += (raw_byte & 0xFF) << 8 # 1bytex8bits
        //     return self.MESSAGE_4_STATE
        //     elif state == self.MESSAGE_4_STATE:
        //     self.messageId += raw_byte & 0xFF
        //     if self.dataLength == 0:
        //     return self.FINISHED_STATE; # We are done if we don't have any payload
        //     # TODO We might need a try/catch or w/e the hell it is in python for OOM
        //     try:
        //     self.payload = bytearray(self.dataLength)
        //     except Exception:
        //     return self.ERROR_STATE
        //     self.dumpSize = self.dataLength
        //     return self.DATA_PUMP_STATE
        //     elif state == self.DATA_PUMP_STATE:
        //     self.payload[self.dataLength - self.dumpSize] = raw_byte;
        //     self.dumpSize -= 1  # Do we have any more bytes to  read in?
        //     if self.dumpSize > 0:
        //     return self.DATA_PUMP_STATE
        //     elif self.dumpSize == 0:
        //     return self.FINISHED_STATE
        // else:
        //     return self.ERROR_STATE
        //     elif state == self.FINISHED_STATE: # We shouldn't be here...Should have been reset
        //     return self.ERROR_STATE
        // else:
        //     return self.ERROR_STATE
    }

};



SdlPsm.START_STATE = 0x0;
SdlPsm.SERVICE_TYPE_STATE = 0x02;
SdlPsm.CONTROL_FRAME_INFO_STATE = 0x03;
SdlPsm.SESSION_ID_STATE = 0x04;
SdlPsm.DATA_SIZE_1_STATE = 0x05;
SdlPsm.DATA_SIZE_2_STATE = 0x06;
SdlPsm.DATA_SIZE_3_STATE = 0x07;
SdlPsm.DATA_SIZE_4_STATE = 0x08;
SdlPsm.MESSAGE_1_STATE = 0x09;
SdlPsm.MESSAGE_2_STATE = 0x0A;
SdlPsm.MESSAGE_3_STATE = 0x0B;
SdlPsm.MESSAGE_4_STATE = 0x0C;
SdlPsm.DATA_PUMP_STATE = 0x0D;
SdlPsm.FINISHED_STATE = 0xFF;
SdlPsm.ERROR_STATE = -1;

SdlPsm.FIRST_FRAME_DATA_SIZE = 0x08;
SdlPsm.VERSION_MASK = 0xF0;  //# 4 highest bits
SdlPsm.COMPRESSION_MASK = 0x08;  //# 4th lowest bit
SdlPsm.FRAME_TYPE_MASK = 0x07;  //# 3 lowest bits

module.exports = SdlPsm;
