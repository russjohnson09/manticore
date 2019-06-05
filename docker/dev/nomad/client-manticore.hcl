# The address the nomad agent will bind to
bind_addr="127.0.0.1" # Replace this with your machine's IP
log_level="DEBUG"

data_dir="/tmp/nomad"

consul {
    # Consul's Client agent Address. The Nomad agent connects to Consul through the running consul client agent
    address = "127.0.0.1:8500" # Keep port 8500, but replace with your machine's IP
}

# Client configuration
client {
    enabled = true
    # A list of Nomad servers to connect to. You only need one running server for this to work
    # Keep port 4647, but replace with the IP of the Nomad server
    servers = ["127.0.0.1:4647"]
    # Manticore checks the meta data of a client agent if it can place manticore/core/hmi there
    # Setting this agent's meta.manticore to true means Nomad can allocate manticore web apps on this machine
    # Setting this agent's meta.job to true means Nomad can allocate sdl_core and HMI instances on this machine
    meta {
        "manticore" = true
        "job" = true
    }
    # Use this option at your own discretion. Setting docker.cleanup.image to false means Nomad won't remove
    # images that tasks have used when they are stopped. This is good for when your images won't change and
    # you don't need to pull changes from the docker repo every time.
    options {
        "docker.cleanup.image" = "false"
    }
}



ports {
    http = 5656
}