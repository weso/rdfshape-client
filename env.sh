#!/bin/bash

# This is only meant to be run on docker container environments,
# so that variables in the .env file can be redefined with the --env flag on
# container creation instead of with a new image build.

# This script will take the environment variables in the .env file and
# create a JS file with their values that is injected before React loads.
# The app will first try to read env values from this generated file, else fallback to .env file.

# Recreate config file
rm -rf ./env-config.js &>/dev/null
touch ./env-config.js

# Add assignment
echo "window._env_ = {" >>./env-config.js

# Read each line in .env file [key=value pairs]
while read -r line || [[ -n "$line" ]]; do
  # Split env variables when character '=' is found
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//' | sed -e 's/REACT_APP_//') # Strip REACT_APP_ prefix
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}

  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >>./env-config.js
done <.env

echo "}" >>./env-config.js
