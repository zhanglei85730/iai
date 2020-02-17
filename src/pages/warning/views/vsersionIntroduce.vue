<template>
    <MainLayout
        :title="$route.meta.title"
        :headerStyle="$config.headerStyle"
        :isLayoutBodyFlex="true"
        class="common-layout-back version-introduce"
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
            urlStr: 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1',
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
            let url = 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1'
            switch (platformCode) {
                case globalConsts.platformNames.pm: {
                    url = 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1';
                    break;
                }
                case globalConsts.platformNames.pmglod: {
                    url = 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1';
                    break;
                }
                case globalConsts.platformNames.fx: {
                    url = 'https://newcms.htmt168.com/app/2019-11-14/25457.html?app=gts2_app_orig&consulting=1';
                    break;
                }
                case globalConsts.platformNames.se: {
                    url = 'https://mp.weixin.qq.com/s?__biz=Mzg3MzI1MDg3NQ==&mid=2247483846&idx=1&sn=3611119926eefcfd17cf1014da4aed60&chksm=cee3a892f994218448b07e683fcb9d17e369d0a670ebcde5196d23f6073ce5e11b20283ee7ab&token=356443933&lang=zh_CN#rd';
                    break;
                }
                default: {
                    url = 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1';
                }
            }
            if(this.$config.isWechatPlatform){
               url='https://mp.weixin.qq.com/s?__biz=Mzg3MzI1MDg3NQ==&mid=2247483846&idx=1&sn=3611119926eefcfd17cf1014da4aed60&chksm=cee3a892f994218448b07e683fcb9d17e369d0a670ebcde5196d23f6073ce5e11b20283ee7ab&mpshare=1&scene=1&srcid=1118RjuGiPRC7QN5SsYltB0t&sharer_sharetime=1574044691773&sharer_shareid=b3969fc548d786cbbe9bb5054fc670ae&key=674ddd9fc35b9111f0f69872ba46a3e461fa5d969f0c2db172a2d3f6a7dbd8bd132da14ec9ad3d7eb7804274c80be4c29ac5f65bcb3f07eb46e0ebe094b735b2903254724c466890aeabe345fe1184c0&ascene=1&uin=MTY2MTA2MTY4OQ%3D%3D&devicetype=Windows+10&version=62070158&lang=zh_CN&pass_ticket=ZDGpLj%2FdlWj9m540Ivm%2BcvNSQVzaFO3y9CdnDUQYewVq%2FkTDg%2FuuwTehk%2By1T8uR'
               location.href=url;
            }
            if(this.$config.isWechatPlatform || platformCode==globalConsts.platformNames.se){
              location.href=url;
              return false
            }
            this.urlStr = `${url}&webViewNoTop=yes&consulting=1&consulting=1`
        },

    },
    created() {
        ///修改
        this.getUrl()
    }
}
</script>
<style lang="scss">
.version-introduce{
    .page-layout-body{
        background:#fff
    }
}
</style>