#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

# defaults to preview of changes
action="${1:-plan}"

# export TF_CLI_ARGS_plan="-no-color"
export TF_CLI_ARGS_apply="--auto-approve"
export TF_CLI_ARGS_destroy="--auto-approve"

CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$CWD" >/dev/null

if [ "$action" == "deploy" ]; then
    terraform init
    cmd="terraform apply"
else
    cmd="terraform $action"
fi
printf "running '%s' " "$cmd"
eval "$cmd" || true

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    rm -rf .terraform
    rm -f ./*.zip .terraform*
    find . -name '*.tfstate*' -print0 | xargs -0 rm
    exit 0
fi

popd >/dev/null
