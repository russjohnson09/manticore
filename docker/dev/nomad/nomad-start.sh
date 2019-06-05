#!/usr/bin/env bash



rm -R /tmp/nomad/ || true

consul agent -dev &


echo "starting nomad server"

sleep 1
cat /nomad/server.hcl
nomad agent -config /nomad/server.hcl &



echo "test nomad server"





sleep 5

echo "start nomad client 1"
cat /nomad/client.hcl
nomad agent -config /nomad/client.hcl &


echo "check clients are running"
sleep 1
nomad node status

sleep 1
echo "started client successfully"



sleep 1
echo "."
sleep 1
echo "."
sleep 1
echo "."
sleep 1
echo "."
sleep 1
echo "."
sleep 1
echo "."
sleep 1
echo "."
sleep 1
echo "."
nomad init || true
nomad status
nomad server members
nomad node status
nomad plan example.nomad