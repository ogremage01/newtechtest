# ========== 백엔드 빌드 ==========
FROM gradle:8-jdk17-alpine AS backend-build
WORKDIR /app
COPY backend/build.gradle.kts backend/settings.gradle.kts ./
COPY backend/src src
RUN gradle bootJar --no-daemon -x test

# ========== 프론트엔드 빌드 (동일 호스트 /api 사용 → baseURL 빈 값) ==========
FROM node:22-alpine AS frontend-build
WORKDIR /app
ENV NEXT_PUBLIC_API_URL=
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --ignore-scripts
COPY frontend/ .
RUN npm run build

# ========== 통합 런타임: 한 컨테이너에서 백엔드 + 프론트 + Nginx ==========
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache openjdk17-jre-headless nginx

# 백엔드 JAR
COPY --from=backend-build /app/build/libs/*.jar /app/backend/app.jar

# 프론트엔드 standalone
COPY --from=frontend-build /app/public /app/frontend/public
COPY --from=frontend-build /app/.next/standalone /app/frontend/
COPY --from=frontend-build /app/.next/static /app/frontend/.next/static

# Nginx 설정 및 시작 스크립트
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80

ENTRYPOINT ["/app/start.sh"]
