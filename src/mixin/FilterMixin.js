import Vue from 'vue';

export default Vue.mixin({
    methods: {
        getByType(response, type) {
            return response.data.included
                .filter((item) => {
                    return item.type === type;
                }).map((item) => {
                    return item.attributes;
                });
        }
    }
});
