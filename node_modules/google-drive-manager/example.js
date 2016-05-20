#!/usr/bin/env node

/* 
 * Usage: nodejs example.js <client secret path> <target folder title> <parent folder ID> <files to upload>
 * 
 * Example: nodejs example.js client_secret.json 0B_SPtvg96z_ZflJSN0x test1.txt test2.txt test3.txt
 */

var googleDriveManager = require('./lib/GoogleDriveManager');

// params[0] = client secret json path
var clientSecretJsonPath = process.argv[2]; 
console.log('Client Secret JSON: ' + clientSecretJsonPath);
if(clientSecretJsonPath == undefined) {
  throw { code: 'MISSING_CLIENT_SECRET', message: 'Client secret NOT specified!' };
}

// params[1] = target folder title
var targetFolderTitle = process.argv[3] 
console.log('Target folder title: ' + targetFolderTitle);
if(targetFolderTitle == undefined) {
  throw { code: 'MISSING_TARGET_FOLDER_TITLE', message: 'Target folder title NOT specified!' };
}

// params[2] = files to upload
var parentFolderId = process.argv[4] 
console.log('Parent folder ID: ' + parentFolderId);
if(parentFolderId == undefined) {
  throw { code: 'MISSING_PARENT_FOLDER_ID', message: 'Parent folder ID NOT specified!' };
}

// params[3..n] = files to upload
var filesToUpload = process.argv.slice(5) 
console.log('Files to upload: ' + filesToUpload);
if(filesToUpload.length == 0) {
  throw { code: 'MISSING_UPFILES', message: 'Upload files NOT specified!' };
}

// our main routine: authorize api, create subfolder and upload files to it
googleDriveManager.authorize(clientSecretJsonPath).then(function (drive) {
  console.info('Initializing example file uploading to folder: "' +  targetFolderTitle + '"');
  return googleDriveManager.createFolderIfNotExists(targetFolderTitle, parentFolderId).then(function(childFolder) {
    console.info('Uploading files: [', filesToUpload, '] to: ', childFolder.id);
    return googleDriveManager.uploadFiles(filesToUpload, childFolder.id);
  });
}).then(function() {
  console.info('Done!');
}, function(err) {
  console.info('Failed!', err);
});
