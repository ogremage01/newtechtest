### robots.txt / sitemap 작성 가이드

이 문서는 쇼핑몰 프론트엔드(Next.js)에서 검색 엔진용 `robots.txt`와 `sitemap.xml`을 어떻게 관리할지 정리한 가이드이다.

---

### 1. 현재 구조 개요

- **실제 응답 위치**
  - `robots.txt` 응답: `GET /robots.txt`
  - `sitemap.xml` 응답: `GET /sitemap.xml`
- **구현 파일**
  - `robots.txt` 정적 파일: `frontend/public/robots.txt`
  - `robots` 메타 라우트: `frontend/src/app/(meta)/robots.ts`
  - `sitemap` 메타 라우트: `frontend/src/app/(meta)/sitemap.ts`
- Next 13+ App Router 기준으로, 메타 라우트(`(meta)` 폴더)에서 **동적으로 robots/sitemap을 생성**하며, `public/robots.txt`는 기본값 또는 fallback 용도로 사용한다.

---

### 2. robots.txt 작성 요령

- **목표**
  - 기본적으로 서비스 페이지는 모두 크롤링 허용.
  - 관리자/내부 페이지 등은 크롤링 차단.
  - `sitemap.xml` 위치를 명시해서 검색 엔진이 사이트 구조를 빠르게 파악하도록 한다.

- **기본 포맷 예시 (`frontend/public/robots.txt`)**

```txt
User-agent: *
Allow: /
Disallow: /admin

Sitemap: /sitemap.xml
```

- **작성 원칙**
  - **User-agent**: 기본은 `*`로 모든 검색 엔진 대상.
  - **Allow**:
    - 전체 사이트 허용 시 `/` 하나만 명시하면 대부분의 경우 충분하다.
  - **Disallow**:
    - 어드민, 내부용 페이지 등 노출되면 안 되는 경로는 반드시 차단한다.
    - 예: `/admin`, `/internal`, `/api` 등 (실제 존재하는 경로만 추가).
  - **Sitemap**:
    - 가능한 한 루트 기준 상대 경로를 사용: `Sitemap: /sitemap.xml`
    - 도메인이 확정되어 있고, 별도 도메인에서 접근할 일이 많다면 절대경로도 허용: `Sitemap: https://example.com/sitemap.xml`

- **주의사항**
  - `Disallow` 할 경로를 잘못 추가하면 **전체 사이트가 비노출**될 수 있음.
    - 예: `Disallow: /` 를 추가하면 모든 경로 크롤링 불가.
  - 환경마다 정책이 달라야 한다면, 정적 파일보다는 **메타 라우트 (`robots.ts`)에서 조건 분기**로 처리하는 것을 우선 고려한다.

---

### 3. Next.js `robots.ts` 메타 라우트 작성 요령

- **위치**
  - `frontend/src/app/(meta)/robots.ts`

- **기본 구현 형태**

```ts
import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- **작성 포인트**
  - **`siteUrl`**:
    - `NEXT_PUBLIC_SITE_URL` 환경 변수를 사용해 **실제 서비스 도메인**으로 맞춘다.
    - 미설정 시 로컬 개발용 기본값: `http://localhost:3000`.
  - **`rules`**:
    - `userAgent`: `"*"` 이 기본. 특정 봇만 제어하고 싶으면 `"Googlebot"` 등으로 지정 가능.
    - `allow`: 문자열 또는 배열. `/`, `"/category"`, `"/blog"` 등 노출할 경로들.
    - `disallow`:
      - 배열로 여러 경로 지정 가능: `["/admin", "/internal"]`
      - 민감 정보, 관리자 UI, 비공개용 페이지는 반드시 disallow.
  - **`sitemap`**:
    - `sitemap: \`\${siteUrl}/sitemap.xml\`` 형태로 절대경로를 반환한다.
    - 여러 sitemap이 있을 경우 배열로 반환 가능.

