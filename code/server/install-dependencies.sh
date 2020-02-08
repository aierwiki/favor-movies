cp mongodb-org-3.4.repo /etc/yum.repos.d/
yum makecache
yum -y install mongodb-org

yum install redis
