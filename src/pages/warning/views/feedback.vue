<template>
    <MainLayout
        :title="$route.meta.title"
        :headerStyle="$config.headerStyle"
        :isLayoutBodyFlex="true"
        class="common-layout-back"
        :isShowBottom="false"
        :isShowHeader="!$config.isWechatPlatform && !$config.isIaiTraderApp"
    >
        <div
            slot="page-body"
            class="warning-index"
        >
            <div
                class="loadbox"
                v-if="isIframeLoading"
            >
                <cube-loading :size="28"></cube-loading>
            </div>
            <iframe
                id="goldendata_form_a7iWwv"
                :src="urlStr"
                width="100%"
                frameborder=0
                allowTransparency="true"
                @load="iframLoad"
            ></iframe>
        </div>
    </MainLayout>
</template>
<style scoped>
.loadbox {
    width: 30px;
    height: 30px;
    margin: 0 auto;
    text-align: center;
    position: absolute;
    left: 50%;
    margin-left: -14px;
    top: 40%;
}
</style>
<script>
import { getPlatformCode, iConsole } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js');
export default {
    data() {
        return {
            urlStr: 'https://jinshuju.net/f/a7iWwv?background=white&banner=hide&embedded=true',
            isIframeLoading: true
        }
    },
    methods: {
        iframLoad() {
            this.isIframeLoading = false
        },
        getUrl() {
            const platformCode = getPlatformCode();
            //globalConsts
            let url = '';
            switch (platformCode) {
                //01pm 
                case globalConsts.platformNames.pm: {
                    url = 'https://jinshuju.net/f/a7iWwv';
                    iConsole('业务1')
                    break
                }
                //01 贵金属
                case globalConsts.platformNames.pmglod: {
                    url = 'https://jinshuju.net/f/a7iWwv';
                    iConsole('业务1')
                    break
                }
                //02业务
                case globalConsts.platformNames.fx: {
                    url = 'https://jinshuju.net/f/dyRcDR';
                    iConsole('业务2')
                    break
                }
                //03业务
                case globalConsts.platformNames.se: {
                    url = 'https://jinshuju.net/f/bpAs6G';
                    iConsole('业务3')
                    break
                }
                default: {
                    url = 'https://jinshuju.net/f/a7iWwv';
                }
            }
            //微信公众号意见反馈地址
            if(this.$config.isWechatPlatform){
                url='https://jinshuju.net/f/omU64X'
            }
            iConsole(`urlResult=${url}?background=white&banner=hide&embedded=true`)
            this.urlStr = `${url}?background=white&banner=hide&embedded=true`
        },

    },
    created() {
        ///修改时各位各位各位各位各位
        this.getUrl()
    }
}
</script>