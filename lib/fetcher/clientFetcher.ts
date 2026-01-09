import { CustomResponse } from "@/types";
import { coreFetcher, CoreFetcherOptions, HttpMethod } from "./coreFetcher";

function handleAuthFailure<T>(res: CustomResponse<T>) {
  if (
    !res.isOk &&
    res.status === 401 &&
    !window.location.pathname.startsWith("/auth")
  ) {
    window.location.href = "/auth/login";
  }
  return res;
}

async function responseWrapper<T, TBody>(
  method: HttpMethod,
  url: string,
  body: TBody | undefined,
  token?: string,
  options?: Omit<CoreFetcherOptions, "token">,
): Promise<CustomResponse<T>> {
  const res = await coreFetcher<T, TBody>(method, url, body, {
    ...options,
    token,
  });

  if (!res.isOk) {
    return handleAuthFailure(res);
  }

  return res;
}

export const clientFetcher = {
  get: async <T>(
    url: string,
    token?: string,
    options?: Omit<CoreFetcherOptions, "token">
  ) => responseWrapper<T, undefined>("GET", url, undefined, token, options),

  post: async <T, TBody = undefined>(
    url: string,
    data?: TBody,
    token?: string,
    options?: Omit<CoreFetcherOptions, "token">
  ) => responseWrapper<T, TBody>("POST", url, data, token, options),

  put: async <T, TBody = undefined>(
    url: string,
    data?: TBody,
    token?: string,
    options?: Omit<CoreFetcherOptions, "token">
  ) => responseWrapper<T, TBody>("PUT", url, data, token, options),

  patch: async <T, TBody = undefined>(
    url: string,
    data?: TBody,
    token?: string,
    options?: Omit<CoreFetcherOptions, "token">
  ) => responseWrapper<T, TBody>("PATCH", url, data, token, options),

  delete: async <T>(
    url: string,
    token?: string,
    options?: Omit<CoreFetcherOptions, "token">
  ) => responseWrapper<T, undefined>("DELETE", url, undefined, token, options),
};
