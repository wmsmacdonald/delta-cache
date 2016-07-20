'use strict';

const express = require('express');
const fs = require('fs');
const https = require('https');
const diff_match_patch = require('./diff_match_patch');
const diff = new diff_match_patch.diff_match_patch();
const pug = require('pug');
const uuid = require('node-uuid');
const TextHistory = require('./text_history');

//const testFile = fs.readFileSync('./test_files/test1.txt');

let resourceHistories = {};

let options = {
  key: fs.readFileSync('/home/bill/.ssh/key.pem'),
  cert: fs.readFileSync('/home/bill/.ssh/cert.pem')
};

let app = express();
app.set('view engine', 'pug');
app.use(express.static('test/public'));

app.get('/dynamic.html', function (req, res) {
  let date = new Date().toString();
  let responseBody = '<h1>' + date + '</h1>';

  // if there isn't a resource history yet
  if (resourceHistories[req.route.path] === undefined) {
    resourceHistories[req.route.path] = TextHistory();
  }

  let id = resourceHistories[req.route.path].addVersion(responseBody);


  res.header('Delta-Version', id);
  if (req.headers['delta-version'] === undefined) {

    return res.end(resourceHistories[req.route.path].lastVersion);
  }
  // client has a cached version of the page
  else {
    let patches = resourceHistories[req.route.path].getPatches(req.headers['delta-version']);

    if (patches === undefined) {
      return res.end(responseBody);
    }
    else {
      res.header('Delta-Patch', 'true');
      console.log(JSON.stringify(patches));
      return res.end(JSON.stringify(patches));
    }
  }
});

https.createServer(options, app).listen(8000);
