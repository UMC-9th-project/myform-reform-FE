# myform-reform-FE
내폼리폼 프론트엔드 레포지토리입니다.

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
│   ├─ assets/             # 이미지, 아이콘 등 리소스
│   ├─ components/         # 공용 UI 컴포넌트
│   ├─ hooks/              # 커스텀 훅
│   ├─ pages/              # 페이지 단위 컴포넌트
│   ├─ stores/             # 전역 상태 관리
│   ├─ types/              # TypeScript 타입 정의
│   ├─ utils/              # 공통 유틸 함수
│   ├─ App.tsx             # 루트 컴포넌트
│   ├─ index.css           # 전역 스타일
│   └─ main.tsx            # 엔트리 포인트
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

| Message | 설명 |
|-------|------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| style | 코드 포맷 수정 (로직 변경 없음) |
| refactor | 리팩토링 |
| test | 테스트 코드 추가 |
| comment | 주석 추가 및 변경 |
| rename | 파일 혹은 폴더명 수정 |
| remove | 파일 혹은 폴더 삭제 |
| chore | 기타 변경사항 |


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
1. feature/* 브랜치에서 작업
2. 커밋 컨벤션 준수
3. develop 브랜치로 PR 생성
4. 최소 1명 리뷰 후 머지
  
