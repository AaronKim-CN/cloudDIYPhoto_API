#!/bin/bash
cd /home/ec2-user/nodetest/api
sudo pm2 delete "cloudDIY_Photo_API"
sudo pm2 start npm --name "cloudDIY_Photo_API" -- start
sudo pm2 startup
sudo pm2 save