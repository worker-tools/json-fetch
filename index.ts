// deno-lint-ignore-file no-cond-assign
// deno-lint-ignore no-explicit-any
export type JSONBodyInit = BodyInit | any;
export type JSONRequestInit = { body?: JSONBodyInit | null } & Omit<RequestInit, 'body'>;

/**
 * Tests is the argument is a Fetch API `BodyInit`. 
 * Assumed to be `JSONValue` otherwise.
 */
function isBodyInit(b?: JSONBodyInit): b is BodyInit {
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
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ) {
    const { headers: _headers, body: _body, ..._init } = init || {};

    let isBI: boolean
    const body = (isBI = isBodyInit(_body))
      ? _body
      : JSON.stringify(_body, replacer, space);

    const headers = new Headers(_headers);
    if (!headers.has('Content-Type') && !isBI)
      headers.set('Content-Type', JSONRequest.contentType);
    if (!headers.has('Accept'))
      headers.set('Accept', JSONRequest.accept);

    super(input instanceof URL ? input.href : input, { headers, body, ..._init });
  }
}

export class JSONResponse extends Response {
  static contentType = 'application/json;charset=UTF-8';

  constructor(
    body?: JSONBodyInit | null,
    init?: ResponseInit,
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ) {
    const { headers: _headers, ..._init } = init || {};

    let isBI: boolean
    const _body = (isBI = isBodyInit(body))
      ? body
      : JSON.stringify(body, replacer, space);

    const headers = new Headers(_headers);
    if (!headers.has('Content-Type') && !isBI)
      headers.set('Content-Type', JSONResponse.contentType);

    super(_body, { headers, ..._init });
  }
}

export function jsonFetch(...args: ConstructorParameters<typeof JSONRequest>) {
  return fetch(new JSONRequest(...args));
}

export * from './search-params-url.ts'
