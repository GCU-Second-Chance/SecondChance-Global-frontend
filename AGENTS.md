## 4. 작업 TODO (PR 및 커밋 단위 계획)

> **React 19 사용 필수**: 모든 작업은 react@19, react-dom@19, next@15.x 기반으로 진행
- 모든 커밋,PR은 영어로

---

### **PR #1: 프로젝트 초기 설정 및 React 19 환경 구축**

#### 커밋 1: React 19 프로젝트 초기화
- [ ] create-next-app으로 프로젝트 생성 (App Router, TypeScript, Tailwind)
- [ ] package.json에 React 19 명시 (react@19, react-dom@19, next@15.x)
- [ ] Node.js >=18 확인 및 .nvmrc 추가

#### 커밋 2: 패키지 관리 설정
- [ ] .npmrc 생성 (save-prefix="", engine-strict=true)
- [ ] package.json에 engines 필드 추가
- [ ] 의존성 버전 고정

#### 커밋 3: 코드 품질 도구 설정
- [ ] ESLint 설정 (next/core-web-vitals + React 19 규칙)
- [ ] Prettier 설정 (.prettierrc, .prettierignore)
- [ ] eslint-plugin-import 추가 및 import 정렬 규칙

#### 커밋 4: TypeScript 엄격 모드
- [ ] tsconfig.json 엄격 모드 활성화 (strict: true)
- [ ] noUncheckedIndexedAccess 활성화
- [ ] 절대 경로 alias 설정 (@/*)

#### 커밋 5: VSCode 설정
- [ ] .vscode/settings.json 추가 (path intellisense, format on save)
- [ ] .vscode/extensions.json 추가 (권장 확장)

#### 커밋 6: 환경변수 가이드
- [ ] .env.example 생성
- [ ] next.config.js에 환경변수 로딩 설정
- [ ] README.md에 환경변수 문서 추가

---

### **PR #2: Tailwind CSS 및 스타일 시스템**

#### 커밋 1: Tailwind 기본 설정
- [ ] tailwind.config.js 확장 (colors, spacing, borderRadius)
- [ ] postcss.config.js 확인
- [ ] globals.css에 CSS 변수 정의

#### 커밋 2: 다크모드 전략
- [ ] tailwind.config.js에 darkMode: 'class' 설정
- [ ] prefers-reduced-motion 대응 유틸 클래스

#### 커밋 3: 기본 레이아웃 컴포넌트
- [ ] src/components/layout/Header.tsx
- [ ] src/components/layout/Footer.tsx
- [ ] src/components/layout/Container.tsx
- [ ] 반응형 그리드 유틸 클래스 정의

---

### **PR #3: Framer Motion 및 애니메이션 시스템**

#### 커밋 1: Framer Motion 설치
- [ ] framer-motion 패키지 추가
- [ ] React 19 호환성 확인

#### 커밋 2: 모션 프리셋 유틸
- [ ] src/utils/motion-presets.ts 생성
- [ ] fadeIn, slideIn, stagger 프리셋 정의
- [ ] 타입 정의 추가

---

### **PR #4: 상태 관리 (Zustand) 설정**

#### 커밋 1: Zustand 스토어 초기화
- [ ] zustand 패키지 설치
- [ ] src/stores/index.ts 생성 (root store)
- [ ] persist 미들웨어 설정

#### 커밋 2: 챌린지 플로우 slice
- [ ] src/stores/challenge-slice.ts 생성
- [ ] step, frameId, slots, progress 상태 정의
- [ ] 타입 정의 (ChallengeState, ChallengeActions)

---

### **PR #5: React Query 설정**

#### 커밋 1: React Query 초기화
- [ ] @tanstack/react-query 설치
- [ ] src/app/providers.tsx 생성 (QueryClientProvider)
- [ ] staleTime, retry 정책 설정

#### 커밋 2: 공통 fetcher 유틸
- [ ] src/lib/fetcher.ts 생성
- [ ] 에러 표준화 (ApiError 타입)
- [ ] AbortController, timeout 처리

---

### **PR #6: i18n 설정 (react-i18next)**

#### 커밋 1: react-i18next 초기 구성
- [ ] react-i18next, i18next 설치
- [ ] src/i18n/config.ts 생성
- [ ] resources 구조 정의 (common, landing, challenge)
- [ ] 한국어, 영어, 일본어, 중국어(간체) 초기 번역 파일

#### 커밋 2: 언어 스위처 컴포넌트
- [ ] src/components/LanguageSwitcher.tsx 생성
- [ ] localStorage에 언어 설정 저장
- [ ] 현재 언어 표시 UI

#### 커밋 3: GCP Translation API 래퍼
- [ ] src/lib/translation-api.ts 인터페이스 정의
- [ ] 목업 리턴 함수 작성

#### 커밋 4: i18n 린트 규칙
- [ ] eslint-plugin-i18next 설치
- [ ] 번역 키 컨벤션 문서화

---

### **PR #7: Google Analytics 4 설정**

#### 커밋 1: GA4 초기화
- [ ] next.config.js에 GA4 measurement ID 설정
- [ ] src/lib/gtag.ts 생성 (gtag 래퍼)

#### 커밋 2: 페이지뷰 자동 수집
- [ ] src/app/layout.tsx에 GA 스크립트 추가
- [ ] App Router에서 페이지 전환 리스너

#### 커밋 3: 이벤트 유틸 및 타입
- [ ] src/lib/analytics.ts 생성 (logEvent 함수)
- [ ] AnalyticsEvent 타입 정의
- [ ] dog_shared, share_completed, qr_scanned 등 이벤트 키 상수화

---

### **PR #8: 랜딩 페이지 - 라우트 스캐폴딩**

#### 커밋 1: 페이지 구조
- [ ] src/app/page.tsx 스캐폴딩
- [ ] 섹션별 placeholder 컴포넌트

#### 커밋 2: Hero 섹션
- [ ] src/components/landing/HeroSection.tsx
- [ ] 슬라이드쇼 컴포넌트 (3초 자동 전환)
- [ ] React.lazy + Suspense 적용

#### 커밋 3: CTA 버튼
- [ ] src/components/landing/CTAButtons.tsx
- [ ] Next.js Link로 라우팅 연결
- [ ] framer-motion 애니메이션

---

### **PR #9: 랜딩 페이지 - Quick Stats & How It Works**

#### 커밋 1: Quick Stats 섹션
- [ ] src/components/landing/QuickStats.tsx
- [ ] 목업 데이터 (총 공유 횟수, 입양 성공, 참여 국가)
- [ ] 수치 카운트업 애니메이션

#### 커밋 2: How It Works 섹션
- [ ] src/components/landing/HowItWorks.tsx
- [ ] 3단계 프로세스 UI
- [ ] 스크롤 인뷰 모션 (framer-motion)

---

### **PR #10: 랜딩 페이지 - Success Stories & Featured Dogs**

#### 커밋 1: Success Stories
- [ ] src/components/landing/SuccessStories.tsx
- [ ] 목업 데이터 (src/data/mock-stories.ts)
- [ ] 카드 레이아웃

#### 커밋 2: Featured Dogs
- [ ] src/components/landing/FeaturedDogs.tsx
- [ ] "긴급" 배지 스타일
- [ ] 목업 데이터 (src/data/mock-dogs.ts)

---

### **PR #11: 챌린지 플로우 - 기본 레이아웃**

#### 커밋 1: 멀티스텝 레이아웃
- [ ] src/app/challenge/layout.tsx
- [ ] Stepper 컴포넌트 (1/4, 2/4, 3/4, 4/4)
- [ ] 뒤로가기 버튼

#### 커밋 2: LocalStorage 자동 저장/복원
- [ ] useEffect로 Zustand 상태 저장
- [ ] 페이지 리로드 시 복원 로직

#### 커밋 3: 이탈 방지
- [ ] beforeunload 이벤트 핸들러
- [ ] Step 3 이후에만 작동

---

### **PR #12: 챌린지 Step 1 - 프레임 선택**

#### 커밋 1: 프레임 데이터 모델
- [ ] src/types/frame.ts 타입 정의
- [ ] src/data/frames.ts 목업 데이터 (3종: 2x2, 4x1, 1x4)

#### 커밋 2: 썸네일 갤러리
- [ ] src/components/challenge/FrameGallery.tsx
- [ ] 가로 스크롤 UI
- [ ] 선택 프리뷰

#### 커밋 3: 프레임 선택 로직
- [ ] "이 프레임 사용하기" 버튼
- [ ] Zustand에 frameId 저장
- [ ] step 1 → 2 전환

#### 커밋 4: 접근성
- [ ] 키보드 내비게이션 (화살표 키)
- [ ] aria-labels 추가

---

### **PR #13: 챌린지 Step 2 - 유기견 매칭 (핵심)**

#### 커밋 1: API 유틸 및 React Query
- [ ] src/lib/api/dogs.ts (fetchRandomDog)
- [ ] React Query 키: ['dogs', 'random']
- [ ] 타입 정의 (Dog interface)

#### 커밋 2: 유기견 카드 컴포넌트
- [ ] src/components/challenge/DogCard.tsx
- [ ] 스켈레톤 로딩 상태

#### 커밋 3: "운명의 아이 만나기" 버튼
- [ ] 랜덤 호출 트리거
- [ ] GA 이벤트 (dog_matched)

#### 커밋 4: "다른 아이 보기" 재매칭
- [ ] throttle로 중복 요청 방지 (lodash)
- [ ] 로딩 상태 표시

#### 커밋 5: dogSlots 자동 배치
- [ ] Zustand slice에 배치 로직
- [ ] 에러 토스트 (react-hot-toast)

---

### **PR #14: 챌린지 Step 3 - 사진 업로드/촬영 (1/2)**

#### 커밋 1: 파일 검증 유틸
- [ ] src/utils/file-validator.ts
- [ ] 확장자 체크 (jpg, png, heic)
- [ ] 크기 체크 (<=10MB)
- [ ] EXIF 회전 처리

#### 커밋 2: 카메라 촬영 컴포넌트
- [ ] src/components/challenge/CameraCapture.tsx
- [ ] MediaDevices API 사용
- [ ] iOS/Android 권한 안내 모달

---

### **PR #15: 챌린지 Step 3 - 사진 업로드/촬영 (2/2)**

#### 커밋 1: 슬롯 선택 UI
- [ ] src/components/challenge/PhotoSlots.tsx
- [ ] 현재 슬롯 인디케이터 (1/3, 2/3, 3/3)
- [ ] 슬롯별 상태 표시 (완료/대기)

#### 커밋 2: 로컬 미리보기
- [ ] URL.createObjectURL로 즉시 프리뷰
- [ ] 크롭/줌/회전 간단 구현

#### 커밋 3: 다시 찍기/선택 UX
- [ ] 슬롯 리셋 버튼
- [ ] 진행도 업데이트

#### 커밋 4: 뒤로가기 핸들러
- [ ] 브라우저 뒤로가기 감지
- [ ] 확인 모달

---

### **PR #16: 챌린지 Step 4 - 결과물 생성 (1/2)**

#### 커밋 1: 캔버스 렌더러
- [ ] src/lib/canvas-renderer.ts
- [ ] 2x2, 4x1, 1x4 템플릿 구현
- [ ] 이미지 배치 로직

#### 커밋 2: QR 코드 생성
- [ ] qrcode 패키지 설치
- [ ] 100x100px, 하단 우측 배치
- [ ] URL 구조: https://secondchance.global/dog/{dogId}

#### 커밋 3: 텍스트 레이어
- [ ] 유기견 이름 (하단 좌측)
- [ ] 해시태그 (#SecondChanceGlobal #AdoptDontShop)
- [ ] 보호소명
- [ ] 웹폰트 로딩

---

### **PR #17: 챌린지 Step 4 - 결과물 공유 (2/2)**

#### 커밋 1: PNG 다운로드
- [ ] canvas.toBlob() 사용
- [ ] 파일명 규칙 (secondchance_{dogId}_{timestamp}.png)

#### 커밋 2: Web Share API
- [ ] navigator.share 호출
- [ ] Fallback: 링크 복사 버튼
- [ ] 공유 가능 여부 체크

#### 커밋 3: GA 이벤트 연동
- [ ] share_completed 이벤트
- [ ] share_platform 이벤트

#### 커밋 4: 자동 생성 공유 텍스트
- [ ] i18n 템플릿 삽입
- [ ] 다국어 지원

---

### **PR #18: 유기견 상세 페이지 및 QR 트래킹**

#### 커밋 1: /dog/[id] 라우트
- [ ] src/app/dog/[id]/page.tsx
- [ ] 목업 데이터 로드
- [ ] 기본 레이아웃

#### 커밋 2: "챌린지에서 왔어요" 배지
- [ ] URL 파라미터 처리 (?from=challenge)
- [ ] 배지 UI 및 애니메이션

#### 커밋 3: Analytics 이벤트
- [ ] qr_scanned 로깅
- [ ] challenge_conversion 로깅
- [ ] challenge_to_share 로깅

---

### **PR #19: API 목업 및 에러 처리**

#### 커밋 1: Next.js API routes
- [ ] src/app/api/dogs/[id]/route.ts
- [ ] src/app/api/dogs/random/route.ts
- [ ] 목업 데이터 리턴

#### 커밋 2: 챌린지 업로드 API
- [ ] src/app/api/challenge/[id]/upload/route.ts
- [ ] 48시간 만료 시뮬레이션 (목업)

#### 커밋 3: 공통 에러 처리
- [ ] src/lib/api-error.ts
- [ ] Error Boundary 컴포넌트
- [ ] 에러 토스트 연동

---

### **PR #20: 성능 최적화**

#### 커밋 1: 이미지 최적화
- [ ] next.config.js에 remotePatterns 설정
- [ ] next/image 사용 강제

#### 커밋 2: 코드 스플리팅
- [ ] React.lazy로 슬라이드쇼 분리
- [ ] QR/캔버스 컴포넌트 분리
- [ ] Suspense 경계 추가

#### 커밋 3: 메모이제이션
- [ ] React.memo, useMemo, useCallback 적용
- [ ] lodash throttle/debounce 최소화
- [ ] 불필요한 리렌더링 제거

---

### **PR #21: 접근성 및 배포 준비**

#### 커밋 1: 접근성 점검
- [ ] aria-label, role 추가
- [ ] 키보드 포커스 순서 확인
- [ ] 색상 대비 테스트 (WCAG AA)

#### 커밋 2: Lighthouse 점검
- [ ] Performance 90+ 달성
- [ ] Accessibility 90+ 달성
- [ ] SEO 메타 태그 추가 (OG, Twitter Card)

#### 커밋 3: Vercel 배포
- [ ] Vercel 프로젝트 연결
- [ ] 환경변수 설정 (GA4, API URL 등)
- [ ] Preview/Production 환경 분리
- [ ] 도메인 연결 준비

---

**총 21개 PR, 약 70개 커밋으로 구성**

각 PR은 독립적으로 리뷰 및 배포 가능하며, Vercel의 자동 배포 기능을 활용합니다.


---


## 0. 프론트엔드 기술 스택
- **프레임워크**: Next.js , React 19
- **스타일링**: Tailwind CSS, framer-motion
- **성능 최적화**: Code Splitting, Lazy Loading, Memozation, lodash(throttle,debounce)
- **상태 관리**: Zustand, React Query
- **i18n**: react-i18next
- **분석 도구** : Google Analytics 4,
- **배포**: Vercel
- **버전 관리**: Git, GitHub



--- 
아래 내용은 프로젝트 내용

## 1. 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| **프로젝트명** | SecondChanceGlobalVer |
| **팀명** | Gi-hoe (기회) |
| **목적** | 유기견 정보의 글로벌 공유를 통한 국제 입양 촉진 |
| **타겟** | 전 세계 동물 애호가, SNS 활성 사용자 |
| **플랫폼** | 반응형 웹 (모바일/데스크톱) |
| **로그인** | 불필요 (세션 기반) |

---

## 2. 핵심 기능 명세

### 2.1 다국어 지원

- **사용 기술**: i18n, GCP Translation API
- 한국어, 영어, 일본어, 중국어(간체) 

### 2.2 유기견 프로필 시스템

### 2.2.1 유기견 정보 구조

**데이터 스키마(추후 변동 가능성 존재)**:

```json
{
  id: "unique_dog_id", // dog id (필수)
  images: ["url1", "url2"], // 최소 1장 (필수)
  name: "멍멍이", // 강아지 이름 (필수)
  age: 3, // 숫자 (년) (필수)
  gender: "male" | "female", // 성별 (필수)
  breed: "믹스견", // 종 (선택)
  location: {
    country: "South Korea", // 국가 (필수)
    city: "Seoul" // 도시 (필수)
  },
  shelter: {
    name: "OO 보호소", // 쉘터명 (필수)
    contact: "010-xxxx-xxxx", // 연락처 (필수)
    email: "shelter@example.com" // 이메일 (선택)
  },
  // 메타데이터
  createdAt: "2025-10-01", // 생성일 (필수)
}

```

### 2.2.2 소셜 공유 기능

**Web Share API  지원** 

**Fallback 전략** (Web Share API 미지원 시):

- 링크 복사 버튼

**공유 추적은 Analytics 이벤트**

- `dog_shared`: 공유 버튼 클릭
- `share_completed`: 공유 완료
- `share_platform`: 공유 플랫폼 (instagram/facebook/etc)

---

### 2.3 인생네컷 챌린지 (핵심 기능)

### 2.3.1 콘셉트

- 4장의 사진으로 구성된 인생네컷 스타일 결과물
- 유기견 사진 + 사용자 사진 조합
- QR 코드 내장으로 유기견 프로필 연결

### 2.3.2 프로세스 플로우

---

### 2.3.3 Step 1: 프레임 선택

**제공 프레임 테마** (현재 3종):

1. 2X2 그리드
2. 4X1 수직
3. 1X4 수평

**프레임 구조**:

```jsx
{
  id: "frame_classic_01",
  name: "Classic White",
  thumbnail: "frame_thumb.png",
  template: "4x1_vertical", // 레이아웃
  dogSlots: [0], // 유기견 사진이 들어갈 슬롯 번호 (0~3)
  userSlots: [1, 2, 3] // 사용자 사진 슬롯
}

```

**UI 요소**:

- 프레임 썸네일 갤러리 (가로 스크롤)
- 선택 시 프리뷰 확대
- "이 프레임 사용하기" 버튼

---

### 2.3.4 Step 2: 유기견 매칭(우선순위:상)

**매칭 방식**:

| 모드 | 설명 | UI |
| --- | --- | --- |
| **랜덤 모드** | 무작위 유기견 배정 | "운명의 아이 만나기" 버튼 |

**유기견 카드 정보**:

- 대표 사진 1장
- 이름
- 나이
- 견종
- 위치 (국가/도시)
- 연락처 (전화번호/이메일 등)
- "다른 아이 보기" 버튼 (랜덤 재매칭)

**배치 방식**:

- 프레임의 `dogSlots` 위치에 자동 배치
- 보통 4컷 중 1컷 (첫 번째)

---

### 2.3.5 Step 3: 사용자 사진 업로드/촬영

**총 4컷 구성**:

- 유기견 사진: 1컷 (이미 배치됨)
- 사용자 사진: 3컷 (업로드 필요)

**입력 방식**:

| 방식 | 기술 | 설명 |
| --- | --- | --- |
| **카메라 촬영** | MediaDevices API | 실시간 웹캠/모바일 카메라 |
| **파일 업로드** | File Input | 갤러리에서 선택 |

**프리뷰**:

- 실시간 4컷 프리뷰
- "다시 찍기" / "다시 선택" 버튼

**파일 제한**:

- 형식: JPG, PNG, HEIC
- 최대 크기: 10MB/장

---

### 2.3.6 Step 4: 다운로드 & 공유

**결과물 생성**

**결과물 포함 요소**:

1. 4컷 사진 (유기견 1 + 사용자 3)
2. 프레임 디자인
3. **QR 코드** (하단 우측 코너, 100x100px)
4. 유기견 이름 (하단 좌측)
5. 해시태그 `#SecondChanceGlobal` `#AdoptDontShop`
6. 보호소 이름 (작게)

**공유 - Web share API**

**자동 생성 공유 텍스트**:

```
"🐾 {유기견 이름}와 함께한 인생네컷!
이 아이에게 두 번째 기회를 주세요 💛

📍 {위치}
🏠 {보호소 이름}

#SecondChanceGlobal #AdoptDontShop #유기견입양
#인생네컷 #FourFramesOneLife

👉 QR 코드를 스캔하면 {이름}의 프로필과 상세 내용을 볼 수 있어요!"

```

---

### 2.3.7 QR 코드 기능 상세

**QR 코드 URL 구조**:

```
https://secondchance.global/dog/{dogId}
```

**URL 파라미터**:

- `dogId`: 유기견 고유 ID

**스캔 시 플로우**:

```
QR 코드 스캔
    ↓
유기견 상세 페이지 로드
    ↓
"챌린지에서 왔어요" 배지 표시 ⭐
    ↓
공유/입양 문의 유도
```

**추적 데이터** (Analytics):

- `qr_scanned`: QR 스캔 횟수
- `challenge_conversion`: 챌린지 → 상세 페이지 전환율
- `challenge_to_share`: 챌린지 → 추가 공유 전환율

---

# 3. 페이지별 기능 명세 (참고용)

### 3.1 랜딩 페이지

**목적**: 첫 방문자 후킹 및 핵심 기능 안내

**섹션 구성**:

### Hero Section

- **헤드라인**: "Every Share is a Second Chance"
- **서브헤드**: "유기견과 함께하는 특별한 인생네컷 챌린지"
- **배경**: 유기견 사진 슬라이드쇼 (자동 전환, 3초)
- **CTA 버튼**:
    - 🎨 "챌린지 시작하기" (Primary)
    - 🐕 "유기견 만나기" (Secondary)

### Quick Stats (실시간 집계)

```
┌──────────────┬──────────────┬──────────────┐
│  총 공유 횟수  │  입양 성공    │  참여 국가    │
│   15,234회   │    127건     │    23개국    │
└──────────────┴──────────────┴──────────────┘

```

### How It Works (3단계 프로세스)

```
1️⃣ 챌린지 참여      2️⃣ SNS 공유        3️⃣ 입양 연결
   인생네컷 제작   →  친구들에게 공유  →  가족 만나기

```

### Success Stories (성공 사례)

- 카드 형식 (이미지 + 짧은 스토리)
- 예시: "이효리와 함께한 OO, 캐나다에서 새 가족을 만났어요"
- "더 많은 스토리 보기" 링크

### Featured Dogs (긴급 케이스)

- 3-4마리 강조 표시
- "긴급" 배지
- "지금 도와주기" 버튼

**기능**:

- 언어 선택 드롭다운 (Header)
- 스크롤 애니메이션
- 모바일 햄버거 메뉴

---

**단계별 UI**:

**Step 0 - 홈화면**:



**Step 1 - 프레임 선택**:

```
┌─────────────────────────────────┐
│  프레임을 선택하세요             │
│                                 │
│  [◄] [프레임1] [프레임2] ... [►] │
│                                 │
│         선택한 프레임             │
│      ┌─────────────┐            │
│      │             │            │
│      │  Preview    │            │
│      │             │            │
│      └─────────────┘            │
│                                 │
│      [이 프레임 사용하기]         │
└─────────────────────────────────┘

```

**Step 2 - 유기견 매칭**:

```
┌─────────────────────────────────┐
│  함께할 아이를 선택하세요         │
│                                 │
│  [운명의 아이 만나기] [직접 선택] │
│                                 │
│     ┌───────────────────┐       │
│     │   🐕 유기견 카드   │       │
│     │                   │       │
│     │  이름: 멍멍이       │       │
│     │  나이: 3살         │       │
│     │  위치: Seoul       │       │
│     │                   │       │
│     │  [다른 아이 보기]   │       │
│     │  [이 아이와 함께]   │       │
│     └───────────────────┘       │
└─────────────────────────────────┘

```

**Step 3 - 사진 업로드**:

```
┌─────────────────────────────────┐
│  사진을 추가하세요 (3/3)         │
│                                 │
│  ┌────┐  ┌────┐  ┌────┐        │
│  │ 🐕 │  │ 📷 │  │ 📷 │        │
│  │완료 │  │2/3 │  │3/3 │        │
│  └────┘  └────┘  └────┘        │
│                                 │
│  현재 슬롯: 2번                  │
│  ┌───────────────────┐          │
│  │                   │          │
│  │   촬영 / 업로드    │          │
│  │                   │          │
│  │   [📷 촬영하기]    │          │
│  │   [📁 파일 선택]   │          │
│  │                   │          │
│  └───────────────────┘          │
│                                 │
│  [위치 조정] [회전] [줌]         │
└─────────────────────────────────┘

```

**Step 4 - 다운로드**:

```
┌─────────────────────────────────┐
│  완성되었어요! 🎉                │
│                                 │
│     ┌───────────────────┐       │
│     │                   │       │
│     │   최종 결과물      │       │
│     │   (4컷 + QR)      │       │
│     │                   │       │
│     └───────────────────┘       │
│                                 │
│  [💾 다운로드] [📱 공유하기]     │
│                                 │
│  📊 이 챌린지로 {이름}이(가)     │
│   45명에게 더 알려졌어요!(추후 추가)      │
│                                 │
│  [다른 아이와 챌린지하기]         │
└─────────────────────────────────┘

```

**기능 요구사항**:

- 단계 간 자동 저장 (LocalStorage)
- 뒤로가기 지원
- 이탈 방지 (Step 3 이후)
- 모바일 터치 최적화

##  API 엔드포인트

### 1. 유기견 관련

```
GET    /api/dogs/:id          // 유기견 상세
GET    /api/dogs/random       // 랜덤 유기견

```

### 2. 챌린지 관련

```
POST   /api/challenge/:id/upload  // 4컷 사진 업로드 (48시간 이후 만료)

```

---

