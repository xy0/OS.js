#!/bin/bash
#
# OS.js CI Deploy Script
#
set -x # Show the output of the following commands (useful for debugging)

#if [ $TRAVIS_BRANCH == 'master' ] ; then
if [ $TRAVIS_BRANCH == 'travis-deploy' ] ; then
    mkdir _deploy
    cd _deploy
    git init
    git remote add deploy "osjs@builds.os.js.org:/home/osjs/CI"
    git config user.name "Travis CI"
    git config user.email "anders.evenrud+travisCI@gmail.com"
    git add .
    git commit -m "Automatic Travis CI Deploy"
    git push --force deploy master
else
    echo "Not deploying, since this branch isn't master."
fi
