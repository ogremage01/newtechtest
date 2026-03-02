import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** axios 인스턴스. 인터셉터 등이 필요할 때 사용 */
export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** 요청 시 저장된 JWT를 Authorization 헤더에 붙임 (클라이언트 전용). */
apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

/** 래퍼: 응답 body만 반환. 호출부에서 .data 불필요. */
export const api = {
  get: <T>(path: string): Promise<T> =>
    apiClient.get(path).then((res) => res.data),
  post: <T>(path: string, body: unknown): Promise<T> =>
    apiClient.post(path, body).then((res) => res.data),
};

/** axios 4xx/5xx 에러에서 서버 메시지 추출. messageCode 우선(i18n 키), 없으면 message(문자열) */
export function getApiErrorMessage(err: unknown): string | undefined {
  if (!axios.isAxiosError(err) || !err.response?.data || typeof err.response.data !== "object") return undefined;
  const data = err.response.data as { messageCode?: string; message?: string };
  if (data.messageCode) return data.messageCode;
  if (data.message) return data.message;
  return undefined;
}
