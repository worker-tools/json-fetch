export class SearchParamsURL extends URL {
  constructor(
    url: string | URL,
    params: URLSearchParams | string[][] | Record<string, string> = {},
    base: string | URL
  ) {
    super(url.toString(), base);
    const iterable = Array.isArray(params) || params instanceof URLSearchParams ? params : Object.entries(params);
    for (const [k, v] of iterable) this.searchParams.append(k, v);
  }
}

export {
  SearchParamsURL as SearchURL,
  SearchParamsURL as ParamsURL,
}

export type JSONBodyInit = object | BodyInit;
export type JSONRequestInit = { body?: JSONBodyInit | null } & Omit<RequestInit, 'body'>;

function isBodyInit(b: JSONBodyInit) {
  return (
    b == null ||
    typeof b === 'string' ||
    (typeof Blob !== 'undefined' && b instanceof Blob) ||
    (typeof ArrayBuffer !== 'undefined' && (b instanceof ArrayBuffer || ArrayBuffer.isView(b))) ||
    (typeof FormData !== 'undefined' && b instanceof FormData) ||
    (typeof URLSearchParams !== 'undefined' && b instanceof URLSearchParams) ||
    (typeof ReadableStream !== 'undefined' && b instanceof ReadableStream)
  );
}

export class JSONRequest extends Request {
  static contentType = 'application/json;charset=UTF-8';
  static accept = 'application/json, text/plain, */*';

  constructor(
    input: RequestInfo | URL,
    init?: JSONRequestInit,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number,
  ) {
    const { headers: h, body: b, ...i } = init || {};

    const bi = isBodyInit(b);
    const body = bi ? b as BodyInit : JSON.stringify(b, replacer, space);

    const headers = new Headers(h);
    if (!headers.has('Content-Type') && !bi) headers.set('Content-Type', JSONRequest.contentType);
    if (!headers.has('Accept')) headers.set('Accept', JSONRequest.accept);

    super(input instanceof URL ? input.toString() : input, { headers, body, ...i });
  }
}

export class JSONResponse extends Response {
  static contentType = 'application/json;charset=UTF-8';

  constructor(
    body: JSONBodyInit | null,
    init?: ResponseInit,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number,
  ) {
    const { headers: h, ...i } = init || {};

    const bi = isBodyInit(body)
    const b = bi ? body as BodyInit : JSON.stringify(body, replacer, space);

    const headers = new Headers(h);
    if (!headers.has('Content-Type') && !bi) headers.set('Content-Type', JSONResponse.contentType);

    super(b, { headers, ...i });
  }
}

/** @deprecated Use SearchParamsURL instead */
export const urlWithParams = (
  url: string | URL,
  params: { [name: string]: string },
  base: string | URL
) => {
  return new SearchParamsURL(url, params, base).href;
}

export function jsonFetch(
  input: RequestInfo | URL,
  init?: JSONRequestInit,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number,
) {
  return fetch(new JSONRequest(input, init, replacer, space));
}

// function isPOJO(arg) {
//   if (arg == null || typeof arg !== 'object') {
//     return false;
//   }
//   const proto = Object.getPrototypeOf(arg);
//   if (proto == null) {
//     return true; // `Object.create(null)`
//   }
//   return proto === Object.prototype;
// }
