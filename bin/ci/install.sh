#!/bin/bash
#
# OS.js CI Installation Script
#
set -x # Show the output of the following commands (useful for debugging)

# Decrypt deployment key
openssl aes-256-cbc -K $encrypted_04eba5a2653f_key -iv $encrypted_04eba5a2653f_iv -in deploy-key.enc -out deploy-key -d
rm deploy-key.enc # Don't need it anymore
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa

# System Dependencies
npm install mocha
npm install grunt-cli -g

# Package Dependencies
npm install
