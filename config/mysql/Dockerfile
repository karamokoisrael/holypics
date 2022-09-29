FROM mysql:latest
# MAINTAINER csgeek@mail.com
# ENV MYSQL_ROOT_PASSWORD jsppassword
# ADD jsp_backup.sql /docker-entrypoint-initdb.d
CMD mysqld --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
EXPOSE 3306
