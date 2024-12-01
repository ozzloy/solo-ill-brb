#! /usr/bin/env bash

host="localhost"
port=5001
credential="Demo-lition"
password="password"
spot_id=5
path="/api/spots/${spot_id}"

# Get CSRF tokens
csrf_response=$(wget \
               --output-document=- \
               --quiet \
               --server \
               --no-verbose \
               --content-on-error \
               --save-headers \
               "${host}:${port}/api/csrf/restore" \
               2>/dev/null)

xsrf_token=$(echo "$csrf_response" \
                 | sed -n '/^{/,$p' \
                 | jq -r '."XSRF-Token"')
csrf_cookie=$(echo "$csrf_response" \
                  | grep -i "Set-Cookie: _csrf=" \
                  | sed 's/.*_csrf=\([^;]*\).*/\1/')

login_response=$(wget \
    --output-document=- \
    --quiet \
    --server \
    --no-verbose \
    --content-on-error \
    --save-headers \
    "${host}:${port}/api/session" \
    --header="XSRF-TOKEN: ${xsrf_token}" \
    --header="Cookie: _csrf=${csrf_cookie};" \
    --post-data="{\"credential\":\"${credential}\",\"password\":\"${password}\"}" \
    --header="Content-Type: application/json" \
    2> /dev/null)

# Extract JWT token from login response
jwt=$(echo "$login_response" \
          | grep -i "Set-Cookie: token=" \
          | sed 's/.*token=\([^;]*\).*/\1/')

# Get current user bookings
wget \
    --output-document=- \
    --quiet \
    --server \
    --no-verbose \
    --content-on-error \
    "${host}:${port}${path}" \
    --header="XSRF-TOKEN: ${xsrf_token}" \
    --header="Cookie: token=${jwt};" \
    | jq "."
