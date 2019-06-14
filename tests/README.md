http://ubuntuhandbook.org/index.php/2017/07/install-python-3-6-1-in-ubuntu-16-04-lts/


#Install Python
##Bad Version?
vagrant@nomad:/manticore/tests/SdlProxy$ python --version
Python 2.7.12

vagrant@nomad:/manticore/tests/SdlProxy$ python Sdl.py 
Traceback (most recent call last):
  File "Sdl.py", line 3, in <module>
    from session import SdlSession
  File "/manticore/tests/SdlProxy/session/SdlSession.py", line 19
    def handle_packet(self, packet:SdlPacket.SdlPacket):

##Install on Mac
https://docs.python-guide.org/starting/install3/osx/

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"


##Install Ubuntu
http://ubuntuhandbook.org/index.php/2017/07/install-python-3-6-1-in-ubuntu-16-04-lts/

sudo apt-get install python3.6

sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.5 1


python3 --version




#Start Proxy
python3 Sdl.py 

