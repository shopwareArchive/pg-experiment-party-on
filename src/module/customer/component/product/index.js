import Vue from 'vue';
import { addProductToCart } from 'src/module/customer/utils/storefront-api';
import template from './product.html';
import './product.less';

export default Vue.component('product', {
    template,
    name: 'product',
    props: {
        productResponse: null
    },
    data() {
        return {
            currentImageIndex: 0,
            selectedQuantity: 1,
            scrollPositionImageContainer: 0
        };
    },
    methods: {
        addToCart() {
            addProductToCart(this.productId, this.selectedQuantity).then((response) => {
                this.$root.$emit('add-to-cart', response.data.data);
            }).catch(() => {
            });
        }
    },
    computed: {
        product() {
            return this.productResponse.data;
        },
        productId() {
            return this.productResponse.data.id;
        },
        productImages() {
            const cover = this.product.cover;

            if (!cover) {
                return null;
            }

            const image = cover.media;

            return [image];
        },
        actualImageSrc() {
            const productImages = this.productImages;
            if (!productImages || !productImages[this.currentImageIndex]) {
                return null; // return path to dummy image
            }

            return productImages[this.currentImageIndex].url;
        },
        getPurchaseValues() {
            const minPurchase = this.product.minPurchase || 1;
            const maxPurchase = this.product.maxPurchase || 100;
            const purchaseSteps = this.product.purchaseSteps || 1;

            const values = [];
            for (let i = minPurchase; i <= maxPurchase; i += purchaseSteps) {
                values.push(i);
            }

            return values;
        },
        isInStock() {
            const minStock = this.product.minStock || 0;
            return this.product.stock > minStock;
        }
    }
});
