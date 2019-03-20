#!/bin/sh

# This bucket is in the sweartax project
BUCKET=gs://swear.tax
URL=${BUCKET}

echo Uploading website...
gsutil -h "Cache-control:public,max-age=300" -m cp -a public-read -z html,css,js www/* ${URL}
