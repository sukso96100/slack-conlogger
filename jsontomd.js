var fs = require('fs');

var processFile = function(msg, rtm){
  var jsonData = JSON.parse(fs.readFileSync("record.json","utf-8"));
  var mdData = "";
  var teamname = rtm.dataStore.getTeamById(msg.team).name + "("+msg.team+")";
  // var channelname = rtm.dataStore.getChannelById(msg.channel).name + "("+msg.channel+")";
  var username = rtm.dataStore.getUserById(msg.user).name + "("+msg.user+")";

  mdData += "\n##회의 정보\n";
  mdData += "- Slack 팀 이름 : " + teamname +"\n";
  // mdData += "- Slack 채널 이름 : " + channelname +"\n";
  mdData += "- 회의 시작 및 종료한 사용자 : " + username +"\n";
  mdData += "- 회의 시작 시각 : " + jsonData[0].time +"\n";
  mdData += "- 회의 종료 시각 : " + jsonData[jsonData.length - 1].time +"\n";

  mdData += "\n\n##안건\n";
  for(var i=0; i<jsonData.length; i++){
    if(jsonData[i].type=="subject"){
      mdData += "- "+jsonData[i].text + "[" + jsonData[i].time + "]" + "\n";
    }
  }

  mdData += "\n\n##메모\n";
  for(var i=0; i<jsonData.length; i++){
    if(jsonData[i].type=="memo"){
      mdData += "- "+jsonData[i].text + "[" + jsonData[i].time + "]" + "\n";
    }
  }

  mdData += "\n\n##대화 기록\n";
  for(var i=0; i<jsonData.length; i++){
    if(jsonData[i].type=="talk"){
      mdData += "- "+jsonData[i].text + "[" + jsonData[i].time + "]" + "\n";
    }
  }

  fs.writeFileSync(teamname+"@"+jsonData[0].time+'.md', mdData, 'utf8');
}

module.exports = processFile;
