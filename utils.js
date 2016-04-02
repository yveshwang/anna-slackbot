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
    + JSON.stringify(response.headers) + "\n" + response.body;
  return responsestring;
}

requestToString = function(request) {
  var requeststring = request.method + " " + request.path + " HTTP/" + request.httpVersion + "\n"
    + JSON.stringify(request.headers) + "\n" + request.body;
  return requeststring;
}
msgToSlackPayload = function(msg) {
    //'payload={"text": "This is posted to #infra and comes from a bot named webhookbot."}' https://hooks.slack.com/services/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
    //var text =
}

curl = function(protocol, options, payload, callback) {
  var http;
  if(protocol === 'https') {
    http = require('https');
  } else {
    http = require('http');
  }
  var _callback = function(response) {
    callback(null, response);
  }
  var req = http.request(options, _callback);
  //This is the data we are posting, it needs to be a string or a buffer
  req.write(payload);
  req.end();
}
