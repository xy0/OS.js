#!/bin/bash
#
# OS.js CI Deploy Script
#
set -x # Show the output of the following commands (useful for debugging)

#if [ $TRAVIS_BRANCH == 'master' ] ; then
if [ $TRAVIS_BRANCH == 'travis-deploy' ] ; then
  modclean -d -r -n safe
  rsync -av --exclude '.git' --exclude 'deploy-key.enc' . osjs@builds.os.js.org:/home/osjs/CI
else
  echo "Not deploying, since this branch isn't master."
fi
