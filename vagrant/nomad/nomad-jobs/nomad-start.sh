#!/usr/bin/env bash


echo "nomad-start version 1"
mkdir -p /logs

rm -R /tmp/nomad/ || true

#https://stackoverflow.com/questions/35132687/how-to-access-externally-to-consul-ui
#consul agent -dev > /logs/consul-agent.log 2>&1 &
consul agent -dev -ui -client 0.0.0.0 > /home/vagrant/consul-agent.log 2>&1 &


echo "starting nomad server"

sleep 1
cat /nomad/server.hcl
mkdir -p /tmp/nomad-data
nomad agent -config  /manticore/vagrant/nomad/nomad-jobs/server.hcl > /home/vagrant/nomad-server.log  2>&1 &



echo "test nomad server"





sleep 5

echo "start nomad client 1"
cat /nomad/client.hcl
nomad agent -config /manticore/vagrant/nomad/nomad-jobs/client.hcl > /home/vagrant/nomad-client.log 2>&1 &


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