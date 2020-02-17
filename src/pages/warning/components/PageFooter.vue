<template>
    <!-- 页面footer -->
    <div>
        <div class="m-pageFooter">
            <cube-tab-bar
                slot="page-footer"
                v-model="selectedLabelDefault"
                :data="tabs"
                @change="changeHandler"
            >
                <cube-tab
                    v-for="item in tabs"
                    :label="item.value"
                    :key="item.label"
                >
                    <i
                        slot="icon"
                        :class="item.icon"
                        class="m-pageFooter-item-icon"
                    ></i>
                    <div class="page-footer-item-txt">{{item.label}}</div>
                </cube-tab>
            </cube-tab-bar>
        </div>
        <!-- 未登录、游客提示登录或注册真实账号 -->
        <AuthPop
            :isShow="loginPopVisible"
            @cancle="AuthPopcancleHandle"
        />
    </div>

</template>
<script>
import i18n from '@warning/i18n'
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'
import { getPlatformCode, getInfoFromApp } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js')

export default {
    name: 'PageFooter',
    components: {
           // 未授权modal
        AuthPop:()=>import("@warning/components/AuthPop"),
    },
    data() {
        return {
            tabs: [
                {
                    label: this.$t('footer.homePage'),
                    icon: 'icon-rank',
                    value: 'homePage'
                },
                {
                    label: this.$t('footer.dataWarning'),
                    icon: 'icon-alarm',
                    value: 'advanceAssign'
                },
                {
                    label: this.$t('footer.myWarning'),
                    icon: 'icon-account',
                    value: 'minePage'
                }
            ],
            selectedLabelDefault: this.$route.name,
            loginPopVisible: false,
            isFx: false
        }
    },
    props: {
        select: {
            type: String,
            default: '',
        }
    },
    watch: {
        // select(val) {
        //     this.selectedLabelDefault = val
        // }
    },
    methods: {
        AuthPopcancleHandle() {
            this.loginPopVisible = false
        },
        // 调转登录
        goToLogin() {
            this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
        },
        changeHandler(label) {
            this.$router.push({ name: label })
        }
    },
    i18n
}

</script>

<style lang="scss">
@import "@public/css/global.scss";
.m-pageFooter {
    background-color: $commonFsColorDarkGray;
    border-top: 1px solid #313131;
    .cube-tab-bar {
        .cube-tab {
            padding-top: 0.14rem !important;
            padding-bottom: 0.14rem !important;
            .icon-account {
                background-size: cover;
                display: inline-block;
                width: 0.44rem;
                height: 0.44rem;
                background-image: url("../../../assets/account@2x.png");
            }
            .icon-alarm {
                background-size: cover;
                display: inline-block;
                width: 0.44rem;
                height: 0.44rem;
                background-image: url("../../../assets/alarm@2x.png");
            }
            .icon-rank {
                background-size: cover;
                display: inline-block;
                width: 0.44rem;
                height: 0.44rem;
                background-image: url("../../../assets/rank@2x.png");
            }
            &.cube-tab_active {
                color: $commonColorBlur;
                .icon-account {
                    background-image: url("../../../assets/account_p@2x.png");
                }
                .icon-alarm {
                    background-image: url("../../../assets/alarm_p@2x.png");
                }
                .icon-rank {
                    background-image: url("../../../assets/rank_p@2x.png");
                }
            }
            i {
                font-size: 0.3rem;
            }
            div {
                font-size: 0.2rem;
                margin-top: 0.07rem;
            }
        }
    }
}
.nav-position-top {
    .cube-tab-bar-slider {
        &:after {
            background: $commonColorBlur;
        }
    }
    .m-pageFooter {
        background: none !important;
        height: $headerHeight;
        padding-top: 0.1rem;
        box-sizing: border-box;
        .m-pageFooter-item-icon {
            display: none !important;
        }
        .cube-tab-bar .cube-tab .page-footer-item-txt {
            font-size: $commonFsContent;
        }
    }
}
</style>
