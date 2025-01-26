#! /usr/bin/env bash

cd /var/www/ill-brb.example.com
git pull
cd frontend
npm run build
sudo systemctl restart ill-brb-back ill-brb-front
