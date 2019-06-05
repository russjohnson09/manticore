{
  "Affinities": null,
  "AllAtOnce": false,
  "Constraints": null,
  "CreateIndex": 61,
  "Datacenters": [
    "dc1"
  ],
  "Dispatched": false,
  "ID": "core-hmi-1-test",
  "JobModifyIndex": 71,
  "Meta": null,
  "ModifyIndex": 73,
  "Name": "core-hmi-1-test",
  "Namespace": "default",
  "ParameterizedJob": null,
  "ParentID": "",
  "Payload": null,
  "Periodic": null,
  "Priority": 50,
  "Region": "global",
  "Spreads": null,
  "Stable": false,
  "Status": "dead",
  "StatusDescription": "",
  "Stop": true,
  "SubmitTime": 1559757842438646800,
  "TaskGroups": [
    {
      "Affinities": null,
      "Constraints": null,
      "Count": 1,
      "EphemeralDisk": {
        "Migrate": false,
        "SizeMB": 500,
        "Sticky": false
      },
      "Meta": null,
      "Migrate": null,
      "Name": "core-group-1",
      "ReschedulePolicy": {
        "Attempts": 1,
        "Delay": 5000000000,
        "DelayFunction": "constant",
        "Interval": 86400000000000,
        "MaxDelay": 0,
        "Unlimited": false
      },
      "RestartPolicy": {
        "Attempts": 0,
        "Delay": 60000000000,
        "Interval": 60000000000,
        "Mode": "fail"
      },
      "Spreads": null,
      "Tasks": [
        {
          "Affinities": null,
          "Artifacts": null,
          "Config": {
            "image": "smartdevicelink/manticore-sdl-core:default-5.0.1",
            "port_map": [
              {
                "file": 3001,
                "log": 8888,
                "broker": 9000,
                "tcp": 12345
              }
            ]
          },
          "Constraints": null,
          "DispatchPayload": null,
          "Driver": "docker",
          "Env": null,
          "KillSignal": "",
          "KillTimeout": 5000000000,
          "Leader": false,
          "LogConfig": {
            "MaxFileSizeMB": 20,
            "MaxFiles": 2
          },
          "Meta": null,
          "Name": "core-task-1",
          "Resources": {
            "CPU": 100,
            "Devices": null,
            "DiskMB": 0,
            "IOPS": 0,
            "MemoryMB": 200,
            "Networks": [
              {
                "CIDR": "",
                "Device": "",
                "DynamicPorts": [
                  {
                    "Label": "broker",
                    "Value": 0
                  },
                  {
                    "Label": "tcp",
                    "Value": 0
                  },
                  {
                    "Label": "file",
                    "Value": 0
                  },
                  {
                    "Label": "log",
                    "Value": 0
                  }
                ],
                "IP": "",
                "MBits": 2,
                "ReservedPorts": null
              }
            ]
          },
          "Services": [
            {
              "AddressMode": "auto",
              "CanaryTags": null,
              "Checks": [
                {
                  "AddressMode": "",
                  "Args": null,
                  "CheckRestart": null,
                  "Command": "",
                  "GRPCService": "",
                  "GRPCUseTLS": false,
                  "Header": null,
                  "InitialStatus": "",
                  "Interval": 3000000000,
                  "Method": "",
                  "Name": "service: \"core-broker-1\" check",
                  "Path": "",
                  "PortLabel": "",
                  "Protocol": "ws",
                  "TLSSkipVerify": false,
                  "Timeout": 1000000000,
                  "Type": "tcp"
                }
              ],
              "Name": "core-broker-1",
              "PortLabel": "broker",
              "Tags": null
            },
            {
              "AddressMode": "auto",
              "CanaryTags": null,
              "Checks": [
                {
                  "AddressMode": "",
                  "Args": null,
                  "CheckRestart": null,
                  "Command": "",
                  "GRPCService": "",
                  "GRPCUseTLS": false,
                  "Header": null,
                  "InitialStatus": "",
                  "Interval": 3000000000,
                  "Method": "",
                  "Name": "service: \"core-tcp-1\" check",
                  "Path": "",
                  "PortLabel": "",
                  "Protocol": "tcp",
                  "TLSSkipVerify": false,
                  "Timeout": 1000000000,
                  "Type": "tcp"
                }
              ],
              "Name": "core-tcp-1",
              "PortLabel": "tcp",
              "Tags": null
            },
            {
              "AddressMode": "auto",
              "CanaryTags": null,
              "Checks": null,
              "Name": "core-file-1",
              "PortLabel": "file",
              "Tags": null
            },
            {
              "AddressMode": "auto",
              "CanaryTags": null,
              "Checks": [
                {
                  "AddressMode": "",
                  "Args": null,
                  "CheckRestart": null,
                  "Command": "",
                  "GRPCService": "",
                  "GRPCUseTLS": false,
                  "Header": null,
                  "InitialStatus": "",
                  "Interval": 3000000000,
                  "Method": "",
                  "Name": "service: \"core-log-1\" check",
                  "Path": "",
                  "PortLabel": "",
                  "Protocol": "ws",
                  "TLSSkipVerify": false,
                  "Timeout": 1000000000,
                  "Type": "tcp"
                }
              ],
              "Name": "core-log-1",
              "PortLabel": "log",
              "Tags": null
            }
          ],
          "ShutdownDelay": 0,
          "Templates": null,
          "User": "",
          "Vault": null
        }
      ],
      "Update": null
    }
  ],
  "Type": "batch",
  "Update": {
    "AutoRevert": false,
    "Canary": 0,
    "HealthCheck": "",
    "HealthyDeadline": 0,
    "MaxParallel": 0,
    "MinHealthyTime": 0,
    "ProgressDeadline": 0,
    "Stagger": 0
  },
  "VaultToken": "",
  "Version": 2
}