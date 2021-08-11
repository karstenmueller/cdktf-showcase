#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

# defaults to preview of changes
action="${1:-"preview"}"
stack="dev"

CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$CWD" >/dev/null

npm install

# encryption is mandatory
# here we are using an empty passphrase
export PULUMI_CONFIG_PASSPHRASE=""

# login is mandatory
# here we are using .pulumi as a local directory
mkdir -p .pulumi
pulumi login file://.
pulumi stack init dev || true

if [ "$action" == "deploy" ]; then
    cmd="pulumi up -s $stack --yes --non-interactive"
elif [ "$action" == "destroy" ]; then
    cmd="pulumi $action -s $stack --yes --non-interactive"
else
    cmd="pulumi $action -s $stack"
fi
printf "running '%s' " "$cmd"
eval "$cmd" || true

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    pulumi stack rm "$stack" --yes --non-interactive
    rm -rf .pulumi
    exit 0
fi

popd >/dev/null
