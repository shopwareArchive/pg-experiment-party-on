import axios from 'axios';
import Router from 'vue-router';

const CONTEXT_TOKEN = 'x-sw-context-token';
const LOGIN_FLAG = 'LOGIN';

const router = new Router({
    mode: 'history'
});

export {
    login,
    logout,
    getHeaderData,
    clearAccessToken,
    setContextToken,
    getContextToken,
    isLoggedIn
};

function login(username, password) {
    const auth = {};
    auth.username = username;
    auth.password = password;
    const headers = getHeaderData();

    return axios.post(`${process.env.API_ENDPOINT}/storefront-api/customer/login`, auth, headers)
        .then((response) => {
            setLoginFlag();
            setContextToken(response.data['x-sw-context-token']);
        });
}

function isLoggedIn() {
    return getLoginFlag() && getContextToken() && getContextToken().length > 0;
}

function logout() {
    clearAccessToken();

    router.go(0);
}

function getHeaderData() {
    const data = {};

    data['x-sw-access-key'] = process.env.ACCESS_KEY;
    if (getContextToken()) {
        data['x-sw-context-token'] = getContextToken();
    }

    return { headers: data };
}

function setContextToken(contextToken) {
    sessionStorage.setItem(CONTEXT_TOKEN, contextToken);
}

function getContextToken() {
    return sessionStorage.getItem(CONTEXT_TOKEN);
}

function clearAccessToken() {
    sessionStorage.removeItem(CONTEXT_TOKEN);
    sessionStorage.removeItem(LOGIN_FLAG);
}

function setLoginFlag() {
    sessionStorage.setItem(LOGIN_FLAG, '1');
}

function getLoginFlag() {
    return sessionStorage.getItem(LOGIN_FLAG);
}
