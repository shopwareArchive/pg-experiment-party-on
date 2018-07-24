import Vue from 'vue';
import template from './product-preview.html';
import './product-preview.less';

export default Vue.component('product-preview', {
    template,
    props: {
        product: {}
    },
    methods: {
        chooseProduct() {
            this.$emit('choose-product', this.product);
        }
    },
    computed: {
        actualImageSource() {
            if (!this.product.cover || !this.product.cover.media) {
                return null;
            }

            return this.product.cover.media.url || null;
        }
    }
});
