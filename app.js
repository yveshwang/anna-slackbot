/**

           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

Thanks Botkit!

Author: Yves Hwang
Date: 01.04.2016

***/
"use strict";

require('./utils');

if (!process.env.slack_token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var server = require('./server');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.slack_token
})

controller.hears(["keyword","anna"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  // do something to respond to message
  // all of the fields available in a normal Slack message object are available
  // https://api.slack.com/events/message
  bot.reply(message,'whatup!');
  console.log(message);
});

controller.hears(["keyword","^docker build$"],["direct_message","direct_mention","mention","ambient"],function(bot,message){
  bot.reply(message, 'building all base images on dockerhub.')
  var dockerhub = require('./dockerhub');
  var callback = function( error, retVal) {
    if(error) {
      bot.reply(message, error.message);
    } else {
      // error is never returned, but the response object will prob be 5xx status etc.
      bot.reply(message, responseToString(retVal));
    }
  }
  var res = dockerhub.trigger(callback);
});

controller.hears(["keyword","about"],["direct_message","direct_mention"],function(bot,message){
  bot.reply(message, 'Jag känner en bot, hon heter anna, anna heter hon, och hon kan banna banna dig så hårt. Hon röjer upp i våran kanal. Jag vill berätta för dig att jag känner en bot.')
  var options = {
    hostname: '127.0.0.1',
    port: server.port,
    path: '/',
    //This is what changes the request to a POST request
    method: 'GET'
  };
  var res = curl('http', options, "", function(err, retVal){
    if(err) {
      bot.reply(message, error.message);
    } else {
      var body = '';
      retVal.on('data', function(d) {
              body += d;
      });
      retVal.on('end', function() {
        console.log("received all res payload now. " + body);
        //var parsed = JSON.parse(body);
        //console.log(responseToString(response));
        bot.reply(message, responseToString(retVal));
        bot.reply(message, body);
      });
    }
  });
});

controller.hears(["keyword","test"],["direct_message","direct_mention"],function(bot,message){
  bot.reply(message, 'bot test.')
  var options = {
    hostname: 'www.vg.no',
    path: '/',
    //This is what changes the request to a POST request
    method: 'GET'
  };
  var res = curl('http', options, "", function(err, retVal){
    if(err) {
      bot.reply(message, error.message);
    } else {
      bot.reply(message, responseToString(retVal));
    }
  });
});

controller.hears(["keyword","^webhook$"],["direct_message","direct_mention"],function(bot,message){
  bot.reply(message, 'bot webhook test.')
  var options = {
    hostname: 'hooks.slack.com',
    path: process.env.slack_webhook_path,
    //This is what changes the request to a POST request
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };
  var res = curl('https', options,
    "payload={\"text\" : \"This is posted to #infra and comes from a bot named webhookbot.\"}", function(err, response){
    if(err) {
      bot.reply(message, error.message);
    } else {
      var body = '';
      response.on('data', function(d) {
              body += d;
      });
      response.on('end', function() {
        console.log("received all res payload now. " + body);
        //var parsed = JSON.parse(body);
        //console.log(responseToString(response));
        bot.reply(message, responseToString(response));
      });
    }
  });
});

function webhookcallback(err, res) {
  //note that slack needs urlencoded payload
  let msg = `Docker Repository ${res.body.repository.repo_name} updated by ${res.body.push_data.pusher}`;
  console.log(msg);
  console.log(responseToString(res));
  var options = {
    hostname: 'hooks.slack.com',
    path: process.env.slack_webhook_path,
    //This is what changes the request to a POST request
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };
  curl('https', options ,
    "payload={\"text\" : \"" + msg + "\"}", function(err, response){
    if(err) {
      console.log("Error on issuing slack webhook.");
    } else {
      var body = '';
      response.on('data', function(d) {
              body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        console.log("received all res payload now. " + body);
        //var parsed = JSON.parse(body);
        //console.log(responseToString(response));
        console.log(responseToString(response));
      });
    }
  });
}

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  } else {
    server.dockerhubcallback(webhookcallback);
    server.start();
  }
});
