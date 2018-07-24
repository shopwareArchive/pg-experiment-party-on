import axios from 'axios';
import { getHeaderData } from './auth';

export {
    addProductToCart,
    loadCart,
    getProduct,
    getCustomerData
};

function addProductToCart(productId, quantity) {
    const url = `${process.env.API_ENDPOINT}/storefront-api/checkout/cart/product/${productId}`;
    const config = getHeaderData();

    const data = {
        quantity: quantity,
        payload: { id: productId }
    };

    return axios.post(url, data, config);
}

function loadCart() {
    const url = `${process.env.API_ENDPOINT}/storefront-api/checkout/cart`;
    const config = getHeaderData();

    return axios.get(url, config);
}

function getProduct(productId) {
    const url = `${process.env.API_ENDPOINT}/storefront-api/product/${productId}`;
    const headers = getHeaderData();

    return axios.get(url, headers);
}

function getCustomerData() {
    const url = `${process.env.API_ENDPOINT}/storefront-api/customer`;
    const headers = getHeaderData();

    return axios.get(url, headers);
}
