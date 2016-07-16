'use strict';

const express = require('express');
const fs = require('fs');
const https = require('https');
const diff_match_patch = require('./diff_match_patch');
const diff = new diff_match_patch.diff_match_patch();
const pug = require('pug');

//const testFile = fs.readFileSync('./test_files/test1.txt');

let versionHistory = {};

let options = {
  key: fs.readFileSync('/home/bill/.ssh/key.pem'),
  cert: fs.readFileSync('/home/bill/.ssh/cert.pem')
};

let app = express();
app.set('view engine', 'pug');
app.use(express.static('test/public'));

app.get('/dynamic.html', function (req, res) {
  let date = new Date().toString();
  let response = '<h1>' + date + '</h1>';

  // no version has been created yet
  if (versionHistory[req.route.path] === undefined) {
    versionHistory[req.route.path] = {};
  }
  versionHistory[req.route.path][date] = response;

  res.header('Delta-Version', date);
  if (req.headers['delta-version'] === undefined) {
    res.header('Content-Type', 'text/html');
    return res.end(response);
  }
  else { // client has a cached version of the page
    let clientVersion = versionHistory[req.route.path][req.headers['delta-version']];
    let patches = diff.patch_make(clientVersion, response);
    res.header('Delta-Patch', 'true');
    console.log(JSON.stringify(patches));
    return res.end(JSON.stringify(patches));
  }
});

https.createServer(options, app).listen(8000);

