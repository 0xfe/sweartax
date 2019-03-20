#!/bin/sh

# This bucket is in the sweartax project
BUCKET=gs://swear.tax
URL=${BUCKET}

echo Building...
npm run build

echo Uploading Sweartax...
gsutil -h "Cache-control:public,max-age=300" -m cp -a public-read -z js,map dist/pennyjarjs.js dist/pennyjarjs.js.map ${URL}
gsutil -h "Cache-control:public,max-age=300" -m cp -a public-read -z html,css,js dist/index.* ${URL}
