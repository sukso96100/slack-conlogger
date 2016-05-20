/*
Copyright (C) 2016 Youngbin Han <sukso96100@gmail.com>
Licensed under the MIT License
This file is a part of slack-conlogger
https://github.com/sukso96100/slack-conlogger
*/

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var o2c;
var targetFolderId = process.env.GOOGLD_DRIVE_TARGET_FOLDER_ID;

// var rtm;
// var msg;
var filename;
var nocode;
var channel;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = 'auth/';
var TOKEN_PATH =  'auth/auth.json';

var uploadFile = function(rtm, msg, filename0){
  nocode = false;
  channel = msg.channel;
  // rtm = rtm0;
  // msg = msg0;
  filename = filename0;
  // Load client secrets from a local file.
  fs.readFile(process.env.GOOGLE_CLIENT_SECRET_FILE,
   function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), rtm, msg);
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, rtm, msg) {
  var clientSecret = credentials.installed.client_secret ;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  o2c = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      genTokenUrl(rtm, msg);
      nocode = true;
    } else {
      nocode = false;
      o2c.credentials = JSON.parse(token);
      uploadToDrive(rtm, msg);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function genTokenUrl(rtm, msg) {
  var authUrl = o2c.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  rtm.sendMessage("앱 인증이 필요합니다. 아래 URL을 방문하여 인증해 주세요.", msg.channel);
  rtm.sendMessage(authUrl, msg.channel);
  rtm.sendMessage("인증을 통해 얻은 코드값을 'code: <코드값>' 형태의 메시지로 이 채널에 올리세요.", msg.channel);
  console.log('Authorize this app by visiting this url: ', authUrl);
  console.log(o2c);
}

var getNewToken = function(rtm, msg){
  if(nocode==true&&msg.text.startsWith("code:")&&msg.channel==channel){
    console.log(o2c);
    var code = msg.text;
    code = code.replace("code:","");
    code = code.replace(" ","");
    rtm.sendMessage("인증에 쓸 코드값: "+code, msg.channel);
    o2c.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        rtm.sendMessage("인증 오류: "+err, msg.channel);
        return;
      }
      o2c.credentials = token;
      storeToken(token);
      uploadToDrive(rtm, msg);
      nocode == false;
    });
  }
}
/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadToDrive(rtm, msg) {
  var service = google.drive('v3');
     var fileMetadata = {
       'name': filename,
       parents: [ targetFolderId ]
     };
     var media = {
       mimeType: 'text/plain',
       body: fs.createReadStream(filename)
     };

     service.files.create({
       auth: o2c,
        resource: fileMetadata,
        media: media,
        fields: 'id'
     }, function(err, file) {
       if(err) {
         // Handle error
         console.log(err);
         rtm.sendMessage("회의록 파일을 구글 드라이브에 업로드 중 오류가 발생하였습니다.", msg.channel);
         rtm.sendMessage(err.toString(), msg.channel);
         fs.unlink(filename, function (err) {
            if (err) throw err;
            console.log('successfully deleted '+filename);
          });
       } else {
         console.log('File Id: ', file.id);
         rtm.sendMessage("회의록 파일이 구글 드라이브에 업로드 되었습니다!", msg.channel);
         rtm.sendMessage("https://drive.google.com/file/d/"+file.id+"/view", msg.channel);
         fs.unlink(filename, function (err) {
            if (err) throw err;
            console.log('successfully deleted '+filename);
          });
       }
     });


}



module.exports = {uploadFile, getNewToken};