- **운영 환경별 설정 팁**
  - 운영/스테이징을 나누고 싶다면, 환경 변수를 기준으로 분기:
    - 예: `process.env.NEXT_PUBLIC_ENV === "staging"` 일 때 `Disallow: /` 로 전체 크롤링 막기.

---

### 4. sitemap 메타 라우트 작성 요령

- **위치**
  - `frontend/src/app/(meta)/sitemap.ts`

- **현재 구현 개요**
  - 정적 페이지:
    - `/` (홈)
    - `/products`
    - `/cart`
  - 동적 페이지:
    - 백엔드 API `GET {API_SERVER_URL}/api/products` 결과를 기반으로
    - 각 상품에 대해 `/products/{id}` 페이지를 sitemap에 포함.

- **기본 구현 패턴**

```ts
import { MetadataRoute } from "next";
import { getServerApiBaseUrl } from "@/lib/server-api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const products = await res.json();
      productPages = (Array.isArray(products) ? products : []).map((p: { id: string }) => ({
        url: `${siteUrl}/products/${p.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // API 불가 시 동적 페이지는 sitemap에서 생략 (빌드/요청 시점 API 장애 대비)
  }

  return [...staticPages, ...productPages];
}
```

- **작성 포인트**
  - **`siteUrl`**:
    - `robots.ts`와 동일하게 `NEXT_PUBLIC_SITE_URL` 기반으로 유지.
  - **정적 페이지 배열 (`staticPages`)**:
    - 메뉴 구조, 주요 랜딩 페이지 등 **검색 노출이 중요한 페이지**를 모두 포함한다.
    - `changeFrequency`, `priority`는 가이드 값일 뿐이며, 실제 크롤링 빈도는 검색 엔진이 결정한다.
  - **동적 페이지 (`productPages` 등)**:
    - 백엔드 API에서 ID 리스트를 가져와 URL을 생성한다.
    - API 장애 시 전체 sitemap 응답이 실패하지 않도록 `try/catch` 로 감싸고, 실패 시 해당 부분만 생략한다.
  - **캐싱 / 재검증 (`next: { revalidate }`)**:
    - 상품 데이터 변경 주기에 맞춰 `revalidate` 초를 조정한다.
    - 예: 1시간마다 상품이 많이 바뀌지 않으면 `3600`(1시간) 정도로 유지.

---

### 5. 변경 시 체크리스트

- **robots.txt 수정 시**
  - [ ] `Disallow` 경로에 `/` 전체 차단이 들어가 있지 않은지 확인.
  - [ ] 신규로 막은 경로가 실제로 **일반 사용자가 접근할 필요 없는지** 재확인.
  - [ ] `Sitemap:` 경로가 실제 동작하는 `sitemap.xml`과 일치하는지 확인.

- **sitemap.ts 수정 시**
  - [ ] `NEXT_PUBLIC_SITE_URL` 이 운영 도메인으로 올바르게 설정되어 있는지.
  - [ ] 주요 정적 페이지(메뉴, 랜딩, 카테고리 등)가 누락되지 않았는지.
  - [ ] 동적 페이지용 API가 크게 변경되면, URL 생성 로직도 함께 수정했는지.
  - [ ] API 장애 시에도 sitemap 전체가 500이 나가지 않도록 `try/catch` 가 유지되는지.

---

### 6. 운영 환경 적용 팁

- **환경 변수**
  - `NEXT_PUBLIC_SITE_URL`: `https://{운영 도메인}` 으로 반드시 설정.
  - `API_SERVER_URL`: `sitemap.ts`에서 사용하는 백엔드 API 베이스 URL.
- **점검 방법**
  - 로컬/스테이징에서:
    - `curl http://localhost:3000/robots.txt`
    - `curl http://localhost:3000/sitemap.xml`
  - 실제 응답을 확인하여, 설정한 정책/URL이 정확히 반영되었는지 검증한다.

