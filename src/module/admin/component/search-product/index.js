import Vue from 'vue';
import { get } from 'src/module/admin/utils/api';
import FilterMixin from 'src/mixin/FilterMixin';
import template from './search-product.html';
import './search-product.less';

export default Vue.component('search-product', {
    template,
    mixins: [FilterMixin],
    props: {
        product: {},
        isAdded: false
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
        },
        removeProduct() {
            this.$emit('remove-product', this.product);
        }
    }
});
