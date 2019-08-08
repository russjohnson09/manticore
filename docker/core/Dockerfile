FROM russjohnson09/manticore-local:dev

ADD install.sh /install.sh
RUN chmod +x /install.sh
RUN /install.sh





RUN mkdir -p /nomad
#https://github.com/smartdevicelink/manticore/wiki/Set-up-the-clusters
ADD ./nomad/server.hcl /nomad/server.hcl
ADD ./nomad/client.hcl /nomad/client.hcl
ADD ./nomad/server.hcl /nomad/server.hcl
ADD ./nomad/nomad-start.sh /nomad/nomad-start.sh

RUN chmod +x /nomad/nomad-start.sh


#https://github.com/hashicorp/nomad/issues/696

#nomad requirements?
#add-apt-repository \
 #   "deb [arch=amd64] https://download.docker.com/linux/debian \
 #   $(lsb_release -cs) \
 #   stable"
#apt-get install docker-ce docker-ce-cli containerd.io


ADD start-script.sh /start-script.sh
RUN chmod +x /start-script.sh
#container can have one entry point. this should not exit and can run multiple required background processes.
ENTRYPOINT /start-script.sh
