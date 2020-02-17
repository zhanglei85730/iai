<template>
    <div class="select-list-box">
        <div class="select-list-container">
            <router-link
                class="select-list-item"
                v-for="(item,index) in data"
                :key="index"
                :class="{'no-title-sub':!isHasTitleSub(item)}"
                :to="itemLink(item)"
                @click="clickItemHandle(item)"
            >
                <div class="select-list-item-icon">
                    <img :src="getImagePath(item.iconFileName)" />
                </div>
                <div class="select-list-item-main">
                    <div class="select-list-item-arrow"></div>
                    <div class="select-list-item-newest" v-if="item.hasOwnProperty('newestTip')"><span>new</span></div>
                    <div class="select-list-item-txt">
                        <div class="select-list-item-title">
                            {{item.title}}
                        </div>
                        <div
                            class="select-list-item-title-sub"
                            v-if="isHasTitleSub(item)"
                        >
                            {{item.desction}}
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
$iconWidth: 0.44rem;
$sideSpace: $commonSpace;
.select-list-box {
    .select-list-item:first-child {
        border-top: 1px solid $commonBorderColor;
    }
    .select-list-item:last-child {
        border-bottom: 1px solid $commonBorderColor;
        .select-list-item-txt {
            border-bottom: none;
        }
    }
    .select-list-item {
        position: relative;
        padding: 0.26rem 0 0 $sideSpace;
        // height:1.6rem;
        // overflow: hidden;
        box-sizing: border-box;
        display: block;
    }
    .select-list-item-icon {
        position: absolute;
        left: $sideSpace;
        top: 0.38rem;
        // background: url("img/bell_icon@2x.png") left center no-repeat;
        width: $iconWidth;
        height: $iconWidth;
        background-size: 100%;
        img {
            width: 100%;
        }
    }
    .no-title-sub {
        .select-list-item-icon {
            background: url("img/question_icon.png") left center no-repeat;
            background-size: 100%;
            top: 0.18rem;
        }
        .select-list-item-arrow {
            top: 0.62rem;
        }
    }
    .select-list-item-title {
        color: #fff;
        font-size: $commonFsContent;
        height: 0.48rem;
        line-height: 0.48rem;
    }
    .select-list-item-title-sub {
        color: #8b8e99;
        font-size: $commonFsSmall;
        line-height: 0.32rem;
        margin-top: 2px;
        width: 21em;
    }
    .select-list-item-txt {
        margin-left: 0.64rem;
        border-bottom: 1px solid $commonBorderColor;
        padding-bottom: 0.3rem;
    }

    .select-list-item-arrow {
        background: url("img/arrow@2x.png") left center no-repeat;
        background-size: 100%;
        position: absolute;
        right: $sideSpace;
        top: 50%;
        margin-top: -0.17rem;
        width: 0.18rem;
        height: 0.35rem;
    }
    .select-list-item-newest {
        position: absolute;
        right: 0.6rem;
        top: 0.75rem;
        border-radius: 0.12rem;
        background: #ff3232;
        width: 0.58rem;
        height: 0.26rem;
        text-align: center;
        line-height: 0.26rem;
        font-size: 0.22rem;
        color: #fff;
        font-weight: normal;
        span {
            display: block;
            width: 100%;
            text-align: center;
        }
    }
    .iconType02 {
        .select-list-item-icon {
            background-image: url("img/macd@2x.png");
            width: $iconWidth;
            height: $iconWidth;
        }
    }
}
</style>
<script>
import { encodURIForSpecial, decodURIForSpecial } from '@public/js/util.js'
export default {
    props: {
        data: {
            type: Array,
            required: true,
            default: []
        },
        iconFileName: {
            type: String,
            required: false,
            default: 'bell_icon@2x.png'
        },
    },
    methods: {
        getImagePath(iconFileName) {
            const name = iconFileName ? iconFileName : 'bell_icon@2x.png';
            return this.$config.imagePathPrefix + name
        },
        isHasTitleSub(item) {
            return item.hasOwnProperty('desction')
        },
        // 点击链接
        itemLink({ link, title,newestTip={} }) {
            const { name = '', query: queryValue = '' } = link;
            if (!name || !queryValue) return {};
            let formatTitle = title
            // 转换url中的特殊符号
            if (formatTitle != '') {
                formatTitle = encodURIForSpecial(title)
            }
            const query = Object.assign({}, queryValue, { ...this.$route.query, name: formatTitle,...newestTip})
            
            // this.$router.push({name,query})newestTip
            return { name, query }
        },
    },
    computed: {
    }
}
</script>
