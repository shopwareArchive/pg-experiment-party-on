import Vue from 'vue';
import { isLoggedIn, login, logout } from 'src/module/customer/utils/auth';
import template from './login-button.html';
import './login-button.less';

export default Vue.component('login-button', {
    template,
    name: 'login-button',
    data() {
        return {
            expandedLogin: false,
            loginError: '',
            email: '',
            password: '',
            isLoggedIn: false
        };
    },
    beforeMount() {
        this.isLoggedIn = isLoggedIn();
    },
    methods: {
        submit(event) {
            event.preventDefault();

            login(this.email, this.password)
                .then(() => {
                    this.isLoggedIn = true;
                    this.expandedLogin = false;
                    this.loginError = '';
                    this.$nextTick(() => this.$root.$emit('login-successful', this.email));
                })
                .catch((error) => {
                    const data = error.response.data;
                    const errors = data.errors.map(responseError => responseError.detail || responseError.title);
                    this.loginError = errors.join(' ');
                });
        },
        handleLogout() {
            logout();

            this.isLoggedIn = false;
        }
    }
});
