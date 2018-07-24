import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import Vue from 'vue';
import { extractContent } from 'src/utils/messages';
import template from './live-stream.html';
import './live-stream.less';

export default Vue.component('live-stream', {
    template,
    data() {
        return {
            player: null,
            url: null
        };
    },
    beforeCreate() {
        this.$root.$options.sockets.onmessage = (data) => extractContent(data, this.receiveMessage, 'Video');
        this.$on('push-history', (data) => this.loadHistory(data));
    },
    beforeDestroy() {
        delete this.$root.$options.sockets.onmessage;
    },
    mounted() {
        this.player = videojs('live-stream-video-player');
    },
    methods: {
        loadHistory(datas) {
            datas.forEach(this.receiveMessage);
        },
        receiveMessage(data) {
            this.url = data.url;
            this.player.ready(() => {
                if (data.status === 'start') {
                    this.player.src({
                        src: this.url,
                        type: 'application/x-mpegURL'
                    });
                    this.player.play();

                    this.$emit('play', this.url);
                } else {
                    this.player.pause();
                }
            });
        }
    }
});
