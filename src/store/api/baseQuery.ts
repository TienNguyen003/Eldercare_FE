import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import axiosInstance from '../../utils/axios';

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }): BaseQueryFn<{ url: string; method: AxiosRequestConfig['method']; data?: unknown; params?: unknown }, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data } };
    }
  };
