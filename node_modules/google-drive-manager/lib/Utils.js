#!/usr/bin/env node

var q = require('q');
var fs = require('fs');
var path = require('path'); // prefer use fs instead

/**
* Read file
* @param filePath
*/
exports.readFile = function (filePath) {
  var $d = q.defer();
  // var fstatus = fs.stat(filePath, function(err) {
  //   $d.reject(err);
  // });
  // console.info(filePath, ', status: ', fstatus);
  // fs.openSync(filePath, 'r', function(status, fileDescripter) {
  //   console.info('Reading file: ', filePath);
  //   if (status) {
  //     console.info('Status is ' + status, filePath);
  //     $d.reject(status.message);
  //   }
  //   var buffer = undefined;
  //   try {
  //     buffer = new Buffer(fstatus.size);
  //     fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function(err, num) {
  //         console.info('Completed file reading: ', filePath);
  //         $d.resolve(buffer);
  //     });
  //   } catch(err) {
  //     $d.reject(err);
  //   }
  // });
  console.info('Reading file: ', filePath);
  fs.readFile(filePath, function processClientSecrets(err, content) {
    console.info('Retrieving content to file: ', filePath);
    if (err) {
      $d.reject(err);
    } else {
      $d.resolve(content);
    }
  });
  return $d.promise;
};

/**
* Read file and returns json
* @param filePath
*/
exports.readJson = function(filePath) {
  console.info('Reading file: ', filePath);
  var $d = q.defer();
  fs.readFile(filePath, function processClientSecrets(err, content) {
    console.info('Retrieving json to file: ', filePath);
    if (err) {
      $d.reject(err);
    } else {
      $d.resolve(JSON.parse(content));
    }
  });
  return $d.promise;
};


/**
* Returns filename with extension
* @param filePath
*/
exports.fileName = function(filePath) {
  return path.basename(filePath);
}