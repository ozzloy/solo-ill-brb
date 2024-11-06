#! /usr/bin/env bash

startDate="2026-01-01"
endDate="2026-01-02"

# POST /api/spots/:spotId/bookings
# example request body
# {
#   "startDate": "2021-11-19",
#   "endDate": "2021-11-20"
# }

host="localhost"
port=5001
credential="Demo-lition"
password="password"
spot_id=0
path="/api/spots/$spot_id/bookings"

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
temp_file=$(mktemp)
response=$(wget \
    --output-document=- \
    --quiet \
    --server \
    --no-verbose \
    --content-on-error \
    --header="XSRF-TOKEN: ${xsrf_token}" \
    --header="Cookie: _csrf=${csrf_cookie}; token=${jwt};" \
    --save-headers \
    "${host}:${port}${path}" \
    --post-data="{\"startDate\":\"$startDate\",\"endDate\":\"$endDate\"}" \
    --header="Content-Type: application/json" \
    2> "${temp_file}")

status_code=$(cat "${temp_file}" \
    | grep -o "HTTP/[0-9.]\+ [0-9]\+" \
    | cut -d' ' -f2)
rm "${temp_file}"

headers=$(echo "$response" \
    | sed -n '1,/^\r\?$/p')
body=$(echo "$response" \
    | sed -n '/^{/,$p')

if [ "$status_code" != "404" ]; then
    echo "status code is $status_code, expected 404"
    exit 1
fi

content_type=$(echo "$headers" \
            | grep -i "Content-Type:" \
            | sed 's/.*: \(.*\)/\1/')
if [[ ! "$content_type" =~ ^application/json ]]; then
    echo "Content-Type is '$content_type', expected 'application/json'"
    exit 1
fi

expected_body='{"message":"Spot couldn'"'"'t be found"}'
if [ "$(echo "$body" | jq -c '.')" != "$expected_body" ]; then
    echo "body is '$(echo "$body" | jq -c '.')', expected '$expected_body'"
    exit 1
fi
