#!/usr/bin/env bash


sleep 1
echo "start docker"
echo "dockerd &"
dockerd &


echo "start redis"
redis-server &

sleep 1
redis-cli PING



cd /manticore
npm install
npm run build-webpage

cd /

whoami

touch /test.txt



nohup consul agent -dev >/consul.log 2>&1 &


sleep 1

cat /consul.log



echo "starting nomad"

sleep 1
cat /nomad/server.hcl
nomad agent -config /nomad/server.hcl &


sleep 5

echo "start nomad client 1"
cat /nomad/client.hcl
nomad agent -config /nomad/client.hcl &


echo "check clients are running"
sleep 1
nomad node status

sleep 1
echo "started client successfully"





sleep 10
echo "test nomad server"

nomad status
nomad server members
nomad node status
nomad plan example.nomad

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
