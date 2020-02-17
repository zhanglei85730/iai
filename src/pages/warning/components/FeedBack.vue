<template>
    <div><span class='feedbackEnter'><router-link :to="{name:'feedback'}" class="feedbackEnter">反馈 </router-link></span></div>
</template>
<script>
import { getPlatformCode } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js');
export default {
    data(){
        return {
            urlStr:'https://jinshuju.net/f/a7iWwv'
        }
    },
    methods: {
        getUrl() {
            const platformCode = getPlatformCode();
            //globalConsts
            let url = '';
            switch (platformCode) {
                //01pm 
                case globalConsts.platformNames.pm: {
                    url = 'https://jinshuju.net/f/a7iWwv';
                    break
                }
                //01 贵金属
                case globalConsts.platformNames.pmglod: {
                    url = 'https://jinshuju.net/f/a7iWwv';
                    break
                }
                //02业务
                case globalConsts.platformNames.fx: {
                    url = 'https://jinshuju.net/f/dyRcDR';
                    break
                }
                //03业务
                case globalConsts.platformNames.se: {
                    url = 'https://jinshuju.net/f/bpAs6G';
                    break
                }
                default: {
                    url = 'https://jinshuju.net/f/a7iWwv';
                }
            }
           this.urlStr=url
        }
    },
    created(){
        this.getUrl()
    }
}
</script>
<style lang="scss" scoped>
@import "@public/css/global.scss";
.feedbackEnter {
    font-size: $commonFsContent;
    color:$commonColorBlur;
}
</style>