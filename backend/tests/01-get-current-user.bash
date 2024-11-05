#! /usr/bin/env bash

host="localhost"
port=5001
path="/api/session"
xsrf_token="JFcEV0s0-vJbdTqm3DsJ4subfQGiYOhL6Ubk"
csrf_cookie="DdBYo17zl_lVKnjjQeSplmfr"

wget \
    --output-document=- \
    --quiet \
    --server \
    --no-verbose \
    --content-on-error \
    "${host}:${port}$path" \
    --header="XSRF-TOKEN: ${xsrf_token}" \
    --header="Cookie: _csrf=${csrf_cookie};" \
    | jq "."
