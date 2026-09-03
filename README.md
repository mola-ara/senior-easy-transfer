# 바다송금

고령 사용자가 실제 돈 없이 송금 과정을 연습하고, 상황에 맞는 안전 확인을 경험할 수 있는 포트폴리오용 서비스입니다.

> 실제 은행, 금융망, 개인정보와 연결되지 않습니다. 모든 사용자·계좌·잔액·거래는 가상 데이터입니다.

기획·개발: 바다소나무 · [포트폴리오에서 보기](https://badasonamu-portfolio.vercel.app/projects/senior-easy-transfer)

## 무엇을 만들었나요

- 연습 송금과 가상 실제 송금을 모두 지원하는 전체 송금 흐름 (받는 분 선택 → 금액 입력 → 상황별 안전 확인 → 최종 확인 → 완료)
- 처음 방문자를 위한 단계별 홈 화면 안내, 최근 내역, 자주 보내는 분
- 큰 글씨·음성 안내(Web Speech API) 등 고령 사용자를 위한 접근성 설정
- 가족·도우미가 미리 접근성을 설정하고 사용자에게 전달할 수 있는 사용 준비 화면

제품 판단의 배경은 [`docs/PRODUCT_BRIEF.md`](docs/PRODUCT_BRIEF.md), 작업 과정과 문제 해결 기록은 [`DEVELOPMENT_LOG.md`](DEVELOPMENT_LOG.md)에 있습니다.

## 폴더 구조

```
.
├── docs/                 제품 기획서
├── DEVELOPMENT_LOG.md    작업 기록 (무엇을·왜·어떻게)
└── frontend/             Next.js 앱 (실제 서비스 코드)
```

지금은 프론트엔드만으로 동작하는 mock 기반 MVP이며, `frontend/src/services`가 유일한 진입점이라 이후 실제 API로 교체해도 화면 코드는 바뀌지 않습니다.

## 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000`에서 확인합니다. 자세한 스크립트는 [`frontend/README.md`](frontend/README.md) 참고.

## 기술 스택

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS · Lucide React · Prettier + ESLint
