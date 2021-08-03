#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

action="${1:-plan}"

export TF_CLI_ARGS_plan="-no-color"
export TF_CLI_ARGS_apply="--auto-approve"
export TF_CLI_ARGS_destroy="--auto-approve"

terraform init

cmd="terraform $action"
printf "running '%s' " "$cmd"
eval "$cmd"

if [ "$action" == "destroy" ]; then
    echo "Cleanup ..."
    rm -rf .terraform
    rm -f ./*.zip .terraform*
    find . -name '*.tfstate*' -print0 | xargs -0 rm
    exit 0
fi
