interface URLSearchParams {
  [Symbol.iterator](): Iterator<[string, string]>
}

interface Headers {
  [Symbol.iterator](): Iterator<[string, string]>
}

interface FormData {
  [Symbol.iterator](): Iterator<[string, FormDataEntryValue]>
}