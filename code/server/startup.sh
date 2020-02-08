systemctl start mongod.service
redis-server
python3 util.py
nohup python3 server.py &
