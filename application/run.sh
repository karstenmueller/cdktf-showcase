#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

npm install
npm run compile
rm -rf node_modules
