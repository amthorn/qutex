/* eslint-disable no-magic-numbers */
import { request } from "./request.jsx";

const authCheck = ({ permission }) => 
    request(
        `/api/v1/auth/token/check${permission ? "?role=" + permission : ""}`,
        { method: "GET" },
        { notifications: false }
    );

const login = (email, password) =>
    request(
        "/api/v1/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
    ).then(({ response }) => response.status === 200);

const sendCode = (email) => 
    request(
        "/api/v1/auth/token/generate",
        { method: "POST", body: JSON.stringify({ email }) }
    ).then(({ response }) => response.status === 200);

const register = (code, password) =>
    request(
        "/api/v1/auth/register",
        { method: "POST", body: JSON.stringify({ code, password }) }
    ).then(({ response }) => response.status === 200);

const logout = () => 
    request("/api/v1/auth/logout", { method: "POST" }).then(({ response, data }) =>
        response.status === 200 && data.data.success === true
    );

export {
    authCheck,
    login,
    logout,
    register,
    sendCode,
};