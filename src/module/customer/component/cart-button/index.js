import Vue from 'vue';
import { loadCart } from 'src/module/customer/utils/storefront-api';
import { getContextToken, setContextToken } from 'src/module/customer/utils/auth';
import template from './cart-button.html';
import './cart-button.less';

export default Vue.component('cart-button', {
    template,
    data() {
        return {
            cart: null
        };
    },
    beforeMount() {
        loadCart()
            .then((response) => {
                this.cart = response.data.data;

                if (!getContextToken()) {
                    setContextToken(this.cart.token);
                }
            })
            .catch(() => {
                this.cart = null;
            });

        this.$root.$on('add-to-cart', (event) => {
            this.cart = event;
        });
    }
});
