import Vue from 'vue';
import { isAdmin, loginAdmin } from 'src/module/admin/utils/auth';
import { HISTORY_KEY } from 'src/module/admin/component/main-page';
import template from './login.html';
import './login.less';

export default Vue.component('admin-login', {
    template,
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        };
    },
    beforeMount() {
        if (isAdmin()) {
            this.$nextTick(() => this.$router.push('admin'));
        }
    },
    methods: {
        login(event) {
            event.preventDefault();

            const redirectTo = this.$route.query.redirect || this.$router.resolve('admin').route.fullPath;

            loginAdmin(this.username, this.password, redirectTo)
                .catch((error) => {
                    const errors = error.response.data.errors.map((errorItem) => errorItem.detail || errorItem.title);
                    this.errorMessage = errors.join(' ');
                })
                .then(() => sessionStorage.removeItem(HISTORY_KEY));
        }
    }
});
