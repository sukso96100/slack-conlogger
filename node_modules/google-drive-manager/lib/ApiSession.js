#!/usr/bin/env node

var q = require('q');
var fs = require('fs');
var readline = require('readline');
var googleAuth = require('google-auth-library');

var utils = require('./Utils');

var DEFAUL_CONFIG = {
  scopes: ['https://www.googleapis.com/auth/drive'],
  tokenDir: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/',
  tokenName: 'google-drive-manager.json',
};

/**
* Store token to disk be used in later program executions.
*
* @param {Object} token The token to store to disk.
*/
storeToken = function(authConfig, token) {
  console.log('Storing token.');
  try {
    fs.mkdirSync(authConfig.tokenDir);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(authConfig.tokenPath, JSON.stringify(token));
  console.log('Token stored to ' + authConfig.tokenPath);
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param authConfig
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for client.
 */
getNewToken = function(authConfig, oauth2Client) {

  console.log('Creating new token.');

  var $d = q.defer();

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: authConfig.scopes
  });

  console.info('Authorize this app by visiting this url: ', authUrl);

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        $d.reject(err);
      }
      oauth2Client.credentials = token;
      console.log('Token successfully retrivied');
      $d.resolve(token);
    });
  });

  return $d.promise;
};

module.exports.auth = undefined;
module.exports.authConfig = undefined;

// ApiSession = function(authConfig) {

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
*
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
exports.authorize = function(authConfig, credentials) {

  console.log('Authorizing google api credentials');

  authConfig = authConfig || DEFAUL_CONFIG;
  authConfig.tokenPath = authConfig.tokenDir + authConfig.tokenName;
  console.log('AuthConfig: ', authConfig);
  module.exports.authConfig = authConfig;

  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];

  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  return utils.readFile(authConfig.tokenPath).then(function(token) {
    console.log('Retrieving existing token: ', token);
    oauth2Client.credentials = JSON.parse(token);
  }, function(err) {
    console.log('Token not found', err);
    // Create and store new token
    return getNewToken(authConfig, oauth2Client).then(function(token) {
      storeToken(authConfig, token);
    });
  }).then(function() {
    console.log('Session was created');
    return module.exports.auth = oauth2Client;
  }, function(err) {
    console.log('Session unauthorized', err);
    return err;
  });

};

// };

// module.exports = function(authConfig)  {
//   return new ApiSession(authConfig);
// };
