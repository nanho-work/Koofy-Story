# 쿠피 스토리

Next.js와 TypeScript로 만든 쿠피랩의 웹 독서 서비스다. 작품 목록은 /ko, /en, /ja에 있고, 작품과 회차는 기존 쿠피리더 콘텐츠 ID로 연결한다.

- app/은 언어별 목록, 작품 상세, 회차 읽기 경로를 담당한다.
- components/는 공통 헤더, 표지, 작품 구분을 담당한다.
- lib/는 화면 문구, 주소 생성, 공개 콘텐츠 API 요청을 담당한다.

## 로컬 실행

```sh
npm ci
npm run dev
npm run build
```

기본 API는 Koofy-Reader의 Firebase 함수 readerStory다. 로컬 테스트에서 다른 API를 쓸 때만 서버 환경변수 READER_STORY_URL을 지정한다.

## 운영 반영

1. Koofy-Reader에서 readerAdmin, readerStory 함수를 배포한다.
2. Quiz_Site 관리자를 배포하고 도서·회차별 **웹 공개**를 켠다. 앱에서 공개 또는 예약한 자료만 설정할 수 있고, 예약 일시가 지나면 웹에 나타난다. 연재와 월간호는 해당 언어의 첫 웹 공개 회차가 나타날 때 작품 목록에 들어간다.
3. Koofy-Story를 Vercel에 배포한다. 기존 웹 공개 상태를 그대로 확인하도록 페이지는 요청 시 서버에서 조회한다.

본문은 관리자에서 웹 공개를 켤 때 TXT 원본 또는 EPUB 본문을 변환해 저장한다. 웹에서는 텍스트와 등록된 표지·회차 이미지를 표시한다.
