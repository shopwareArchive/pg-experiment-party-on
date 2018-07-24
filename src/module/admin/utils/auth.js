import axios from 'axios';
import Router from 'vue-router';
import decode from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'access_token';
const ACCESS_TOKEN_TYPE_KEY = 'token_type';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const USERNAME_STORAGE_KEY = 'USERNAME';

const router = new Router({
    mode: 'history'
});

export {
    requireAdmin,
    logoutAdmin,
    loginAdmin,
    isAdmin,
    isTokenExpired,
    getHeaderData,
    getUsername
};

function requireAdmin(to, from, next) {
    if (!isAdmin()) {
        next({
            name: 'admin-login',
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
}

function logoutAdmin() {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_STORAGE_KEY);
}

function isAdmin() {
    return isTokenAvailable() && isAdminToken();
}

function loginAdmin(username, password, redirectTo) {
    const auth = {};
    auth.client_id = 'administration';
    auth.grant_type = 'password';
    auth.username = username;
    auth.password = password;
    auth.scopes = 'read';

    return axios.post(`${process.env.API_ENDPOINT}/api/oauth/token`, auth)
        .then((response) => {
            setAccessToken(response.data.access_token);
            setAccessTokenType(response.data.token_type);
            setRefreshToken(response.data.refresh_token);
            setUsername(username);

            if (!redirectTo) {
                return;
            }

            router.go(redirectTo);
        });
}

function refreshAdminToken() {
    const auth = {};
    auth.client_id = 'administration';
    auth.grant_type = 'refresh_token';
    auth.refresh_token = getRefreshToken();
    auth.scopes = 'read';

    return axios.post(`${process.env.API_ENDPOINT}/api/oauth/token`, auth)
        .then((response) => {
            setAccessToken(response.data.access_token);
            setAccessTokenType(response.data.token_type);
            setRefreshToken(response.data.refresh_token);
        });
}

function setRefreshToken(refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

function setUsername(username) {
    sessionStorage.setItem(USERNAME_STORAGE_KEY, username);
}

function getUsername() {
    return sessionStorage.getItem(USERNAME_STORAGE_KEY);
}

function isTokenAvailable() {
    const accessToken = getAccessToken();
    return accessToken && getAccessTokenType() && getRefreshToken() && !isTokenExpired(accessToken);
}

function isAdminToken() {
    const accessToken = getAccessToken();
    const token = decode(accessToken);

    return token.aud === 'administration';
}

function getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) {
        return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}

function isTokenExpired(token) {
    const expirationDate = getTokenExpirationDate(token);
    return expirationDate < new Date();
}

// Get and store access_token in local storage
function setAccessToken(accessToken) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessTokenType(tokenType) {
    sessionStorage.setItem(ACCESS_TOKEN_TYPE_KEY, tokenType);
}

function getAccessTokenType() {
    return sessionStorage.getItem(ACCESS_TOKEN_TYPE_KEY);
}

function getHeaderData() {
    if (!isAdmin()) {
        refreshAdminToken();
    }

    const authType = getAccessTokenType();
    const authToken = getAccessToken();
    const data = {
        Authorization: `${authType} ${authToken}`,
        Accept: 'application/vnd.api+json'
    };

    return { headers: data };
}
