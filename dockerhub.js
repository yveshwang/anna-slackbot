/**

     _               _                _             _
  __| |  ___    ___ | | __ ___  _ __ | |__   _   _ | |__
 / _` | / _ \  / __|| |/ // _ \| '__|| '_ \ | | | || '_ \
| (_| || (_) || (__ |   <|  __/| |   | | | || |_| || |_) |
 \__,_| \___/  \___||_|\_\\___||_|   |_| |_| \__,_||_.__/

Author: Yves Hwang
Date: 01.04.2016

***/
"use strict";

require('./utils');

const protocol = 'https';
const host = 'registry.hub.docker.com';
const path = process.env.dockerhub_path;
const method = 'POST';

var dockerhub = function () {};
dockerhub.prototype.trigger = function(callback) {
  console.log('triggering dockerhub on ' + (protocol === 'https' ? "https://" : "http://") + host + path);
  var options = {
    hostname: host,
    path: path,
    //This is what changes the request to a POST request
    method: method
  };
  curl(protocol, options, "", callback);
}

module.exports = new dockerhub();
