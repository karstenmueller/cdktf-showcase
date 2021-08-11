#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

case "$1" in
deploy)
    for dir in cdktf cdktf-convert terraform pulumi; do $dir/run.sh deploy; done
    ;;
destroy)
    for dir in cdktf cdktf-convert terraform pulumi; do $dir/run.sh destroy; done
    ;;
*)
    echo "unknown action $1"
    exit 1
    ;;
esac
