




root@1426f35c97d2:/# nomad job validate example.nomad
Job validation successful
root@1426f35c97d2:/# nomad job run example.nomad
==> Monitoring evaluation "4360e702"
    Evaluation triggered by job "example"
    Evaluation within deployment: "f16e8811"
    Evaluation status changed: "pending" -> "complete"
==> Evaluation "4360e702" finished with status "complete" but failed to place all allocations:
    Task Group "cache" (failed to place 1 allocation):
      * No nodes were eligible for evaluation
      * No nodes are available in datacenter "dc1"
    Evaluation "da55778b" waiting for additional capacity to place remainder
root@1426f35c97d2:/# nomad status
ID          Type     Priority  Status   Submit Date
core-hmi-1  batch    50        pending  2019-06-05T15:36:46Z
example     service  50        pending  2019-06-05T16:14:34Z


https://blog.mywebofthings.com/blog/launching-your-first-job-with-hasicorps-nomad/