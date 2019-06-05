  "Job": {
   "Region": "global",
   "ID": "core-hmi-1",
   "Name": "core-hmi-1",
   "Type": "batch",
   "Priority": 50,
   "AllAtOnce": false,
   "Datacenters": [
    "dc1"
   ],
   "Constraints": [],
   "TaskGroups": [
    {
     "Name": "core-group-1",
     "Count": 1,
     "Constraints": [
      {
       "LTarget": "${meta.job}",
       "Operand": "=",
       "RTarget": "1"
      }
     ],
     "Tasks": [
      {
       "Name": "core-task-1",
       "Driver": "docker",
       "User": "",
       "Config": {
        "image": "smartdevicelink/manticore-sdl-core:default-5.0.1",
        "port_map": [
         {
          "broker": 9000,
          "tcp": 12345,
          "file": 3001,
          "log": 8888
         }
        ]
       },
       "Constraints": [],
       "Env": {},
       "Services": [
        {
         "Id": "",
         "Name": "core-broker-1",
         "Tags": [],
         "PortLabel": "broker",
         "Checks": [
          {
           "Type": "tcp",
           "Interval": 3000000000,
           "Timeout": 1000000000,
           "Protocol": "ws"
          }
         ]
        },
        {
         "Id": "",
         "Name": "core-tcp-1",
         "Tags": [],
         "PortLabel": "tcp",
         "Checks": [
          {
           "Type": "tcp",
           "Interval": 3000000000,
           "Timeout": 1000000000,
           "Protocol": "tcp"
          }
         ]
        },
        {
         "Id": "",
         "Name": "core-file-1",
         "Tags": [],
         "PortLabel": "file",
         "Checks": []
        },
        {
         "Id": "",
         "Name": "core-log-1",
         "Tags": [],
         "PortLabel": "log",
         "Checks": [
          {
           "Type": "tcp",
           "Interval": 3000000000,
           "Timeout": 1000000000,
           "Protocol": "ws"
          }
         ]
        }
       ],
       "Resources": {
        "CPU": 100,
        "MemoryMB": 200,
        "DiskMB": 0,
        "IOPS": 0,
        "Networks": [
         {
          "Public": false,
          "CIDR": "",
          "ReservedPorts": [],
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
          "MBits": 2
         }
        ]
       },
       "Meta": null,
       "KillTimeout": 5000000000,
       "LogConfig": {
        "MaxFiles": 2,
        "MaxFileSizeMB": 20
       },
       "Artifacts": null
      }
     ],
     "RestartPolicy": {
      "Interval": 60000000000,
      "Attempts": 0,
      "Delay": 60000000000,
      "Mode": "fail"
     },
     "EphemeralDisk": {
      "Sticky": false,
      "Migrate": false,
      "SizeMB": 500
     },
     "Meta": null
    }
   ],
   "Periodic": null,
   "Meta": null,
   "Status": "",
   "StatusDescription": "",
   "CreateIndex": 0,
   "ModifyIndex": 0,
   "JobModifyIndex": 0
  },
  "EnforceIndex": true,
  "JobModifyIndex": 7
 }