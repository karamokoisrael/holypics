Activate ssh login alert

Activate ssh connection notification

Modify or create `/etc/ssh/sshrc` with the following contents:

```
ip=`echo $SSH_CONNECTION | cut -d " " -f 1`

logger -t ssh-wrapper $USER login from $ip
echo "User $USER just logged in from $ip" | sendemail -q -u "SSH Login" -f "Originator <from@address.com>" -t "Your Name <your.email@domain.com>" -s smtp.server.com &
```




Save git credentials => git config --global credential.helper store

install docker ce => https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

install docker-compose => https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

install portrainer ce => https://docs.portainer.io/v/ce-2.11/start/install/agent/docker/linux

install aapanel => https://forum.aapanel.com/d/9-aapanel-linux-panel-6812-installation-tutorial

Security => https://www.youtube.com/watch?v=ZhMw53Ud2tY

- enable auto update 
    sudo apt install unattended-upgrades
    sudo dpkg-reconfigure --priority=low unattended-upgrades

- create new user for ssh login (avoid root) : use strong password
    Add New root user

    ```
    sudo adduser username
    ```

    ```
    sudo usermod -aG sudo username
    ```

- get read of ssh password
    Save ssh =>

    ```
    ssh-copy-id userid@hostname
    ```

- edit ssh default settings ( if needed )

- check opened ports => sudo ss -tupln

- install firewall


Dg server + Aapanel rules

Use directus to speed up development

Create new user for ssh connections

* Setup panel ssl
* Set SMTP send mail ( from gmail if possible)
* Set notification
* Change aaPanel port
* Activate ssh connection notification
* set cron job to Backup main container database



https://medium.com/@sheetalkumarmaurya/mysql-database-backup-daily-automatically-in-ubuntu-server-using-cron-c4cd5cbfe9a4

```
docker container exec <your_mysql_backup_container_name> ls /backupdocker container exec <your_mysql_backup_container_name> ls /backup
```
