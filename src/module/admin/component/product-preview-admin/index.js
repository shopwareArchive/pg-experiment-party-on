import Vue from 'vue';
import { get } from 'src/module/admin/utils/api';
import FilterMixin from 'src/mixin/FilterMixin';
import template from './product-preview-admin.html';
import './product-preview-admin.less';

export default Vue.component('product-preview-admin', {
    template,
    mixins: [FilterMixin],
    props: {
        product: {}
    },
    data() {
        return {
            productMediaUrl: null
        };
    },
    mounted() {
        get(this.product.relationships.media.links.related)
            .then((response) => {
                const media = this.getByType(response, 'media');
                this.productMediaUrl = media[0].url;
            });
    },
    methods: {
        chooseProduct() {
            this.$emit('choose-product', this.product);
        }
    }
});
