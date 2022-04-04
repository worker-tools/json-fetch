import 'https://gist.githubusercontent.com/qwtel/b14f0f81e3a96189f7771f83ee113f64/raw/TestRequest.ts'
import {
  assert,
  assertExists,
  assertEquals,
  assertStrictEquals,
  assertStringIncludes,
  assertThrows,
  assertRejects,
  assertArrayIncludes,
} from 'https://deno.land/std@0.133.0/testing/asserts.ts'
const { test } = Deno;

import { JSONRequest, JSONResponse } from '../index.ts'

test('exists', () =>{
  assertExists(JSONRequest)
  assertExists(JSONResponse)
})

test('exists II', () =>{
  assertExists(new JSONRequest('/'))
  assertExists(new JSONResponse())
})

test('instanceof request/response ', () =>{
  assert(new JSONRequest('/') instanceof Request)
  assert(new JSONResponse('/') instanceof Response)
})

test('stringify ', async () =>{
  assertEquals(await new JSONRequest('/', { method: 'POST', body: { foo: 'bar' } }).json(), { foo: 'bar' })
  assertEquals(await new JSONResponse({ foo: 'bar' }).json(), { foo: 'bar' })
})

test('headers', () => {
  assertStringIncludes(new JSONRequest('/', { method: 'POST', body: { foo: 'bar' } }).headers.get('content-type'), 'application/json')
  assertStringIncludes(new JSONRequest('/', { method: 'POST', body: { foo: 'bar' } }).headers.get('accept'), 'application/json')
  assertStringIncludes(new JSONResponse({ foo: 'bar' }).headers.get('content-type'), 'application/json')
})

test('non json data', () => {
  assertStringIncludes(new JSONRequest('/', { method: 'POST', body: new FormData() }).headers.get('content-type'), 'multipart/form-data')
  assertStringIncludes(new JSONRequest('/', { method: 'POST', body: new FormData() }).headers.get('accept'), 'application/json')
  assertStringIncludes(new JSONResponse(new FormData()).headers.get('content-type'), 'multipart/form-data')
})

