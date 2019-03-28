#!/bin/sh

# This bucket is in the sweartax project
BUCKET=gs://swear.tax
URL=${BUCKET}

echo Building...
npm run build

echo Uploading Sweartax...
gsutil -h "Cache-control:public,max-age=300" -m cp -a public-read -z js,map dist/swearjar.js ${URL}/swearjar.dev.js
gsutil -h "Cache-control:public,max-age=300" -m cp -a public-read -z js,map dist/swearjar.js.map ${URL}/swearjar.dev.js.map
gsutil -h "Cache-control:public,max-age=300" -m cp -a public-read -z html,css,js dist/index.* ${URL}
