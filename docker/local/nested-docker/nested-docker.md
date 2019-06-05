https://gist.github.com/Francesco149/ce376cd83d42774ed39d34816b9e21db

https://github.com/docker/for-linux/issues/230


Error starting daemon: rename /var/lib/docker/runtimes /var/lib/docker/runtimes-old: invalid cross-device link

rm /var/lib/docker/runtimes -R

rm /var/lib/docker/runtimes -R || true
