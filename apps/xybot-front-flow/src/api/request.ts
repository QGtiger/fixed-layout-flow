import { AxiosRequestConfig } from 'axios';
import { client } from '.';

export const request = async <T = any>(
  options: AxiosRequestConfig,
  interceptConfig?: {
    hideMessage?: boolean;
  },
): Promise<{ success: boolean; data?: T; code: number; errorMsg?: string }> => {
  return client({
    ...options,
    data: {
      ...options.data,
      interceptConfig,
    },
  });
};

interface BaseResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message?: string;
  msg?: string;
}

interface PageResponse<T> {
  code: number;
  data: T;
  page: {
    total: number;
    size: number;
    page: number;
    pages: number;
    offset: number;
    order: 'desc' | 'asc';
  };
  success: boolean;
  msg?: string;
}
