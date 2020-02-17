<template>
    <cube-popup
        type="extend-popup"
        :visible="visible"
        position="top"
        class="platform-plane-container"
        @mask-click="maskClickHandle"
    >
        <div class="platform-plane">
            <div class="platform-header">
                <div class="platform-title">切换盯盘服务平台</div>
                <div @click="setBtnHandle">
                    <SetPlatform :visible="!visible" />
                </div>
            </div>
            <div
                class="platform-row-item"
                v-for="(item,index) in data"
                :key="index"
               >
                <div class="platform-item-left">
                    <div class="platform-item-title">{{item.cn_short}}({{item.en_short}})</div>
                    <div class="platform-item-description">{{item.desc}}</div>
                    <div
                        class="auth-bind"
                        v-if="item.bind!=1"
                    >
                        <span @click="queryAuth(item)">查询授权并绑定 ></span>
                        <span
                            @click="openAccount(item)"
                            class="go-open-account"
                            v-if="isOpenAccountUrl(item)"
                        >
                            <san v-if="item.platform!=='PF14'">去开户 ></san><span v-else>开户免费领50美元实盘金 ></span>
                        </span>
                    </div>
                </div>
                <div
                    class="platform-item-right"
                    @click="platforItemHandle(item,index)"
                >
                    <img
                        src='./images/checkbox_selected_normal@3x.png'
                        class="platform-item-checkbox"
                        v-if="selectIndex==index"
                    >
                    <div
                        class="platform-item-checkbox-no-select"
                        v-else-if="item.bind==1"
                    ></div>
                </div>
            </div>
            <div class="bottom-tip">更多经纪商，正在入驻中，敬请期待</div>
            <!-- <div v-show="noData" class="no-data">
                无数据
            </div> -->
            
        </div>
    </cube-popup>
</template>
<script>
import { goOpenAccountForWeb } from '@public/js/util.js'
import SetPlatform from '@warning/components/SetPlatform/index.js'
import i18n from '@warning/i18n';
const globalConsts = require('@public/js/consts.js')

export default {
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        data: {
            type: Array,
            default: [],
            required: true,

        },
        selectIndex: {
            type: Number,
            default: 0,
            required: true,
        }
    },
    data() {
        return {
            // platformData:[
            //     {
            //         name:'IAI Trade',
            //         description:'切换经纪商，将同步经纪商行情及盯盘信息，解锁更多功能'
            //     },
            //      {
            //         name:'IAI Trade',
            //         description:'切换经纪商，将同步经纪商行情及盯盘信息，解锁更多功能'
            //     }
            // ],
            // selectIndex: ''
        }
    },
    methods: {
        platforItemHandle(item, index) {
            const { current_pf = '' } = item
            if (item.bind == 1 && current_pf != 1) {
                this.$emit('select', item, index);
                // this.selectIndex = index
            }
        },
        queryAuth(item) {
            this.$emit('queryAuth', item)
        },
        setBtnHandle() {
            this.$emit('set')
        },
        openAccount({ open_url = 1, platform = '' }) {
            if (open_url !== '' && platform == globalConsts.platformNames.se) {
                // goOpenAccountForWeb(platform)
                window.location.href = `${open_url}?&webViewNoTop=yes&consulting=1`
            }
        },
        isOpenAccountUrl({ open_url = 1, platform = '' }) {
            return platform == globalConsts.platformNames.se && open_url != '' ? true : false;
        },
        maskClickHandle() {
            this.$emit('maskClick', this.visible)
        }
    },
    created() {
        // let select = 0;
        // this.data.some(({ current_pf = '' }, index) => {
        //     if (current_pf == 1) {
        //         select = index;
        //         return true
        //     }
        // })
        // console.log('select00000000000=' + select)
        // this.$nextTick(() => {
        //     this.selectIndex = select;
        // })

    },
    computed: {
        noData() {
            return this.data.length > 0 ? false : true
        },
        popupVisible() {
            return this.visible && this.data.length > 0 ? true : false;
        }
    },
    components: {
        SetPlatform
    },
    i18n
}
</script>
<style lang="scss" scoped>
@import "@public/css/global.scss";
.bottom-tip{
    font-size:$commonFsSmall;
    color:$commonFsDarkColor;
    margin-top:0.2rem;
    padding:0.2rem 0.28rem
}
.platform-header {
    height: $headerHeight;
    line-height: $headerHeight;
    display: flex;
    justify-items: center;
    padding: 0 $commonSpace;
    border-bottom: 1px solid $commonFsColorDarkGray;
}
.platform-title {
    flex: 1;
    color: #fff;
}
.platform-plane {
    background-color: $commonBackgroundDark;
    width: 100%;
    // height:200px;
}
.go-open-account {
    margin-left: 0.5rem;
}
.platform-header-sub-item {
    flex: 1;
    line-height: 0.88rem;
    font-size: $commonFsSmall;
    // padding: 0 $commonSpace;
    &:first-child {
        text-align: left;
        color: $commonFsColorGray;
    }
    // &:last-child {
    //     text-align: right;
    //     color: $commonColorBlur;
    // }
}

.platform-row-item {
    margin: 0 $commonSpace;
    border-bottom: 1px solid $commonFsColorDarkGray;
    text-align: left;
    display: flex;
    height: 1.6rem;
}
.platform-header-sub {
    display: flex;
    height: 0.88rem;
}
.platform-item-title {
    color: #fff;
    font-size: $commonFsMedium;
    padding: 0.08rem 0;
}
.platform-item-description {
    color: $commonFsColorGray;
    font-size: $commonFsSmall;
    padding: 0.1rem 0 0.16rem 0;
}
.platform-item-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    justify-content: center;
}
.platform-item-right {
    width: 0.44rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.platform-item-checkbox {
    width: 0.44rem;
}
.platform-item-checkbox-no-select {
    width: 0.44rem;
    height: 0.44rem;
    border: 1px solid $commonColorBlur;
    border-radius: 0.44rem;
    box-sizing: border-box;
}
.auth-bind {
    font-weight: 400;
    color: rgba(51, 133, 255, 1);
    line-height: 0.24rem;
    font-size: $commonFsSmall;
    padding-top: 0.1rem;
}
.no-data {
    height: 30px;
    color: #fff;
}
</style>