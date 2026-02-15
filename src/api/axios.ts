import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../stores/useAuthStore';
import type { ReissueAccessTokenResponse } from '../types/api/auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 토큰 재발급용 별도 axios 인스턴스 (interceptor 없이, 순환 참조 방지)
export const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 토큰 재발급 중인지 추적
let isRefreshing = false;
// 재발급 대기 중인 요청들을 저장
let failedQueue: Array<{
  resolve: (value?: string) => void;
  reject: (error?: unknown) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: AxiosError | null, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // 재발급 API 자체가 401을 반환한 경우는 재시도하지 않음
      if (originalRequest.url?.includes('/auth/reissue/accessToken')) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      // 이미 재발급 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 재발급 시도 (별도 인스턴스 사용으로 순환 참조 방지)
        const response = await refreshApi.post<ReissueAccessTokenResponse>(
          '/auth/reissue/accessToken'
        );
        
        if (response.data.resultType === 'SUCCESS' && response.data.success?.accessToken) {
          const newAccessToken = response.data.success.accessToken;
          const { setAccessToken, role } = useAuthStore.getState();
          
          // 새 토큰 저장 (role은 기존 것 유지)
          setAccessToken(newAccessToken, role || undefined);
          
          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken);
          
          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        } else {
          // 재발급 실패
          useAuthStore.getState().clearAuth();
          processQueue(error as AxiosError);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // 재발급 요청 자체가 실패한 경우
        useAuthStore.getState().clearAuth();
        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
