#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

case "$1" in
deploy)
    cdktf/run.sh deploy
    cdktf-convert/run.sh deploy
    terraform/run.sh apply
    pulumi/run.sh up
    ;;
destroy)
    for dir in cdktf cdktf-convert terraform pulumi; do $dir/run.sh destroy; done
    ;;
*)
    echo "unknown action $1"
    exit 1
    ;;
esac
