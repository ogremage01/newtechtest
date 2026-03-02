# 쇼핑몰 풀스택 프로젝트

Next.js (App Router) + Spring Boot 기반 중소형 쇼핑몰 클론 프로젝트입니다.

## 구조

- `frontend/` - Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 3.x + Radix UI + Zustand
- `backend/` - Spring Boot 4 + Java 17 + JWT + MariaDB/H2 (Gradle 8.14)

## 사전 요구사항

- Node.js 18+
- Java 17+
- (선택) MariaDB — 기본값은 **dev** 프로필(H2 인메모리)이라 DB 설치 없이 실행 가능

## 실행 방법

### 백엔드

1. **DB 없이 실행 (기본)**  
   별도 설정 없이 실행하면 **dev** 프로필로 H2 인메모리 DB를 사용합니다.

   ```bash
   cd backend
   ./gradlew bootRun
   ```
   (Windows: `gradlew.bat bootRun`)

2. **MariaDB 사용 시**  
   - MariaDB에 `shop` DB 생성  
   - 환경 변수: `SPRING_PROFILES_ACTIVE=default`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`  
   - 또는 `application.yml`의 기본 datasource 설정에 맞게 DB 준비 후  
     `SPRING_PROFILES_ACTIVE=default` 로 실행

3. 기타 환경 변수 (선택):
   - `DB_URL` - JDBC URL (기본: `jdbc:mariadb://localhost:3306/shop`)
   - `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET` - 32자 이상 시크릿 (운영 환경 필수)
   - `CORS_ORIGINS` - 프론트 origin (기본: `http://localhost:3000`)

   API: http://localhost:2602 (기본)

### 프론트엔드

1. 의존성 설치 및 실행:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. 브라우저: http://localhost:3000

3. API 연동: `NEXT_PUBLIC_API_URL` 미설정 시 기본 `http://localhost:2602` 사용.  
   배포 시 `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` 설정.

## 환경 변수 요약

| 위치     | 변수                   | 설명                    |
|----------|------------------------|-------------------------|
| backend  | DB_URL                 | MariaDB JDBC URL        |
| backend  | DB_USERNAME / DB_PASSWORD | DB 계정             |
| backend  | JWT_SECRET             | JWT 서명 시크릿 (32자+)  |
| backend  | CORS_ORIGINS           | 허용 프론트 origin      |
| frontend | NEXT_PUBLIC_API_URL    | 백엔드 API URL          |
| frontend | NEXT_PUBLIC_SITE_URL   | 사이트 URL (sitemap 등)  |

## API 엔드포인트

- `GET /api/products` - 상품 목록
- `GET /api/products/{id}` - 상품 상세
- `GET /api/products/search?q=검색어` - 상품 검색 (이름 기준)
- `POST /api/auth/login` - 로그인 (JWT 발급)
- `POST /api/auth/register` - 회원가입

## 검색 UI (SearchBar) — 페이지별 다른 API

`SearchBar`는 **페이지마다 다른 백엔드 검색 API**를 쓰도록 설계되어 있습니다.  
각 페이지에서 `searchApiPath`와 `onSearchResults`만 넘기면 됩니다.

- **의존성**: API **경로**(예: `/api/products/search`, `/api/orders/search`)를 **props**로 받습니다.  
  백엔드 base URL은 `NEXT_PUBLIC_API_URL`로 이미 `lib/api`에서 처리하므로, SearchBar에는 **path만** 넘기면 됩니다.
- 예: 홈은 `SearchBarHome`에서 `/api/products/search` 사용 후 `/products?q=...`로 이동,  
  상품 목록 페이지는 같은 path로 검색 결과만 갱신,  
  주문 관리 페이지는 `/api/orders/search` 등 다른 path 사용 가능.

## Redis로 검색 캐시 (선택)

검색 결과를 Redis에 두려면 **백엔드**에서만 처리하면 됩니다. 프론트는 동일한 검색 API를 호출합니다.

1. **의존성 추가** (`backend/build.gradle.kts`):
   - `implementation("org.springframework.boot:spring-boot-starter-data-redis")`
2. **설정**: `spring.data.redis.host`, `port` 등 설정.
3. **캐시 적용**: 검색 메서드에 `@Cacheable` 사용.  
   예: `ProductService.searchByName`에  
   `@Cacheable(value = "productSearch", key = "#name", unless = "#result.isEmpty()")`  
   그리고 `@EnableCaching` + Redis 캐시 매니저 설정.

이렇게 하면 동일 검색어 재요청 시 DB 대신 Redis에서 반환할 수 있습니다.

## Docker

- **통합 앱** (백엔드+프론트 한 컨테이너): `docker compose up -d app` → http://localhost
- **backend/frontend 분리**: `docker compose up -d` → API 2603, 프론트 3001
- 상세: `docker-compose.yml`, `docker/Dockerfile` 참고. 현재는 **H2 인메모리** 사용(테스트용).

## 운영·인수인계

**관리 책임 이관** 시 다음 문서를 사용하세요.

- **[docs/HANDOVER-ACTIONS.md](docs/HANDOVER-ACTIONS.md)** — **인수인계하는 사람(나)이 할 일** — 소스·Docker·SSH 넘기는 순서와 체크리스트
- **[docs/OPERATIONS.md](docs/OPERATIONS.md)** — 운영 가이드·새 관리자가 받은 뒤 참고할 내용 (서버, 레지스트리, 시크릿, 로그 등)
