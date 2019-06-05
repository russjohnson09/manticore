FROM russjohnson09/manticore-local:dev
RUN npm install -g nodemon


ADD start-script.sh /start-script.sh
RUN chmod +x /start-script.sh


RUN mkdir -p /nomad
#https://github.com/smartdevicelink/manticore/wiki/Set-up-the-clusters
ADD ./nomad/server.hcl /nomad/server.hcl
ADD ./nomad/client.hcl /nomad/client.hcl

RUN chmod +x /start-script.sh


#container can have one entry point. this should not exit and can run multiple required background processes.
ENTRYPOINT /start-script.sh
