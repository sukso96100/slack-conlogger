/*
Copyright (C) 2016 Youngbin Han <sukso96100@gmail.com>
Licensed under the MIT License
This file is a part of slack-conlogger
https://github.com/sukso96100/slack-conlogger
*/

var RtmClient = require('@slack/client').RtmClient;
var token = process.env.SLACK_API_TOKEN;

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var MemoryDataStore = require('@slack/client').MemoryDataStore;

// Slack 클라이언트 초기화
var rtm = new RtmClient(token, {
  logLevel: 'debug',
  dataStore: new MemoryDataStore(),
  autoReconnect: true});
var doWork = require('./record');
var uploader = require('./uploader');

rtm.start();

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message){
  // 메시지 수신 시 동작
  console.log("EVENTS - MESSAGE");
  console.log("MESSAGE - "+message.text);
  console.log("CHANNEL - "+message.channel);
  if(message.text!=undefined){
    doWork(message, rtm.dataStore.getUserById(message.user), rtm);
    uploader.getNewToken(rtm, message);
  }
});
