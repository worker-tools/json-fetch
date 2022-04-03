export type Stringable = { toString(...args: any[]): string }
export type SearchParamsInit = URLSearchParams | [string, Stringable][] | Record<string, Stringable>;

// This could be it's own module...
export class SearchParamsURL extends URL {
  constructor(
    url: string | URL,
    params?: SearchParamsInit | null,
    base?: string | URL
  ) {
    super(url as string, base);
    const iterable = Array.isArray(params) || params instanceof URLSearchParams 
      ? params 
      : Object.entries(params ?? {});
    for (const [k, v] of iterable) 
      this.searchParams.append(k, v as string);
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