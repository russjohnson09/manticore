# Copyright (c) 2018, Livio, Inc.
# A sample settings file for generating haproxy.cfg files
# sudo consul-template -config template-settings.hcl &

consul {
    #address= "127.0.0.1:8500"
}

template {
    source = "haproxy.tmpl"
    destination = "/etc/haproxy/haproxy.cfg"
    command = "/bin/bash -c 'sudo sed -i 's/127.0.0.1:/10.0.2.15:/g' /etc/haproxy/haproxy.cfg || sudo service haproxy reload || true'"
    wait = "2s:4s"
}
