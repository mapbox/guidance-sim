#!/bin/bash

magenta='\033[35m'
turquoise='\033[36m'
white='\033[00m'

filepath=/tmp/configuration.json
if [ -a $filepath ]; then rm $filepath; fi

# Get desired file name for configuration file and assign to ${filename}
# Default is `configuration.json`
echo -e -n "Enter desired filename for configuration ${magenta}(configuration.json)${white} " &&
read -e filename &&
if [ -z "${filename}" ]; then filename=configuration.json; fi &&
echo -e "${turquoise}${filename}${white}"

# Get style ID for map object and assign to ${style}
# Default is `mapbox://styles/mapbox/streets-v8`
echo -e -n "Enter the styleID ${magenta}(mapbox://styles/mapbox/streets-v8)${white} " &&
read -e style &&
if [ -z "${style}" ]; then style=mapbox://styles/mapbox/streets-v8; fi &&
echo -e "${turquoise}${style}${white}"

# Get filepath for directions API JSON response and assign to ${temp_route}
# Default is `route.json`
echo -e -n "Enter the filepath to your saved directions API response relative to current directory ${magenta}(route.json)${white} " &&
read -e temp_route &&
if [ -z "${temp_route}" ]; then temp_route=route.json; fi &&
if [ ! -f "$temp_route" ]; then echo "Filepath does not exist!" && exit; fi
echo -e "${turquoise}${temp_route}${white}"
# Grab the contents from the route file and assign to ${route}
route=$(cat $temp_route)
# Grab the API version based on the route format
version=$(node lib/version.js ${temp_route})

# Get default zoom and assign to ${zoom}
# Default is 17
echo -e -n "Enter the default zoom ${magenta}(17)${white} " &&
read -e zoom &&
if [ -z "${zoom}" ]; then zoom=17; fi &&
echo -e "${turquoise}${zoom}${white}"

# Get default pitch and assign to ${pitch}
# Default is 45
echo -e -n "Enter the default pitch ${magenta}(45)${white} " &&
read -e pitch &&
if [ -z "${pitch}" ]; then pitch=45; fi &&
echo -e "${turquoise}${pitch}${white}"

# Get playback start time adn assign to ${time}
# Default is 00h00m00s
echo -e -n "Enter the start time ${magenta}(00h00m00s)${white} " &&
read -e time &&
if [ -z "${time}" ]; then time=00h00m00s; fi &&
echo -e "${turquoise}${time}${white}"

# Get playback speed and assign to ${speed}
# Default is 1x (realtime)
echo -e -n "Enter the default speed ${magenta}(1x)${white} " &&
read -e speed &&
if [ -z "${speed}" ]; then speed=1x; fi &&
echo -e "${turquoise}${speed}${white}"

# Write JSON to temporary holding file
echo ""
printf "{" >> $filepath
printf "\"style\":\"$style\"," >> $filepath
printf "\"route\":$route," >> $filepath
printf "\"zoom\":$zoom," >> $filepath
printf "\"pitch\":$pitch," >> $filepath
printf "\"time\":\"$time\"," >> $filepath
printf "\"speed\":\"$speed\"," >> $filepath
if [ "$version" = v5 ]; then printf "\"maneuvers\":[{\"type\":[],\"modifier\":[],\"buffer\":0.10,\"zoom\":$zoom,\"pitch\":$pitch}]" >> $filepath; fi
if [ "$version" = v4 ]; then printf "\"maneuvers\":[{\"type\":[],\"buffer\":0.10,\"zoom\":$zoom,\"pitch\":$pitch}]" >> $filepath; fi
printf "}" >> $filepath

# Clean out existing outputs
if [ -a /tmp/stdout.json ]; then rm /tmp/stdout.json; fi
if [ -a /tmp/errors.json ]; then rm /tmp/errors.json; fi

# Run validator
# Assign standard output to /tmp/stdout.json
# Grep for errors and assign to /tmp/errors.json
node ./lib/validate.js $filepath 2>&1  1>/tmp/stdout.json | grep Error: > /tmp/errors.json

# If there are errors, show them
if [ -s /tmp/errors.json ];
then
  echo $(cat /tmp/errors.json)
# Otherwise, JSONlint the file, write to specified file, and print results in console
else
  cat $filepath | jsonlint > $filename
  echo $(cat $filename)
fi

echo ""
