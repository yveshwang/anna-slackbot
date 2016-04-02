/**
        _    _  _
 _   _ | |_ (_)| | ___
| | | || __|| || |/ __|
| |_| || |_ | || |\__ \
 \__,_| \__||_||_||___/

Author: Yves Hwang
Date: 01.04.2016

***/

responseToString = function(response) {
  var responsestring = "HTTP/" + response.httpVersion + " " + response.statusCode + " " + response.statusMessage + "\n"
    + JSON.stringify(response.headers);
  return responsestring;
}

curl = function(protocol, method, host, path, payload, callback) {
  var http;
  if(protocol === 'https') {
    http = require('https');
  } else {
    http = require('http');
  }
  var options = {
    host: host,
    path: path,
    //This is what changes the request to a POST request
    method: method
  };
  var _callback = function(response) {
    console.log(responseToString(response));
    callback(null, response);
  }
  var req = http.request(options, _callback);
  //This is the data we are posting, it needs to be a string or a buffer
  req.write(payload);
  req.end();
}
