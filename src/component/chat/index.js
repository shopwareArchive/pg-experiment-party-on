import Vue from 'vue';
import LoginButton from 'src/module/customer/component/login-button';
import ChatMessage from 'src/component/chat-message';
import { extractContent } from 'src/utils/messages';
import template from './chat.html';
import './chat.less';

export default Vue.component('chat', {
    template,
    name: 'chat',
    components: {
        LoginButton,
        ChatMessage
    },
    props: {
        customer: null
    },
    data() {
        return {
            actualMessage: '',
            items: [
            ]
        };
    },
    beforeCreate() {
        this.$root.$options.sockets.onmessage = (data) => extractContent(data, this.receiveMessage, 'Message');
        this.$on('push-history', (history) => this.loadHistory(history));
    },
    methods: {
        receiveMessage(data) {
            this.items.push(data);
            this.scrollDown();
        },
        loadHistory(items) {
            this.items.push(...items);

            this.scrollDown();
        },
        sendMessage(event) {
            event.preventDefault();

            if (!this.actualMessage) {
                return;
            }

            this.$socket.sendObj({
                type: 'Message',
                sender: this.getSender(),
                isAdmin: this.isAdmin(),
                message: this.actualMessage
            });
            this.actualMessage = '';
        },
        scrollDown() {
            this.$nextTick(() => {
                const chatContainer = this.$refs['chat-content'];
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        },
        getSender() {
            return {
                name: `${this.customer.firstName} ${this.customer.lastName}`,
                email: this.customer.email
            };
        },
        isAdmin() {
            return false;
        }
    }
});
