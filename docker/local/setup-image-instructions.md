#Create Container From Image
Kitematic
node:8


##OS is on Debian 9 
cat /etc/os-release

PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"


#Add Additional Packages
apt update
apt-get install nano unzip gcc g++ make wget systemd



#Consul Agent
https://learn.hashicorp.com/consul/datacenter-deploy/deployment-guide

wget https://releases.hashicorp.com/consul/1.5.1/consul_1.5.1_linux_amd64.zip
unzip consul_1.5.1_linux_amd64.zip -d consul
mv /consul/consul /bin/consul


##On Startup
consul agent -dev

nohup consul agent -dev & > /consul.log 2>&1
nohup consul agent -dev &

nohup consul agent -dev >/consul.log 2>&1 &

https://github.com/geerlingguy/docker-fedora27-ansible/issues/2
apt-get install dbus-user-session

##Auto Start
https://forums.docker.com/t/any-simple-and-safe-way-to-start-services-on-centos7-systemd/5695/8
https://learn.hashicorp.com/consul/datacenter-deploy/deployment-guide

root@f843156232b6:/# service --status-all
 [ - ]  cgmanager
 [ - ]  cgproxy
 [ - ]  dbus
 [ ? ]  hwclock.sh
 [ - ]  procps
 [ - ]  x11-common



nano /etc/systemd/system/consul.service

service dbus start
systemctl enable consul
systemctl start consul
systemctl status consul

###Files
mkdir -p /etc/consule.d
sudo mkdir --parents /etc/consul.d
sudo touch /etc/consul.d/consul.hcl
sudo chown --recursive consul:consul /etc/consul.d
sudo chmod 640 /etc/consul.d/consul.hcl



##Debug
https://askubuntu.com/questions/813588/systemctl-failed-to-connect-to-bus-docker-ubuntu16-04-container
root@f843156232b6:/# systemctl start consul
Failed to connect to bus: No such file or directory



#Nomand
wget https://releases.hashicorp.com/nomad/0.9.1/nomad_0.9.1_linux_amd64.zip
unzip nomad_0.9.1_linux_amd64.zip -d nomad

mv /nomad/nomad /bin/nomad


##On Startup
nomad agent -dev




#NPM Install
cd /manticore

npm install