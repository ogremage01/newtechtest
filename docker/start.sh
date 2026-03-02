#!/bin/sh
set -e
# 백엔드·프론트엔드 동시 기동 후 nginx 포그라운드
java -jar /app/backend/app.jar &
node /app/frontend/server.js &
exec nginx -g "daemon off;"
