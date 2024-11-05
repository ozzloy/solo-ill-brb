#! /usr/bin/env bash

host="localhost"
port=5001
path="/api/session"
credential="Demo-lition"
password="password"
response=$(wget \
               --output-document=- \
               --quiet \
               --server \
               --no-verbose \
               --content-on-error \
               --save-headers \
               "${host}:${port}/api/csrf/restore" 2> /dev/null)
xsrf_token=$(echo "$response" \
                 | sed -n '/^{/,$p' \
                 | jq -r '."XSRF-Token"')
csrf_cookie=$(echo "$response" \
                  | grep -i "Set-Cookie: _csrf=" \
                  | sed 's/.*_csrf=\([^;]*\).*/\1/')

wget \
    --output-document=- \
    --quiet \
    --server \
    --no-verbose \
    --content-on-error \
    "${host}:${port}$path" \
    --header="XSRF-TOKEN: ${xsrf_token}" \
    --header="Cookie: _csrf=${csrf_cookie};" \
    --post-data="{\"credential\":\"${credential}\",\"password\":\"${password}\"}" \
    --header="Content-Type: application/json" \
    | jq "."
