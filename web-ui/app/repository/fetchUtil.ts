/**
 * @prettier
 */

const Cookies = require("js-cookie");

const XSRF_COOKIE_NAME = "XSRF-TOKEN";
const XSRF_HEADER_NAME = "X-XSRF-TOKEN";

let xsrfToken: string;

export const getJsonResponse = (path: string) => {
  return fetch(path, {
    method: "GET"
  }).then(response => {
    preprocessResponse(response);
    return response.json();
  });
};

export const postFormdataJsonResponse = (path: string, formData: FormData) => {
  return fetch(path, {
    method: "POST",
    body: formData,
    headers: {
      [XSRF_HEADER_NAME]: xsrfToken
    }
  }).then(response => {
    preprocessResponse(response);
    return response.json();
  });
};

export const postJsonWithJsonResponse = (path: string, body: object) => {
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      [XSRF_HEADER_NAME]: xsrfToken
    }
  }).then(response => {
    preprocessResponse(response);
    return response.json();
  });
};

export const deleteWithFormdataAndJsonResponse = (path: string, formData: FormData) => {
    return fetch(path, {
        method: "DELETE",
        body: formData,
        headers: {
          [XSRF_HEADER_NAME]: xsrfToken
        }
    }).then(response => {
        preprocessResponse(response);
        return response.json();
    })
}

export const postRawResponse = (path: string) => {
    return fetch(path, {
        method: "POST",
        headers: {
            [XSRF_HEADER_NAME]: xsrfToken 
        }
    }).then(response => {
        preprocessResponse(response);
        return response;
    })
}

export const getRawResponse = (path: string) => {
    return fetch(path)
    .then(response => {
        preprocessResponse(response)
        return response;
    })
}

export const muiltipartJson = (values: object): Blob => {
  return new Blob([JSON.stringify(values)], {type: "application/json"});
}

function preprocessResponse(response: Response) {
    if (response.status === 403){
       window.location.assign("/");
    }

    xsrfToken = Cookies.get(XSRF_COOKIE_NAME);
}
