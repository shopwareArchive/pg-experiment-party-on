import Vue from 'vue';
import BaseChat from 'src/component/chat';

export default Vue.component('admin-chat', {
    extends: BaseChat,
    methods: {
        isAdmin() {
            return true;
        },
        getSender() {
            return {
                name: this.customer.attributes.name,
                email: this.customer.attributes.email
            };
        }
    }
});
