/*
Copyright (C) 2016 Youngbin Han <sukso96100@gmail.com>
Licensed under the MIT License
This file is a part of slack-conlogger
https://github.com/sukso96100/slack-conlogger
*/

var mUserObj = false;
var mRecord;
var channelId;
var data = [];
var fs = require('fs');
var jsontomd = require("./jsontomd");
var moment = require('moment');
var timezone = process.env.UTC_OFFSET;

var doWork = function(msg, userobj, rtm){
  // 수신 받은 메시지 처리
  if(msg.text.includes("회의")&&msg.text.includes("시작")){
    startRecording(msg, userobj, rtm);
  }else if (msg.text.includes("회의")
  &&(msg.text.includes("종료")||msg.text.includes("끝")||msg.text.includes("여기까지"))) {
    endRecording(msg, userobj, rtm);
  }
  if(mRecord==true){
    doLogging(msg, rtm);
  }
}

  function startRecording(msg, userobj, rtm){
    if(mRecord==true){
      rtm.sendMessage("회의가 이미 진행 중입니다.", msg.channel);
    }else{
      //회의 시작 처리
      mRecord = true;
      rtm.sendMessage(userobj.name+" 에 의해 회의가 시작되었습니다.", msg.channel);
      mUserObj = userobj;
      channelId = msg.channel;
      beforeLogging();
    }
  }

  function endRecording(msg, userobj, rtm){
    if(mUserObj==userobj&&mRecord==true&&channelId==msg.channel){
      //회의 종료 처리
      rtm.sendMessage(userobj.name+" 에 의해 회의가 끝났습니다.", msg.channel);
      mRecord = false;
      mUserObj = undefined;
      channelId = undefined;
      afterLogging(msg, rtm);
    }else if(channelId==msg.channel){
      //회의 시작한 사람이 종료하도록 처리
      rtm.sendMessage(userobj.name+" 만이 회의를 마칠 수 있습니다.", msg.channel);
    }
  }

function beforeLogging(){
  data = [];
}

function doLogging(msg, rtm){
  if(msg.channel==channelId){
    console.log("LOGGING...");
    if(msg.text.startsWith("안건:") || msg.text.startsWith("안건 :")){
      //안건 추가
        var subject = msg.text;
        subject = subject.replace("안건:", "");
        subject = subject.replace("안건 :", "");
        data.push({"type":"subject", "time": moment().utcOffset(timezone).format("YYYY.MM.DD_HH:MM:SS_A_Z"), "text": subject});
        console.log("New Subject: "+subject);
        rtm.sendMessage("*새 안건이 추가되었습니다.*", channelId);
        rtm.sendMessage("_"+subject+"_", channelId);
    }else if(msg.text.startsWith("메모:") || msg.text.startsWith("메모 :")){
      //메모 추가
        var memo = msg.text;
        memo = memo.replace("메모:", "");
        memo = memo.replace("메모 :", "");
        data.push({"type":"memo", "time": moment().utcOffset(timezone).format("YYYY.MM.DD_HH:MM:SS_A_Z"), "text": memo});
        console.log("New Memo: "+memo);
        rtm.sendMessage("*새 메모가 추가되었습니다.*", channelId);
        rtm.sendMessage("_"+memo+"_", channelId);
    }else if(msg.text.includes("안건 보여줘") || msg.text.includes("안건 보기") ){
      //안건 목록 보이기
      rtm.sendMessage("*지금까지 회의중 추가된 모든 안건 목록입니다.*", channelId);
      for(var i=0; i<data.length; i++){
        if(data[i].type=="subject"){
          rtm.sendMessage("_"+data[i].text+"_", channelId);
        }
      }
    }else if(msg.text.includes("메모 보여줘") || msg.text.includes("메모 보기") ){
      //메모 목록 보이기
      rtm.sendMessage("*지금까지 회의중 추가된 모든 메모 목록입니다.*", channelId);
      for(var i=0; i<data.length; i++){
        if(data[i].type=="memo"){
          rtm.sendMessage("_"+data[i].text+"_", channelId);
        }
      }
    }else {
      //대회 내용 기록
      data.push({"type":"talk", "time": moment().utcOffset(timezone).format("YYYY.MM.DD_HH:MM:SS_A_Z"),
       "text": rtm.dataStore.getUserById(msg.user).name + " : " + msg.text});
    }
  }
}

function afterLogging(msg, rtm){
  //JSON 파일로 저장
  fs.writeFileSync('record.json', JSON.stringify(data), 'utf8');
  jsontomd(msg, rtm);
}


module.exports=doWork;
