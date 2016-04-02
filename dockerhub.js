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

var dockerhub = function () {};
dockerhub.prototype.trigger = function(https, method, host, path, payload, callback) {
  console.log('triggering dockerhub on ' + (https === 'https' ? "https://" : "http://") + host + path);
  curl(https, method, host, path, payload, callback);
}

module.exports = new dockerhub();
