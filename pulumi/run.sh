#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

action="${1:-"up --diff"}"
stack="dev"

CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$CWD" >/dev/null

npm install

export PULUMI_CONFIG_PASSPHRASE=""

cmd="pulumi $action -s $stack -y"
printf "running '%s' " "$cmd"
eval "$cmd" || true

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    pulumi stack rm "$stack" -y
    exit 0
fi

popd >/dev/null
