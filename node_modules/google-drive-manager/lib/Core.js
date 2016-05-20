#!/usr/bin/env node

var q = require('q');

/**
 * @param resourceName
 */
exports.get = function(ctx, resourceName) {
  var namespaces = resourceName.split(".");
  var res = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    ctx = ctx[namespaces[i]];
  }
  return ctx[res];
};

/**
 * @param resourceName
 * @param params
 */
exports.execute = function(ctx, resourceName, params) {
  console.log('Executing resource: "' + resourceName + '", with params: "' + params + '"');
  var $d = q.defer();
  try {
    ctx = module.exports.get(ctx, resourceName);
    var req = ctx(params, function(err, results) {
      if (err) { 
        console.log(err);
        $d.reject(err);
      } else {
        console.log(results);  
        $d.resolve(results);
      }
    });
    console.log(req.uri);
    console.log(req.uri.href); // print out the request's URL.
  } catch(err) {
    console.log(err);
    $d.reject(err);
  }
  return $d.promise;
};

/**
 * @param parentId
 */
exports.parents = function(parentId) {
  return parentId != undefined ? [ { 'id': parentId } ] : null;
};
