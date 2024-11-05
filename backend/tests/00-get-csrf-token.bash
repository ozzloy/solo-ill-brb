#! /usr/bin/env bash

wget \
    --output-document=- \
    --quiet \
    --server \
    --no-verbose \
    --content-on-error \
    --save-headers \
    localhost:5001/api/csrf/restore
echo
