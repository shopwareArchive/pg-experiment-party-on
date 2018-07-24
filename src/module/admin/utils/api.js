import axios from 'axios';
import { getHeaderData, getUsername } from './auth';

export {
    get,
    getProducts,
    getProduct,
    loadAdminUser
};

function getProducts(searchTerm) {
    const url = `${process.env.API_ENDPOINT}/api/v1/product?term=${searchTerm}`;
    const headers = getHeaderData();

    return axios.get(url, headers);
}

function get(url) {
    const headers = getHeaderData();

    return axios.get(url, headers);
}

function getProduct(id) {
    const url = `${process.env.API_ENDPOINT}/api/v1/product/${id}`;
    const headers = getHeaderData();

    return axios.get(url, headers);
}

function loadAdminUser() {
    const username = getUsername();
    return getUserByUsername(username);
}

function getUserByUsername(username) {
    const url = `${process.env.API_ENDPOINT}/api/v1/user?filter[user.username]=${username}`;
    const headers = getHeaderData();

    return axios.get(url, headers);
}
