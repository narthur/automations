import { beforeEach,vi } from "vitest";

type MockResponse = {
  url?: string | RegExp;
  method?: string | string[];
  payload: unknown;
  ok?: boolean;
};

declare module "axios" {
  const __loadResponse: (response: MockResponse) => void;
}

let responses = new Array<{
  method: string;
  ok: boolean;
  payload: unknown;
  url: string | RegExp;
}>();

function factory(method: string) {
  return function handler(url: string) {
    const response = responses.find((r) => {
      if (r.method !== method) return false;
      if (typeof r.url === "string") return r.url === url;
      return r.url.test(url);
    });

    if (!response?.ok) {
      return Promise.reject(response?.payload);
    }

    return Promise.resolve(response?.payload);
  };
}

export const __loadResponse = ({
  url = /.+/,
  method = "get",
  ok = true,
  payload,
}: MockResponse) => {
  const methods = Array.isArray(method) ? method : [method];
  methods.forEach((m) => responses.unshift({ url, method: m, payload, ok }));
};

const get = factory("get");
const post = factory("post");

const axios: any = {
  get: vi.fn((url: string) => {
    return get(url);
  }),
  post: vi.fn((url: string) => {
    return post(url);
  }),
  create: vi.fn(() => axios),
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: vi.fn(),
    },
  },
};

beforeEach(() => {
  responses = [];
  axios.get.mockClear();
  axios.post.mockClear();
});

export default axios;
