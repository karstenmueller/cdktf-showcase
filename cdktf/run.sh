#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# defaults to preview of changes
action="${1:-plan}"
stack="hello-world"

pushd "$CWD" >/dev/null
npm install
# test -d .gen || cdktf get

cmd="cdktf $action $stack --auto-approve"
printf "running '%s' " "$cmd"
eval "$cmd"

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    rm -rf .gen cdktf.out
    rm -f main.d.ts main.js cdktf.log
    find . -name '*.tfstate*' -print0 | xargs -0 rm
    exit 0
fi

popd >/dev/null
