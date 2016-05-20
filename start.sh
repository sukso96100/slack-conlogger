#!/bin/bash

echo "Starting Conlogger Bot Server"
export SLACK_API_TOKEN='xoxb-44195058997-2FCNpaLL8kLi1eRpSzKd7vom';
export GOOGLE_CLIENT_SECRET_FILE='google_key.json';
export GOOGLD_DRIVE_TARGET_FOLDER_ID='0B5llRDmwiwWlLTNod01MdU5VSHc';
export UTC_OFFSET='+09:00';
node index.js
