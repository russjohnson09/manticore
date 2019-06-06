#https://github.com/smartdevicelink/manticore/wiki/Set-up-the-clusters

# Increase log verbosity
log_level = "DEBUG"

# rm -R /tmp/nomad/
# Setup data directory
data_dir = "/tmp/nomad-data"

# To talk to this Nomad agent, use this IP. Put the IP address of your machine here
#bind_addr = <ip of machine>

# Server configuration
server {
    enabled = true

    # Should be 3 or 5 for production. We only expect one server to bootstrap
    bootstrap_expect = 1
}