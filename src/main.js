import VueNativeSock from 'vue-native-websocket';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './global.less';

Vue.use(VueNativeSock, process.env.WEBSOCKET_ENDPOINT, { format: 'json' });
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

Vue.filter('currency', (value) => {
    if (typeof value !== 'number') {
        return value;
    }
    const formatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    });
    return formatter.format(value);
});
