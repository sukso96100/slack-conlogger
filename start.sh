#!/bin/bash

echo "Starting Conlogger Bot Server"
export SLACK_API_TOKEN='TOKEN'; # Slack Bot API Token
export GOOGLE_CLIENT_SECRET_FILE='path/to/key.json'; # Path to Client Secret file
export GOOGLD_DRIVE_TARGET_FOLDER_ID='folderId'; # Id of Target Google Drive Folder
export UTC_OFFSET='+09:00'; # Timezone
node index.js
