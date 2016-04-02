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
  var res = dockerhub.trigger('https', 'POST', 'registry.hub.docker.com', process.env.dockerhub_path, "", callback);
});

controller.hears(["keyword","test"],["direct_message","direct_mention"],function(bot,message){
  bot.reply(message, 'bot test.')
  var res = curl('http', 'GET', 'www.vg.no', '/', "", function(err, retVal){
    if(err) {
      bot.reply(message, error.message);
    } else {
      bot.reply(message, responseToString(retVal));
    }
  });
});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  } else {
    server.start();
  }
});
