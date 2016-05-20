# slack-conlogger
Slack 에서 사용 가능한 회의 내용 기록 봇.(Node.js 기반)

## Author
Youngbin Han(sukso96100@gmail.com)

## License
MIT License

## 회의 기록 시작하기
- 회의를 시작할 채널에서, "회의 시작" 을 입력합니다.
- 그러면, 회의록 봇이 기록을 시작합니다.

## 안건, 메모 추가하거나 조회하기
- 회의록 봇이 회의 내용을 기록할 때, 안건과 메모를 따로 기록하고 조회가 가능합니다.
- 안건을 추가하려면, "안건: <추가할 안건 내용>" 을 입력합니다.
  - 예 -> 안건: 예시 안건0
- 안건을 모두 조회하려면, "안건 보기" 또는, "안건 보여줘"를 입력합니다.
- 메모를 추가하려면, "메모: <추가할 메모 내용>"를 입력합니다.
  - 예 -> 메모: 예시 메모0
- 메모를 모두 조회하려면, "메모 보기" 또는, "메모 보여줘"를 입력합니다.

## 회의 마치고 회의록 업로드 설정하기
- 회의를 마치려면, "회의 끝" 또는 "회의 종료"를 입력합니다.
- 회의를 시작한 사용자만이 회의를 마칠 수 있습니다.
- 회의록을 구글 드라이브에 업로드 시, 인증이 필요한 경우가 있으며 이 경우 회의록 봇의 안내에 따라 인증하면 됩니다.
- 회의록 파일은 "*.md"형식으로 구글 드라이브에 저장됩니다.
- 업로드 완료 후, 회의록 파일 링크를 회의록봇이 알려줍니다.

## 참고사항
- 참고 : 회의 기록은 하나의 한번에 하나의 채널에서만 시작되고 종료될 수 있습니다. 즉 채널 #C 에서 기록이 시작되면, #C 에서의 대화내용만 기록되며, 다른 채널의 대화내용이 기록되거나, 다른 채널에서 기록을 시작 할 수 없습니다.
