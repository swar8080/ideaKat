const API_PATH = "/api";
export const LOGIN_API_PATH = "/public/api/login";
export const REGISTER_API_PATH = "/public/api/register";
export const USER_API_PATH = "/api/user";
export const ADMIN_API_PATH = "/admin/api";

const makeUrl = (prefix: string, path: string) => {
    return `${prefix}${path.startsWith("/")? "" : "/"}${path}`;
} 

export const apiUrl = (path: string) => makeUrl(API_PATH, path);
export const loginApiUrl = (path: string) => makeUrl(LOGIN_API_PATH, path);
