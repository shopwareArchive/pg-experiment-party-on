import Vue from 'vue';
import template from './chat-message.html';
import './chat-message.less';

export default Vue.component('chat-message', {
    template,
    props: {
        message: null
    },
    methods: {
        getShortHand(name) {
            return name.split(' ').map(part => part[0]).join('');
        },
        stringToColor(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i += 1) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let colour = '#';
            for (let i = 0; i < 3; i += 1) {
                const value = (hash >> (i * 8)) & 0xFF;
                colour += (`00${value.toString(16)}`).substr(-2);
            }
            return colour;
        }
    }
});
