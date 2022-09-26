#!/bin/bash

env="$1"

# incase we want to have multiple stages in the future
# if [ $env != "prod" ]; then
#   echo "Unknown env $env, valid envs are prd or test"
#   exit 1
# fi

# this is where we compress any JS and CSS files
rm -rf stage
mkdir stage

cp -r ./build/* ./stage

bucket="s3://app.commonvalue.xyz"
echo $bucket;

aws s3 sync ./stage "$bucket" --profile commonvalue

rm -rf ./stage
