#! /usr/bin/env bash

# to be run by deploy user from root of project

git pull
cd backend
npm install
cd ../frontend
npm install
npm run build
sudo systemctl restart ill-brb-back ill-brb-front
