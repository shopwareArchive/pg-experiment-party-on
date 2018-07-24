import Vue from 'vue';
import CartButton from 'src/module/customer/component/cart-button';
import { isLoggedIn, logout } from 'src/module/customer/utils/auth';
import template from './app-nav.html';
import './app-nav.less';

export default Vue.component('app-nav', {
    template,
    components: {
        CartButton
    },
    data() {
        return {
            isLoggedIn: isLoggedIn()
        };
    },
    mounted() {
        this.$root.$on('login-successful', () => {
            this.isLoggedIn = true;
        });
    },
    methods: {
        logout() {
            this.isLoggedIn = false;
            logout();
        }
    }
});
