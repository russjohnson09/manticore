#!/usr/bin/env bash


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


sleep 1

echo "start nomad client 1"
cat /nomad/client.hcl
nomad agent -config /nomad/client.hcl &


echo "check clients are running"
sleep 1
nomad node status

sleep 1
echo "started client successfully"

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
