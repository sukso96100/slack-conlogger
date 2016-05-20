#!/usr/bin/env node

var q = require('q');

var google = require('googleapis');
var core = require('./Core');
var session = require('./ApiSession');
var utils = require('./Utils');

module.exports.drive = undefined;

/**
 * @param clientSecretJson
 * @see https://github.com/google/google-api-nodejs-client
 */
exports.authorize = function(clientSecretJson, authConfig) {
  // Authorize a client with the loaded credentials, then load the Drive API.
  return utils.readJson(clientSecretJson).then(function(credentials) {
    console.log('Creating client session');
    return session.authorize(authConfig, credentials);
  }, function(err) {
    console.log('Error loading client secret file: ' + err);
    throw err;
  }).then(function(auth) {
    console.info('Loading drive api', auth);
    return module.exports.drive = google.drive({ auth: auth, version: 'v2' });
  });
};

/**
 * @param fileOptions
 * @see https://developers.google.com/drive/v2/reference/files/insert
 */
exports.insert = function(fileOptions) {
  return core.execute(module.exports.drive, 'files.insert', fileOptions);
};

/**
 * @param title
 * @param parentId (optional)
 */
exports.createFolder = function (title, parentId) {
  console.log('Creating folder by title: "' + title + '"');
  console.log('At: ', parentId);
  return module.exports.insert({
    resource : {
      title: title,
      mimeType: 'application/vnd.google-apps.folder',
      parents : core.parents(parentId),
    }
  });
};

/**
 * @param title
 * @param parentId (optional)
 */
exports.createFolderIfNotExists = function (title, parentId) {
  return module.exports.searchFolder(title, parentId).then(function(result) {
    if(!result.items || result.items.length == 0) {
      console.log('Folder not found by title: "' + title + '"')
      return module.exports.createFolder(title, parentId);
    } else {
      console.log('Retrieving folder by title: "' + title + '"')
      return result.items[0];
    }
  });
};

/**
 * @param fileOptions
 * @see https://developers.google.com/drive/v2/reference/children/list
 */
exports.search = function (fileOptions) {
  return core.execute(module.exports.drive, 'children.list', fileOptions);
};

/**
 * @param title
 * @param parentId (optional)
 */
exports.searchFolder = function (title, parentId) {
  console.log('Search folder: ', title);
  console.log('At: ', parentId);
  return module.exports.search({ 
    q: "mimeType='application/vnd.google-apps.folder' and title='"+title+"' and trashed=false",
    folderId : parentId,
  });
};

/**
 * @param filePath
 * @param parentId (optional)
 */
exports.uploadFile = function(filePath, parentId) {
  console.info('Uploading: ' + filePath);
    return utils.readFile(filePath).then(function(result) {
      return core.execute(module.exports.drive, 'files.insert', {
        resource: {
          title: utils.fileName(filePath),
          mimeType: null, // TODO
          parents : core.parents(parentId),
        },
        media:{
          mimeType: null, // TODO
          body: result
        }
      });
    });
};


/**
 * @param filePath
 * @param parentId (optional)
 */
exports.uploadFiles = function(filePaths, parentId) {
  var d = q.defer();
  var promises = new Array(filePaths.length);
  for(var i in filePaths) {
    promises.push(module.exports.uploadFile(filePaths[i], parentId));
  }
  q.all(promises).then(function(results) {
    d.resolve(results);
  });
  return d.promise;
};
