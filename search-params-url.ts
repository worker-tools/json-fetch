// deno-lint-ignore no-explicit-any
export type SearchParamsInit = [string, any][] | Record<string, any> | string | URLSearchParams;

// This could be it's own module...
/**
 * Like `URL`, but accepts a `params` argument that is added to the search parameters/query string.
 */
export class SearchParamsURL extends URL {
  constructor(
    url: string | URL,
    params?: SearchParamsInit | null,
    base?: string | URL
  ) {
    super(url as string, base);
    const iterable = Array.isArray(params) || params instanceof URLSearchParams 
      ? params 
      : typeof params === 'string'
        ? new URLSearchParams(params)
        : Object.entries(params ?? {})
    for (const [k, v] of iterable) 
      this.searchParams.append(k, v.toString());
  }
}

export {
  SearchParamsURL as SearchURL,
  SearchParamsURL as ParamsURL,
}

/** @deprecated Use SearchParamsURL instead */
export const urlWithParams = (...args: ConstructorParameters<typeof SearchParamsURL>) => {
  return new SearchParamsURL(...args).href;
}