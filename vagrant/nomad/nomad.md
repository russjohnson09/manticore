





https://www.nomadproject.io/intro/getting-started/install.html




sudo ./vagrant/nomad/nomad-jobs/nomad-start.sh

nodemon



#Local DNS Config
nano /usr/local/etc/dnsmasq.conf

sudo launchctl stop homebrew.mxcl.dnsmasq
sudo launchctl start homebrew.mxcl.dnsmasq


sudo launchctl list homebrew.mxcl.dnsmasq
check for PID

sudo launchctl error homebrew.mxcl.dnsmasq

dig dev.localhost @127.0.0.1
dig test.localhost @127.0.0.1
dig mg1515k49avnj32y.manticore.localhost @127.0.0.1
