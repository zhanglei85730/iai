<template>
    <div>
        <MainLayout
            :title="$route.meta.title"           
            :headerStyle="{backgroundColor: '#292933'}"
            class="common-layout-back2 my-warning-layout"
            :isShowBackWord="false"
            :isScroll="true"
            :backBtnTxt="$route.query.backTitle"
            :flexSet="{center:6}"
        >
            <div
                slot="page-body"
                class="page-body-background"
            >
                <SideSpace>
                    <div slot="content">
                        <br />
                        <img
                            src="static/img/warning/about_illus_1@3x.png"
                            class="common-img-width"
                        />
                        <div
                            v-if="!$config.isWechatPlatform"
                            v-html="$t('aboutUs.content')"
                            class="about-us-body"
                        ></div>
                        <div
                            v-else
                            v-html="$t('aboutUs.wechat')"
                            class="about-us-body"
                        ></div>
                    </div>
                </SideSpace>

            </div>
        </MainLayout>
    </div>
</template>
<script>
import i18n from '@warning/i18n'
export default {
    i18n,
    data() {
        return {
        }
    },
}
</script>
<style lang="scss">
@import "@public/css/global.scss";
.about-us-body {
    color: #fff;
    line-height: 0.56rem;
}
.about-us-body p {
    margin-top: 0.22rem;
    font-size: 0.3rem;
}
</style>