# 바다송금 — 프론트엔드

Next.js(App Router) 기반 프론트엔드입니다. 백엔드 없이 `src/mocks` 데이터와 `src/services`만으로 동작하는 mock 기반 MVP입니다.

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 (`http://localhost:3000`) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 빌드 결과 실행 (먼저 `build` 필요) |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `npm run format` | Prettier로 전체 포맷 적용 |
| `npm run format:check` | Prettier 포맷 검사만 수행 |
| `npm run test` | Vitest 단위 테스트 1회 실행 |
| `npm run test:watch` | Vitest 감시 모드 |
| `npm run audit:ui` | Playwright로 주요 화면을 모바일 뷰포트로 캡처(`ui-audit*/`) |

## 폴더 구조

```
src/
├── app/         라우트(화면)
├── components/  공통 UI 컴포넌트
├── domain/      도메인 타입
├── features/    화면 단위를 넘어서는 기능 단위 (예: 처음 화면 투어)
├── lib/         포맷팅·검증 등 순수 함수 유틸리티
├── mocks/       mock 데이터
├── services/    화면이 데이터에 접근하는 유일한 진입점
└── store/       전역 상태(Context)
```

## 테스트 범위

현재는 `src/lib`, `src/services`의 순수 함수 로직만 단위 테스트로 커버합니다(`*.test.ts`). 화면 컴포넌트·전체 송금 흐름에 대한 테스트(단위/e2e)는 아직 없습니다.
