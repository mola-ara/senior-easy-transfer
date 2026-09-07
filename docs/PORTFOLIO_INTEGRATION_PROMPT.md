# 포트폴리오 연동 체크리스트 / 프롬프트

`badasonamu-portfolio` (https://badasonamu-portfolio.vercel.app) 저장소에서
`/projects/senior-easy-transfer` 페이지를 갱신할 때, 아래 내용을 그대로 프롬프트로 붙여넣어 사용하세요.

## 바뀐 것

- 프로젝트 이름: **바다송금**
- 브랜드 색: 그린 계열 → **바다블루 계열** (`#0B6FA8` / `#084C74`)
- 로고: 방패+체크 모양 → **파도 모티프**

## 붙여넣을 프롬프트

```
포트폴리오 사이트의 /projects/senior-easy-transfer 프로젝트 카드와 상세 페이지를 갱신해줘.

1. 프로젝트 이름은 모든 화면과 메타데이터에서 "바다송금"으로 표기해줘.
2. 한 줄 소개: "고령 사용자를 위한 안전한 모바일 송금 연습 서비스 (실제 금융망과 연결되지 않는 가상 서비스)"
3. 대표 색상을 그린 계열에서 바다블루 계열(#0B6FA8, 진한 톤 #084C74)로 바꿔줘. 카드 배경이나 태그 색이 이 톤을 참고하면 좋겠어.
4. 기술 스택 태그: Next.js, React, TypeScript, Tailwind CSS
5. GitHub 링크: https://github.com/mola-ara/senior-easy-transfer
6. Live Demo 링크: https://senior-easy-transfer-ya2w.vercel.app/
7. 스크린샷/썸네일: 새 바다송금 로고(파도 모티프)와 파란 톤 화면으로 다시 캡처해서 교체해줘.
8. 프로젝트 설명에 "고령 사용자를 위한 접근성(큰 글씨, 음성 안내)"과 "실제 돈이 오가지 않는 연습 환경"이라는 두 가지 차별점을 강조해줘.
```

## 참고

- 로고 파일: `frontend/src/app/icon.svg` (바다/파도 모티프, 그라데이션 `#1E8FCC → #073F5E`)
- 대표 화면 캡처는 처음 화면(잔액 카드)과 송금 완료 화면을 권장합니다 — 브랜드 색과 파도 로고가 가장 잘 드러납니다.
- GitHub 저장소와 Vercel 배포가 모두 완료되어 위 5, 6번 링크가 채워져 있습니다.
