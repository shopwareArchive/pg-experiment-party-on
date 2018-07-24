import Vue from 'vue';
import AppNav from 'src/module/customer/component/app-nav';
import Chat from 'src/component/chat';
import LiveStream from 'src/component/live-stream';
import Product from 'src/module/customer/component/product';
import LoginButton from 'src/module/customer/component/login-button';
import ProductPreview from 'src/module/customer/component/product-preview';
import { isLoggedIn } from 'src/module/customer/utils/auth';
import { getCustomerData, getProduct } from 'src/module/customer/utils/storefront-api';
import { extractContent } from 'src/utils/messages';
import template from './online-event.html';
import './online-event.less';

export default Vue.component('customer-main-page', {
    template,
    components: {
        AppNav,
        Chat,
        LiveStream,
        Product,
        LoginButton,
        ProductPreview
    },
    data() {
        return {
            productResponses: null,
            isHistoryLoaded: false,
            customer: null,
            historyData: null
        };
    },
    beforeCreate() {
        this.$root.$options.sockets.onmessage = (data) => extractContent(data, this.receiveMessage, 'Content');
        this.$root.$options.sockets.onmessage = (data) => extractContent(data, this.loadHistory, 'History');
    },
    beforeMount() {
        this.$root.$on('login-successful', () => {
            this.loadCustomerData();
        });

        if (!isLoggedIn()) {
            return;
        }

        this.loadCustomerData();
    },
    beforeDestroy() {
        delete this.$root.$options.sockets.onmessage;
    },
    methods: {
        loadCustomerData() {
            getCustomerData()
                .then((response) => {
                    this.customer = response.data.data;
                })
                .catch(() => {
                    this.customer = null;
                    this.productResponses = null;
                });
        },
        receiveMessage(data) {
            const index = this.getIndexOfId(data.id);
            if (index !== false && index > -1) {
                return;
            }

            getProduct(data.id)
                .then((response) => this.extractProduct(response))
                .catch(() => {
                    this.productResponses = null;
                });
        },
        getIndexOfId(id) {
            if (!this.productResponses) {
                return false;
            }

            return this.productResponses.findIndex((product) => product.data.id === id);
        },
        extractProduct(response) {
            if (!this.productResponses) {
                this.productResponses = [];
            }

            this.productResponses.push(response.data);
        },
        loadHistory(data) {
            this.pushHistory(data);
        },
        pushHistory(data) {
            if (this.isHistoryLoaded || !data) {
                return;
            }

            this.$refs.chat.$emit('push-history', this.filterHistory(data.history, 'Message'));
            this.$refs.livestream.$emit('push-history', this.filterHistory(data.history, 'Video'));

            let contents = this.filterHistory(data.history, 'Content');
            contents = contents.filter((item, pos) => pos === contents.findIndex((indexItem) => indexItem.id === item.id));
            contents.forEach(this.receiveMessage);

            this.isHistoryLoaded = true;
        },
        filterHistory(history, type) {
            return history.filter((item) => type === item.type);
        },
        scrollToProduct(product) {
            this.$el.querySelector(`#id-${product.id}`).scrollIntoView(true);
        }
    }
});
