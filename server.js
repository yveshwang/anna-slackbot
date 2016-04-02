/**

  ___ __  __ _ __   _ __  ___  ___  ___
 / _ \\ \/ /| '_ \ | '__|/ _ \/ __|/ __|
|  __/ >  < | |_) || |  |  __/\__ \\__ \
 \___|/_/\_\| .__/ |_|   \___||___/|___/
            |_|

Author: Yves Hwang
Date: 01.04.2016

A simple server that listens to traffic and forwards
it onto the webhook.
***/

"use strict";

require('./utils');
const PORT = process.env.express_port || 3000;
const webhookpath = process.env.slack_webhook;

let express = require('express');
let parser = require('body-parser');
let listener = express();
listener.use(parser.json());
listener.get('/', (req, res) => {
  //simple get function
  res.send('anna-slackbot. see https://github.com/yveshwang/anna-slackbot');
});
listener.post('/dockerhub/webhook', (req, res) => {
  if( !req.body) {
    return res.status(400).send();
  }
  console.log(req.body);
  res.status(200).send();
});
var server = function () {};
server.prototype.start = function() {
  console.log("express server starting.");
  listener.listen(PORT, () => {
    console.log("express server started.");
    console.log("listening on: http://localhost:"+PORT);
  });
}
module.exports = new server();
