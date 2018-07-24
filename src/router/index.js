import Vue from 'vue';
import Router from 'vue-router';
import Admin from 'src/module/admin/component/main-page';
import CustomerPage from 'src/module/customer/component/main-page';
import AdminLogin from 'src/module/admin/component/login';
import { requireAdmin } from 'src/module/admin/utils/auth';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'customer-page',
            component: CustomerPage
        },
        {
            path: '/admin',
            name: 'admin-page',
            beforeEnter: requireAdmin,
            component: Admin
        },
        {
            path: '/admin-login',
            name: 'admin-login',
            component: AdminLogin
        }
    ]
});
