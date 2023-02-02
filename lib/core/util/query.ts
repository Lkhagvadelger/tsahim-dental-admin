import { QueryClient } from "react-query";
import fetch from "cross-fetch";
import { AppError } from "./errors";

// For interacting with the React Query cache
export const queryClient = new QueryClient();

const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
  },
  mode: "cors" as RequestMode,
  credentials: "include" as RequestCredentials,
  includeCredentials: true,
};

const handleResponse = (response: Response) => {
  return response.json().then((json) => {
    if (response.status >= 400) {
      // TODO: automatically signout user if session is no longer valid
      throw new AppError(response.status, json.message, json.translationKey);
    } else {
      return json;
    }
  });
};

const getPath = (subpath: string) => {
  return subpath.startsWith("http") ? subpath : `/api/${subpath}`;
};

export const fetcher = {
  get: (subpath = "", data = {}, additionalOptions = {}) => {
    const params = new URLSearchParams(data).toString();
    const path = getPath(`${subpath}${params ? `?${params}` : ""}`);
    const options = { ...defaultOptions, method: "GET", ...additionalOptions };

    return fetch(path, options).then(handleResponse);
  },
  post: (subpath = "", data = {}, additionalOptions = {}) => {
    const path = getPath(subpath);
    const body = JSON.stringify(data);
    const options = {
      ...defaultOptions,
      method: "POST",
      body,
      ...additionalOptions,
    };

    return fetch(path, options).then(handleResponse);
  },
  put: (subpath = "", data = {}, additionalOptions = {}) => {
    const path = getPath(subpath);
    const body = JSON.stringify(data);
    const options = {
      ...defaultOptions,
      method: "PUT",
      body,
      ...additionalOptions,
    };

    return fetch(path, options).then(handleResponse);
  },
  patch: (subpath = "", data = {}, additionalOptions = {}) => {
    const path = getPath(subpath);
    const body = JSON.stringify(data);
    const options = {
      ...defaultOptions,
      method: "PATCH",
      body,
      ...additionalOptions,
    };

    return fetch(path, options).then(handleResponse);
  },
  delete: (subpath = "", data = {}, additionalOptions = {}) => {
    const path = getPath(subpath);
    const body = JSON.stringify(data);
    const options = {
      ...defaultOptions,
      method: "DELETE",
      body,
      ...additionalOptions,
    };

    return fetch(path, options).then(handleResponse);
  },
};
