#!/bin/bash
cd /home/ec2-user/nodetest/api/
npm install
npm install pm2 -g
cd /home/ec2-user/nodetest/client/
npm install
npm install pm2 -g