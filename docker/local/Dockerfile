FROM russjohnson09/manticore-local:dev


ADD start-script.sh /start-script.sh
RUN chmod +x /start-script.sh

#container can have one entry point. this should not exit and can run multiple required background processes.
ENTRYPOINT /start-script.sh
