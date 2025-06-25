#!/bin/bash
# Użycie: ./generate-thumbnail.sh index.html > index.svg

if [ -z "$1" ]; then
  echo "Usage: $0 index.html" >&2
  exit 1
fi

node gen.js "$1"
