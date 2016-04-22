#!/bin/bash

magenta='\033[35m'
turquoise='\033[36m'
white='\033[00m'

echo -e -n "Enter the configuration filepath ${magenta}(configuration.json)${white} " &&
read -e filepath &&
if [ -z "${filepath}" ]; then filepath=configuration.json; fi &&
if [ ! -f "$filepath" ]; then echo "Filepath does not exist!" && exit; fi
echo -e "${turquoise}${filepath}${white}"

jsonlint $filepath > /tmp/linted.json
node ./lib/validate.js /tmp/linted.json 2>&1  1>/dev/null | grep Error: > /tmp/validated.json

if [ -z "$(cat /tmp/validated.json)" ]; then
  cat /tmp/linted.json
else
  cat /tmp/validated.json
fi

rm /tmp/linted.json
rm /tmp/validated.json
