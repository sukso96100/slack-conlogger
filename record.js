var mUserObj = false;
var mRecord;
var channelId;
var data = [];
var fs = require('fs');

var doWork = function(msg, userobj, rtm){
  if(msg.text.includes("회의")&&msg.text.includes("시작")){
    startRecording(msg, userobj, rtm);
  }else if (msg.text.includes("회의")&&msg.text.includes("종료"||"끝"||"여기까지")) {
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
      mRecord = true;
      rtm.sendMessage(userobj.name+" 에 의해 회의가 시작되었습니다.", msg.channel);
      mUserObj = userobj;
      channelId = msg.channel;
      beforeLogging();
    }
  }

  function endRecording(msg, userobj, rtm){
    if(mUserObj==userobj&&mRecord==true){
      rtm.sendMessage(userobj.name+" 에 의해 회의가 끝났습니다.", msg.channel);
      mRecord = false;
      mUserObj = undefined;
      channelId = undefined;
      afterLogging();
    }else {
      rtm.sendMessage(userobj.name+" 만이 회의를 마칠 수 있습니다.", msg.channel);
    }
  }

function beforeLogging(){

}

function doLogging(msg, rtm){
  if(msg.channel==channelId){
    console.log("LOGGING...");
    if(msg.text.startsWith("안건:") || msg.text.startsWith("안건 :")){
        var subject = msg.text;
        subject = subject.replace("안건:", "");
        subject = subject.replace("안건 :", "");
        data.push({"type":"subject", "time": new Date(), "text": subject});
        console.log("New Subject: "+subject);
        rtm.sendMessage("*새 안건이 추가되었습니다.*", channelId);
        rtm.sendMessage("_"+subject+"_", channelId);
    }else if(msg.text.startsWith("메모:") || msg.text.startsWith("메모 :")){
        var memo = msg.text;
        memo = memo.replace("메모:", "");
        memo = memo.replace("메모 :", "");
        data.push({"type":"memo", "time": new Date(), "text": memo});
        console.log("New Memo: "+memo);
        rtm.sendMessage("*새 메모가 추가되었습니다.*", channelId);
        rtm.sendMessage("_"+memo+"_", channelId);
    }else {
      data.push({"type":"talk", "time": new Date(), "text": msg.text});
    }
  }
}

function afterLogging(){
  fs.writeFileSync('record.json', JSON.stringify(data), 'utf8');
}

module.exports=doWork;
