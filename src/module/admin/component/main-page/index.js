import Vue from 'vue';
import { extractData } from 'src/utils/messages';
import { logoutAdmin } from 'src/module/admin/utils/auth';
import { get, getProduct, getProducts, loadAdminUser } from 'src/module/admin/utils/api';
import ProductPreview from 'src/module/admin/component/product-preview-admin';
import LiveStream from 'src/component/live-stream';
import SearchProduct from 'src/module/admin/component/search-product';
import Chat from 'src/module/admin/component/chat';
import AppNav from 'src/module/admin/component/app-nav';
import template from './admin-area.html';
import './admin-area.less';

export const HISTORY_KEY = 'SOCKET_HISTORY';

export default Vue.component('admin-main-page', {
    template,
    components: {
        Chat,
        ProductPreview,
        AppNav,
        SearchProduct,
        LiveStream
    },
    data() {
        return {
            user: null,
            searchedProducts: [],
            searchTerm: '',
            isStarted: false,
            linkNext: null,
            total: 0,
            isLoading: false,
            sendProducts: [],
            lastSendProduct: {}
        };
    },
    mounted() {
        this.searchProducts();
        this.loadUser();
        this.loadSendProducts();
        this.$root.$options.sockets.onmessage = (data) => this.receiveMessage(data);

        this.loadHistory();
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        receiveMessage(data) {
            let extracted = extractData(data);

            if (!extracted) {
                extracted = JSON.parse(data.data);
                if (extracted.content.startsWith('/A new socket has connected: ')) {
                    this.broadcastHistory();
                }

                return;
            }

            switch (extracted.type) {
                case 'Message':
                case 'Video':
                    this.addToHistory(extracted);
                    break;
                default:
                    break;
            }
        },
        searchProducts(event) {
            if (event) {
                event.preventDefault();
            }

            getProducts(this.searchTerm).then((response) => {
                this.searchedProducts = response.data.data;
                this.total = response.data.meta.total;

                this.generateLinkNext(response);
            });
        },
        sendProductToCustomer(product) {
            const info = { type: 'Content', id: product.id };
            this.addToHistory(info);
            this.$socket.sendObj(info);
            this.sendProducts.push(product);
        },
        startStream() {
            const streamUrl = process.env.STREAM_URL;

            this.$socket.sendObj({ type: 'Video', url: streamUrl, status: 'start' });
            this.isStarted = true;
        },
        broadcastHistory() {
            const history = this.getHistory();

            this.$socket.sendObj({ type: 'History', history: history });
        },
        isSend(productId) {
            return this.sendProducts.filter(items => items.id === productId).length > 0;
        },
        removeProduct(removeProduct) {
            this.sendProducts = this.sendProducts.filter(product => product.id !== removeProduct.id);

            let history = this.getHistory();
            history = history.filter(item => !(item.type === 'Content' && item.id === removeProduct.id));

            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        },
        generateLinkNext(response) {
            this.linkNext = response.data.links.next;

            if (this.linkNext === response.data.links.last) {
                this.linkNext = null;
                return;
            }

            if (this.total < 10) {
                this.linkNext = null;
                return;
            }

            // TODO: Remove when links are correct
            this.linkNext = decodeURI(this.linkNext);
            this.linkNext = this.linkNext.replace('page[offset]', 'offset');
            this.linkNext = this.linkNext.replace('page[limit]', 'limit');
        },
        loadMore() {
            if (!this.linkNext || this.isLoading) {
                return;
            }

            this.isLoading = true;

            get(this.linkNext).then((response) => {
                this.searchedProducts = this.searchedProducts.concat(response.data.data);

                this.generateLinkNext(response);

                this.isLoading = false;
            });
        },
        loadSendProducts() {
            const productIds = this.filterHistory(this.getHistory(), 'Content');

            productIds.forEach(productId => {
                getProduct(productId.id).then(response => {
                    this.sendProducts.push(response.data.data);
                });
            });
        },
        logout() {
            logoutAdmin();
            this.$router.go(0);
        },
        loadUser() {
            loadAdminUser()
                .then((response) => {
                    this.user = response.data.data[0];
                });
        },
        filterHistory(history, type) {
            return history.filter((item) => type === item.type);
        },
        addToHistory(info) {
            const history = this.getHistory();

            history.push(info);
            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        },
        getHistory() {
            let history = sessionStorage.getItem(HISTORY_KEY);

            if (!history) {
                history = [];
            } else {
                history = JSON.parse(history);
            }

            return history;
        },
        loadHistory() {
            const history = this.getHistory();

            this.$refs.chat.$emit('push-history', this.filterHistory(history, 'Message'));
            this.$refs.livestream.$emit('push-history', this.filterHistory(history, 'Video'));
        },
        handleScroll() {
            const loadingIndicator = this.$el.querySelector('.loading-indicator');
            const loadingIndicatorRect = loadingIndicator.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();
            const offset = bodyRect.bottom - loadingIndicatorRect.bottom;

            if ((window.innerHeight + window.scrollY + offset) < document.body.offsetHeight || !this.linkNext) {
                return;
            }

            this.loadMore();
        }
    }
});
