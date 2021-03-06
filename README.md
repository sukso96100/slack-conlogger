# slack-conlogger
Slack 에서 사용 가능한 회의 내용 기록 봇.(Node.js 기반)

## Author
Youngbin Han(sukso96100@gmail.com)

## License
MIT License

## References
- https://github.com/slackhq/node-slack-sdk
- https://api.slack.com/rtm
- https://api.slack.com/bot-users
- https://github.com/google/google-api-nodejs-client
- https://developers.google.com/drive/v3/web/quickstart/nodejs
- https://developers.google.com/drive/v3/web/about-auth
- https://developers.google.com/drive/v3/web/folder
- http://momentjs.com/
- https://nodejs.org/api/fs.html

## 봇 실행하기
- `start.sh` 파일을 열고. 환경 변수를 필요에 따라 수정합니다.
  - `SLACK_API_TOKEN` : Slack API 토큰
  - `GOOGLE_CLIENT_SECRET_FILE` : 클라이언트 비밀 파일(`*.json`)
    - [여기](https://console.developers.google.com/start/api?id=drive) 에서 발급 받을 수 있습니다.
    - 자세한 사항은 [여기](https://developers.google.com/drive/v3/web/quickstart/nodejs#step_1_turn_on_the_api_name) 를 참조하세요.
  - `GOOGLD_DRIVE_TARGET_FOLDER_ID` : 회의록 파일 올릴 구글 드라이브 폴더 ID
  - `UTC_OFFSET` : 시간대(예 : `+09:00`)
- `npm start` 를 실행하여 봇을 실행합니다.

## 회의 기록 시작하기
- 회의를 시작할 채널에서, "회의 시작" 을 입력합니다.
- 그러면, 회의록 봇이 기록을 시작합니다.

## 안건, 메모 추가하거나 조회하기
- 회의록 봇이 회의 내용을 기록할 때, 안건과 메모를 따로 기록하고 조회가 가능합니다.
- 안건을 추가하려면, `안건: <추가할 안건 내용>` 을 입력합니다.
  - 예 -> `안건: 예시 안건0`
- 안건을 모두 조회하려면, `안건 보기` 또는, `안건 보여줘`를 입력합니다.
- 메모를 추가하려면, `메모: <추가할 메모 내용>`를 입력합니다.
  - 예 -> `메모: 예시 메모0`
- 메모를 모두 조회하려면, `메모 보기` 또는, `메모 보여줘`를 입력합니다.

## 회의 마치고 회의록 업로드 설정하기
- 회의를 마치려면, `회의 끝` 또는 `회의 종료`를 입력합니다.
- 회의를 시작한 사용자만이 회의를 마칠 수 있습니다.
- 회의록을 구글 드라이브에 업로드 시, 인증이 필요한 경우가 있으며 이 경우 회의록 봇의 안내에 따라 인증하면 됩니다.
- 회의록 파일은 `*.md`형식으로 구글 드라이브에 저장됩니다.
- 업로드 완료 후, 회의록 파일 링크를 회의록봇이 알려줍니다.

## 참고사항
- 참고 : 회의 기록은 하나의 한번에 하나의 채널에서만 시작되고 종료될 수 있습니다. 즉 채널 `#C` 에서 기록이 시작되면, `#C` 에서의 대화내용만 기록되며, 다른 채널의 대화내용이 기록되거나, 다른 채널에서 기록을 시작 할 수 없습니다.
