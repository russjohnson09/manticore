#!/usr/bin/env bash



mkdir -p /logs


echo "version 1.2"
#rm /var/run/docker.pid || true

#manticore_dev | Error starting daemon: rename /var/lib/docker/runtimes /var/lib/docker/runtimes-old: invalid cross-device link
#rm /var/lib/docker/runtimes -R || true
#rm /var/lib/docker/runtimes/* -R || true


#systemctl restart containerd
#systemctl restart dockerd

#sleep 1
#echo "start docker"
#echo "dockerd &"
#dockerd > /logs/dockerd.log 2>&1 &
#dockerd > /logs/dockerd.log 2>&1 &

#dockerd
#dockerd

#echo "check docker process"
#sleep 5
#jobs
#cat /logs/dockerd.log
#sleep 5
#ps -A
#ps

#sleep 10


echo "start redis"
redis-server > /logs/redis-server.log 2>&1 &

sleep 1
redis-cli PING

echo "run nomad start"
/nomad/nomad-start.sh




cd /manticore
npm install
npm run build-webpage

cd /




cd /manticore
#nohup npm start >/consul.log 2>&1 &
#nohup nodemon >/consul.log 2>&1 &


echo "nodemon > /logs/nodemon.log 2>&1 &"
sleep 1
#nodemon > /logs/nodemon.log 2>&1 &

nodemon




echo "started successfully"

/bin/bash


#root@25d5103a595a:/# ps -a
#  PID TTY          TIME CMD
#    7 pts/0    00:00:00 bash
#   10 pts/0    00:00:34 consul
#   26 pts/0    00:00:00 bash
#   39 pts/1    00:00:00 ps
