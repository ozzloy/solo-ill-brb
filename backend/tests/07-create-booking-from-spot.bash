#! /usr/bin/env bash

startDate="2025-11-19"
endDate="2025-11-20"

# POST /api/spots/:spotId/bookings
# request body
# {
#   "startDate": "2021-11-19",
#   "endDate": "2021-11-20"
# }

host="localhost"
port=5001
credential="Demo-lition"
password="password"
path="/api/spots/2/bookings"

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
    --header="XSRF-TOKEN: ${xsrf_token}" \
    --header="Cookie: _csrf=${csrf_cookie}; token=${jwt};" \
    "${host}:${port}${path}" \
    --post-data="{\"startDate\":\"$startDate\",\"endDate\":\"$endDate\"}" \
    --header="Content-Type: application/json" \
    | jq "."
