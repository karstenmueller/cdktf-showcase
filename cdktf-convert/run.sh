#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

action="${1:-plan}"
stack="hello-world"

CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$CWD" >/dev/null

# shellcheck disable=2002
cat ../terraform/main.tf | cdktf convert >main.ts

npm install
cdktf get

cmd="cdktf $action $stack --auto-approve"
printf "running '%s' " "$cmd"
eval "$cmd" || true

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    rm -rf .gen cdktf.out node_modules
    rm -f main.ts main.d.ts main.js cdktf.log
    find . -name '*.tfstate*' -print0 | xargs -0 rm
    exit 0
fi

popd >/dev/null
