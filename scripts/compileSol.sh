#!/bin/bash
set -e
cd "$(dirname "$0")" 

if [[ -z "${SOLC}" ]]; then
    solcBinary="solc"
else
    solcBinary="${SOLC}"
fi

$solcBinary -o ../abi ../sol/*.sol --allow-paths $openZepplinPath --overwrite --optimize --bin --abi --bin-runtime --overwrite
