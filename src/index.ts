export type JSONPrimitive = string | number | boolean | null;
export type JSONable = { toJSON: (k?: string) => JSONValue };
export type JSONObject = { [k: string]: JSONValue };
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray | JSONable;

export type JSONBodyInit = JSONValue | BodyInit;
export type JSONRequestInit = { body?: JSONBodyInit | null } & Omit<RequestInit, 'body'>;

/**
 * Tests is the argument is a Fetch API `BodyInit`. 
 * Assumed to be `JSONValue` otherwise.
 */
function isBodyInit(b: JSONBodyInit): b is BodyInit {
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
    const { headers: h, body: b, ...i } = init || {};

    let isBI: boolean
    const body = (isBI = isBodyInit(b))
      ? b
      : JSON.stringify(b, replacer, space);

    const headers = new Headers(h);
    if (!headers.has('Content-Type') && !isBI)
      headers.set('Content-Type', JSONRequest.contentType);
    if (!headers.has('Accept'))
      headers.set('Accept', JSONRequest.accept);

    super(input instanceof URL ? input.href : input, { headers, body, ...i });
  }
}

export class JSONResponse extends Response {
  static contentType = 'application/json;charset=UTF-8';

  constructor(
    body: JSONBodyInit | null,
    init?: ResponseInit,
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ) {
    const { headers: h, ...i } = init || {};

    let isBI: boolean
    const b = (isBI = isBodyInit(body))
      ? body
      : JSON.stringify(body, replacer, space);

    const headers = new Headers(h);
    if (!headers.has('Content-Type') && !isBI)
      headers.set('Content-Type', JSONResponse.contentType);

    super(b, { headers, ...i });
  }
}

export function jsonFetch(...args: ConstructorParameters<typeof JSONRequest>) {
  return fetch(new JSONRequest(...args));
}

export * from './search-params-url'
