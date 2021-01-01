# JSON Fetch

A drop-in replacements for `fetch`, `Request`, and `Response` with first class support for JSON objects.

Unlike other HTTP libraries, this one stays as close as possible to the original Fetch API, 
while improving the ergonomics the most common use case:

Before:

```ts
const response = await fetch('/some', { 
  method: 'POST',
  body: JSON.stringify(json), 
  headers: {
    'Content-Type': 'application/json',
  },
});
```

After:

```ts
import { JSONRequest } from '@werker/json-fetch';

const response = await fetch(new JSONRequest('/some', { 
  method: 'POST', 
  body: json,
}));
```

You can also use the updated `jsonFetch` function:

```ts
import { jsonFetch as fetch } from '@werker/json-fetch';

const response = await fetch('/some', { method: 'POST', body: data })
```

Note that previous use cases remain intact, i.e. posting `FormData`, `ReadableStream`, etc. as body works:

```ts
const response = await fetch(new JSONRequest('/some', { 
  method: 'POST', 
  body: new FromData(form),
}))
```

This will send the body as form-data/multipart with correct content type header, as in the original Fetch API. 
Only difference is that the `Accept` header will be set to indicate preference for `application/json`, i.e. anticipating a JSON response from the server.
