import Vue from 'vue';
import { logoutAdmin } from 'src/module/admin/utils/auth';
import template from './app-nav.html';
import './app-nav.less';

export default Vue.component('admin-app-nav', {
    template,
    methods: {
        logout() {
            logoutAdmin();
            this.$router.go(0);
        }
    }
});
