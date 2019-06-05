#!/usr/bin/env bash





echo "version 1.1"
rm /var/lib/docker/runtimes -R || true
rm /var/run/docker.pid || true
sleep 1
echo "start docker"
echo "dockerd &"
dockerd &

sleep 5


echo "start redis"
redis-server &

sleep 1
redis-cli PING

/nomad/nomad-start.sh




cd /manticore
npm install
npm run build-webpage

cd /




cd /manticore
#nohup npm start >/consul.log 2>&1 &
#nohup nodemon >/consul.log 2>&1 &


echo "nodemon &"
nodemon &





echo "started successfully"

/bin/bash


#root@25d5103a595a:/# ps -a
#  PID TTY          TIME CMD
#    7 pts/0    00:00:00 bash
#   10 pts/0    00:00:34 consul
#   26 pts/0    00:00:00 bash
#   39 pts/1    00:00:00 ps
