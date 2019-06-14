from protocol import SdlPacket, ServiceType, SdlPacketFactory
from transport import SdlPsm, WiFiTransport
from session import SdlSession
import sys,os


# include standard modules
import argparse

# initiate the parser
parser = argparse.ArgumentParser()

#parser.add_argument("--url", "-u", help="set output width", default="m.sdl.tools")
#parser.add_argument("--url", "-u", default="mstaging.sdl.tools")


#https://staging.smartdevicelink.com/resources/manticore/
#11232
parser.add_argument("--url", "-u", default="m.sdl.tools")
parser.add_argument("--port", "-p", required=True)


args = parser.parse_args()


print(args)

print(args.port)


# ------------------------------------------------------------
# "THE BEERWARE LICENSE" (Revision 42):
# <author> wrote this code. As long as you retain this
# notice, you can do whatever you want with this stuff. If we
# meet someday, and you think this stuff is worth it, you can
# buy me a beer in return.
# ------------------------------------------------------------


class Sdl:

    # Create transport, create session
    session = None

    def __init__(self):
        self.data = []
    print(" ***** Creating sample packet ***** ")
    # packet = SdlPacket.SdlPacket.create_sdl_packet(1, False, SdlPacket.SdlPacket.FRAME_TYPE_CONTROL,
    #                                               ServiceType.ServiceType.RPC,
    #                                               SdlPacket.SdlPacket.FRAME_INFO_START_SERVICE, 0, 1, 0, None)
    packet = SdlPacketFactory.create_rpc_start_service(False)
    packet.print_log()
    byte_array = packet.construct_packet()
    psm = SdlPsm.SdlPsm()
    psm.reset()
    print(" ***** Iterating through packet bytes ***** ")

    for i in range(0, len(byte_array)):
        print(byte_array[i])
        did_move = psm.handle_byte(byte_array[i])
        # print("did move:", did_move)
    if psm.get_state() == psm.FINISHED_STATE:
        packet = psm.get_formed_packet()
        print(" ***** Packet completed through PSM ***** ")
        packet.print_log()
    else:
        print("Effing error")

    session = SdlSession.SdlSession()

    url = 'm.sdl.tools'



    #url = '34.202.219.3'
    #port = 5316


    url = args.url
    port = int(args.port)

    print(" ***** Attempting to create TCP connection ***** " + url + ':' + (str(port)))
    #PING manticore-2-3-0-0-production-elb-692312183.us-east-1.elb.amazonaws.com (34.202.219.3): 56 data bytes

    tcp = WiFiTransport.TCP()
    tcp.init(url, port, session.handle_packet)
    tcp.connect()
    print(" ***** Connected *****")

    session.init(tcp.write)



    print("construct")

    packet1 = packet.construct_packet()

    print(packet1)
    print(packet1.decode("utf-8"))
    print(packet1.decode("ascii"))
    #os._exit(1)
    #sys.exit()




    tcp.write(packet.construct_packet())


    #print("write package")
    #os._exit(1)
     #16142 INFO  [19:15:41,177][ProtocolHandler] Processing incoming data of size 8 for connection 1249
     #16143 WARN  [19:15:41,177][ProtocolHandler] Unknown version:1
     #16144 WARN  [19:15:41,177][ProtocolHandler] Unknown version:1
     #16145 INFO  [19:15:41,177][ProtocolHandler] Created and passed 1 packets
     #16146 WARN  [19:15:41,177][ConnectionHandler] Connection not found !
     #16147 INFO  [19:15:41,177][ProtocolHandler] StartSession ID 0 and Connection ID 1249
     #16148 WARN  [19:15:41,177][ConnectionHandler] Session not found in this connection!

