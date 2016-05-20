google-drive-manager
===

Custom google api rest service manager for [googleapis](https://github.com/google/google-api-nodejs-client/). Focused to wrap the official api for easy usage of common tasks such as create folders and upload files. **And its fully promised!**

### Requires

* Node.js (nodejs)  
* Node Package Manager (npm)  

### Install

Download/clone repository and run:

```sh
npm install
```

### Usage

```js
var googleDriveManager = require('google-drive-manager');
```

### Example

For more information please see **example.js**, run as:

```sh
nodejs example.js client_secret.json 0B_SPtvg96z_ZflJSN0x test1.txt test2.txt test3.txt
```

Its a little bit complicated example but should demonstrate all suported features, it requires three parameters:

1. client secret json file location
2. google drive parent folder id
3. files to be upload

### Methods available

Fully promised methods

* authorize

* insert

* createFolder

* createFolderIfNotExists

* search

* searchFolder

* uploadFile

* uploadFiles
