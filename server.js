'use strict';

const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

let versionHistory = {};

let options = {
  key: fs.readFileSync('/home/bill/keys/key.pem'),
  cert: fs.readFileSync('/home/bill/keys/cert.pem')
};

let app = express();

app.use(express.static('test/public'));

app.get('/dynamic', function (req, res) {
  res.header('Content-type', 'text/html');
  return res.end('<h1>Hello, Secure World');
});

app.get('/dynamic.html', function (req, res) {
  if (req.headers['If-Modified-Since'] !== undefined) {
    versionHistory
  }
  res.header('Content-type', 'text/html');
  return delta(res.end('<h1>Sample Text</h1><h2>'));
});

https.createServer(options, app).listen(8000);

