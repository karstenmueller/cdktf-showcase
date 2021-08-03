#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

action="${1:-plan}"
stack="hello-world"

test -d node_modules || npm install
test -d .gen || cdktf get

cmd="cdktf $action $stack --auto-approve"
printf "running '%s' " "$cmd"
eval "$cmd"

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    rm -rf .gen cdktf.out node_modules
    rm -f main.d.ts main.js cdktf.log
    find . -name '*.tfstate*' -print0 | xargs -0 rm
    exit 0
fi
