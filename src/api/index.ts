import { isEmpty } from 'lodash';
import { rootStore } from '../store';
import { IParams, IResponse } from '../types/query';

const baseUrl = '/api';

export async function makeQuery<T>(
  url: string,
  method: 'DELETE' | 'PUT' | 'PATCH' | 'POST' | 'GET' = 'GET',
  data: Record<string, unknown> = {},
  params: IParams = {},
  headers: Record<string, string> = {}
): Promise<IResponse<T>> {
  const isLeadingSlash = url[0] === '/';
  let _url = baseUrl + (isLeadingSlash ? '' : '/') + url;

  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    searchParams.append(key, JSON.stringify(params[key]));
  });

  _url += searchParams.toString() ? `?${searchParams.toString()}` : '';
  const _headers = new Headers({
    'Content-Type': 'application/json',
    ...headers,
  });

  if (rootStore.user.access_token) {
    _headers.set('Authorization', `Bearer ${rootStore.user.access_token}`);
  }

  const response = await fetch(_url, {
    method,
    headers: _headers,
    body: !isEmpty(data) ? JSON.stringify(data) : undefined,
  });

  if (response.status === 401) {
    rootStore.user.logout();
  }

  return {
    ok: response.ok,
    status: response.status,
    data: await response.json(),
  };
}
