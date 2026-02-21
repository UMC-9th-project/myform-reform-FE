<div align="center">

# 🧵 myform-reform-FE

**스포츠 유니폼 리폼 플랫폼, 내폼리폼** 프론트엔드 레포지토리

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Zustand](https://img.shields.io/badge/Zustand-상태관리-764ABC)](https://zustand-demo.pmnd.rs/)
[![React Query](https://img.shields.io/badge/React_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)

</div>

---

## 📌 서비스 소개

**내폼리폼**은 고객과 리폼러를 연결하는 플랫폼입니다.

- 🛒 **주문 요청** · 여러 리폼러에게 견적 요청
- 🏪 **마켓** · 리폼 완성품 구매
- 👤 **리폼러** · 작품 판매 및 견적 제안
- 💬 **채팅** · 주문·견적 소통

> 배포: [myform-reform.vercel.app](https://myform-reform.vercel.app) (실제 배포 URL로 수정 가능)

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| **언어** | TypeScript |
| **프레임워크** | React 19, Vite |
| **스타일** | Tailwind CSS 4 |
| **상태 관리** | Zustand |
| **서버 상태** | TanStack Query (React Query) |
| **라우팅** | React Router 7 |
| **폼/검증** | Zod |
| **에디터** | Tiptap |

---

## 💻 Member

- 짜장/홍수진
- 간/김가인
- 오리/김태우

## 📁 디렉토리 구조

```
.
├─ .vscode/                # VSCode 설정
├─ node_modules/           # 의존성 패키지
├─ public/                 # 정적 파일
├─ src/
│   ├─ api/                # API 호출 및 Axios 설정
│   │   ├─ cart/           # 장바구니 API
│   │   ├─ chat/           # 채팅 API
│   │   ├─ market/         # 마켓 API
│   │   ├─ mypage/         # 마이페이지 API
│   │   ├─ order/          # 주문 API
│   │   └─ profile/        # 프로필 API
│   ├─ assets/             # 이미지, 아이콘 등 리소스
│   │   ├─ chat/           # 채팅 관련 이미지
│   │   ├─ home/           # 홈 관련 이미지
│   │   ├─ icons/          # 아이콘
│   │   ├─ landing/       # 랜딩 페이지 이미지
│   │   ├─ logos/         # 로고
│   │   └─ signup/        # 회원가입 관련 이미지
│   ├─ components/         # 컴포넌트
│   │   ├─ common/         # 공용 UI 컴포넌트
│   │   │   ├─ button/     # 버튼 컴포넌트
│   │   │   ├─ card/       # 카드 컴포넌트
│   │   │   ├─ Modal/      # 모달 컴포넌트
│   │   │   └─ ...         # 기타 공용 컴포넌트
│   │   ├─ domain/         # 도메인별 컴포넌트
│   │   │   ├─ cart/       # 장바구니 컴포넌트
│   │   │   ├─ chat/       # 채팅 컴포넌트
│   │   │   ├─ market/     # 마켓 컴포넌트
│   │   │   ├─ mypage/     # 마이페이지 컴포넌트
│   │   │   └─ ...         # 기타 도메인 컴포넌트
│   │   └─ layout/         # 레이아웃 컴포넌트
│   │       ├─ header/     # 헤더
│   │       └─ footer/    # 푸터
│   ├─ constants/          # 상수 정의
│   ├─ hooks/              # 커스텀 훅
│   │   └─ domain/         # 도메인별 훅
│   │       ├─ auth/       # 인증 관련 훅
│   │       ├─ cart/       # 장바구니 관련 훅
│   │       ├─ order/     # 주문 관련 훅
│   │       └─ ...         # 기타 도메인 훅
│   ├─ pages/              # 페이지 단위 컴포넌트
│   │   ├─ cart/           # 장바구니 페이지
│   │   ├─ chat/           # 채팅 페이지
│   │   ├─ market/         # 마켓 페이지
│   │   ├─ order/          # 주문 페이지
│   │   │   └─ reformer/   # 리폼러 주문 페이지
│   │   ├─ my-page/        # 일반 유저 마이페이지
│   │   ├─ my-page-Reform/ # 리폼러 마이페이지
│   │   ├─ signup/         # 회원가입 페이지
│   │   └─ ...             # 기타 페이지
│   ├─ schemas/            # 스키마 정의 (zod 등)
│   ├─ services/           # 서비스 레이어
│   │   └─ payment/       # 결제 서비스
│   ├─ stores/             # 전역 상태 관리 (Zustand)
│   ├─ stories/            # Storybook 스토리
│   ├─ types/              # TypeScript 타입 정의
│   │   ├─ api/            # API 응답 타입
│   │   ├─ domain/         # 도메인별 타입
│   │   └─ payment/        # 결제 관련 타입
│   ├─ utils/              # 공통 유틸 함수
│   │   ├─ common/         # 공통 유틸
│   │   ├─ domain/         # 도메인별 유틸
│   │   └─ payment/        # 결제 유틸
│   ├─ App.tsx             # 루트 컴포넌트
│   ├─ index.css           # 전역 스타일
│   ├─ main.tsx            # 엔트리 포인트
│   ├─ colors.css          # 색상 변수
│   └─ typography.css      # 타이포그래피 스타일
├─ .env                    # 환경 변수
├─ .gitignore              # Git 추적 제외 파일
├─ .prettierrc             # Prettier 설정
├─ eslint.config.js        # ESLint 설정
├─ index.html              # HTML 템플릿
├─ package.json            # 프로젝트 정보 및 스크립트
├─ package-lock.json       # 패키지 잠금 파일
├─ tsconfig.json           # TypeScript 설정
├─ tsconfig.app.json       # 앱 전용 TS 설정
├─ tsconfig.node.json      # Node 전용 TS 설정
├─ vite.config.ts          # Vite 설정
└─ README.md               # 프로젝트 소개 및 규칙

```

## 🌳 Branch 규칙

```
main
└─ develop
├─ feature/login
└─ feature/mypage
```

- `main`  
  : 배포 및 최종 브랜치
- `develop`  
  : 개발 통합 브랜치
- `feature/*`  
  : 기능 단위 개발 브랜치  
  (ex. `feature/login`, `feature/signup`)

### 📌 브랜치 사용 규칙

- 모든 기능 개발은 `feature/*` 브랜치에서 진행합니다.
- PR은 **develop 브랜치로만** 생성합니다.
- main 브랜치에는 직접 push ❌

## 🔖 Commit Convention

### 예시

- feat: 로그인 기능 구현
- fix: 폼 제출 시 validation 오류 수정

### Commit Message 규칙

| Message  | 설명                            |
| -------- | ------------------------------- |
| feat     | 새로운 기능 추가                |
| fix      | 버그 수정                       |
| docs     | 문서 수정                       |
| style    | 코드 포맷 수정 (로직 변경 없음) |
| refactor | 리팩토링                        |
| test     | 테스트 코드 추가                |
| comment  | 주석 추가 및 변경               |
| rename   | 파일 혹은 폴더명 수정           |
| remove   | 파일 혹은 폴더 삭제             |
| chore    | 기타 변경사항                   |

## 🔁 PR 규칙

- PR 제목 형식
  - [FE] 로그인 페이지 구현

- PR 생성 전 체크리스트
  - 커밋 컨벤션 준수 여부 확인
  - 불필요한 커밋 정리
  - 코드 정상 동작 확인

- 최소 1명 이상 리뷰 후 머지합니다.

## ✅ 기타 규칙

- 공통 컴포넌트 수정 시 팀원과 공유합니다.
- 컨벤션 변경 사항은 README에 반영합니다.
- 논의가 필요한 사항은 Issue로 등록합니다.

---

## 🚀 온보딩 가이드

1️⃣ 레포지토리 클론

```
git clone https://github.com/UMC-9th-project/myform-reform-FE.git
cd myform-reform-FE
```

2️⃣ 패키지 설치

```
npm install
```

> Node.js 18 이상 권장

3️⃣ 환경 변수 설정
프로젝트 루트에 .env 파일을 생성하고 아래 형식으로 작성합니다.

```
VITE_API_BASE_URL=your_api_base_url
```

> 실제 값은 팀 노션 또는 슬랙에서 공유됩니다.

4️⃣ 개발 서버 실행

```
npm run dev
```

- 기본 실행 주소: http://localhost:5173
- 정상 실행 시 메인 화면이 표시됩니다.

5️⃣ 브랜치 생성 규칙
작업 전 반드시 develop 브랜치에서 분기합니다.

```
git checkout develop
git pull origin develop
git checkout -b feature/기능명
```

📌 예시

- feature/login
- feature/mypage

6️⃣ 작업 & PR 흐름 요약

1. feature/\* 브랜치에서 작업
2. 커밋 컨벤션 준수
3. develop 브랜치로 PR 생성
4. 최소 1명 리뷰 후 머지
