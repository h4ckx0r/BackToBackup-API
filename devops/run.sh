#!/bin/bash
echo "The script you are running has basename `basename "$0"`, dirname `dirname "$0"`"
echo "The present working directory is `pwd`"

PROJECT_NAME=${PWD##*/}
echo "Project name is $PROJECT_NAME"

cd $(dirname "$0")

docker compose -f docker-compose.dev.yml -p $PROJECT_NAME up -d
# docker exec -it $PROJECT_NAME sh -c '/bin/sh --init-file <(echo "cd ~/app && /usr/local/bin/docker-entrypoint.sh npm run start:dev")'
docker exec -it $PROJECT_NAME sh -c 'cd ~/app && /usr/local/bin/docker-entrypoint.sh npm run start:dev'
docker compose -p $PROJECT_NAME stop

