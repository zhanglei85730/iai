<template>
    <transition name="cube-action-sheet-fade">
        <cube-popup
            type="action-sheet"
            :class="{'cube-action-sheet_picker': pickerStyle}"
            :center="false"
            :mask="true"
            :z-index="zIndex"
            v-show="isVisible"
            @mask-click="maskClick"
        >
            <transition name="cube-action-sheet-move">
                <div
                    class="cube-action-sheet-panel cube-safe-area-pb"
                    v-show="isVisible"
                    @click.stop
                >
                    <div
                        class="border-bottom-1px cube-action-sheet-title"
                        v-show="pickerStyle || title"
                    >
                        <div
                            class="cube-action-sheet-header-cancel"
                            @click="cancel"
                        >{{_cancelTxt}}</div>
                        <h1>{{title}}</h1>
                        <div
                            class="cube-action-sheet-subTitle"
                            v-if="subTitle"
                        >{{subTitle}}</div>
                    </div>
                    <div
                        class="cube-action-sheet-content"
                        ref="scrollList"
                    >
                        <ul class="cube-action-sheet-list">
                            <li
                                v-for="(group,groupIndex) in data"
                                :key="groupIndex"
                            >
                                <div class="cube-action-sheet-group">{{group.text}}</div>
                                <template v-if="group.list && group.list.length>0">
                                    <ul class="cube-action-sheet-group-item">
                                        <li
                                            v-for="(item,index) in group.list"
                                            @click="selectItem(item,data)"
                                            :class="{'active':selected.indexOf(item.uname)>=0}"
                                            :key="index"
                                        >
                                            <div :class="{'action-sheet-text-long':isSymbolLengthMax(item.cnName)}">{{item.cnName}}</div>
                                        </li>
                                    </ul>
                                </template>
                            </li>
                        </ul>
                    </div>
                    <div class="cube-action-sheet-space"></div>
                    <div class="cube-action-sheet-cancel">
                        <cube-button
                            outline
                            @click="toDefault"
                        >{{ context.$t('common.resetDefault')}}</cube-button>
                        <cube-button
                            primary
                            :disabled="selected.length>0?false:true"
                            :class="{'common-button-disable':selected.length==0}"
                            @click="save"
                        >{{ context.$t('common.saveBtnText')}}</cube-button>
                    </div>
                </div>
            </transition>
        </cube-popup>
    </transition>
</template>

<script>
import CubePopup from 'cube-ui/src/components/popup/popup.vue'
import visibilityMixin from 'cube-ui/src/common/mixins/visibility'
import popupMixin from 'cube-ui/src/common/mixins/popup'
import localeMixin from 'cube-ui/src/common/mixins/locale'
import { getStringLengthByUnicode } from '@public/js/util.js'
const COMPONENT_NAME = 'warning-action-sheet'
const EVENT_SELECT = 'select'
const EVENT_CANCEL = 'cancel'
const EVENT_SAVE = 'save'

export default {
    name: COMPONENT_NAME,
    mixins: [visibilityMixin, popupMixin, localeMixin],
    data() {
        return {
            selected: []
        }
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        },
        value: {
            type: Array,
            default() {
                return []
            }
        },
        active: {
            type: Number,
            default: -1
        },
        limit: {
            type: Number,
            default: -1
        },
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
        pickerStyle: {
            type: Boolean,
            default: false
        },
        maskClosable: {
            type: Boolean,
            default: true
        },
        cancelTxt: {
            type: String,
            default: ''
        },
        // 上下文环境 主要用来获取i18n对象
        context: {
            type: Object,
            default: null
        }
    },
    computed: {
        _cancelTxt() {
            return this.cancelTxt || this.$t('cancel')
        }
    },
    methods: {
        // 获取字符长度
        isSymbolLengthMax(string) {
            return getStringLengthByUnicode(string) >= 11 ? true : false
        },
        getSymbolNameLength() {

        },
        maskClick() {
            this.maskClosable && this.cancel()
        },
        selectItem(item, arr) {
            const t = this;
            const context = this.context;
            let _index = this.selected.indexOf(item.uname)
            // 选择超过选择限制提示
            if (this.selected.length >= this.limit && _index < 0) {
                t.$createDialog({
                    type: 'alert',
                    title: context.$t('toastTxt').selectProductsLable,
                    showClose: true,
                    content: context.$t('toastTxt').selectProcuctMax10,
                    confirmBtn: {
                        text: context.$t('toastTxt').iKnowIt,
                        active: true,
                        disabled: false,
                        href: 'javascript:;'
                    },
                }).show();
            }
            if (_index >= 0) {
                this.selected.splice(_index, 1)
            } else {
                if (this.limit > -1 && this.selected.length < this.limit) {
                    this.selected.push(item.uname)
                }
            }
        },
        cancel() {
            this.hide()
            this.$emit(EVENT_CANCEL)
        },
        toDefault() {
            this.$emit('default')
        },
        save() {
            this.$emit(EVENT_SAVE, this.selected)
        },
        itemClick(item, index) {
            this.hide()
            this.$emit(EVENT_SELECT, item, index)
        },
        scrollList() {
            this.$refs.scrollList.addEventListener('touchstart', function (e) {
                this.allowUp = (this.scrollTop > 0)
                this.allowDown = (this.scrollTop < this.scrollHeight - this.clientHeight)
                this.lastY = e.targetTouches[0].pageY
            })

            this.$refs.scrollList.addEventListener('touchmove', function (e) {
                let up = (e.targetTouches[0].pageY > this.lastY)
                let down = !up
                this.lastY = e.targetTouches[0].pageY
                if ((up && this.allowUp) || (down && this.allowDown)) {
                    e.stopPropagation()
                } else {
                    e.preventDefault()
                }
            })
        }
    },
    components: {
        CubePopup
    },
    watch: {
        isVisible(val) {
            if (val) {
                this.selected = Array.concat([], this.value)
            }
        }
    },
    mounted() {
        this.scrollList()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@require '~cube-ui/src/common/stylus/mixin.styl';
@require '~cube-ui/src/common/stylus/variable.styl';

.cube-action-sheet-header-cancel {
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 13px;
    padding-bottom: 13px;
    padding-left: 0.34rem;
    padding-right: 0.34rem;
    color: $action-sheet-picker-cancel-color;
    font-size: $fontsize-medium;
    background-color: transparent;
}

.cube-action-sheet-fade-enter, .cube-action-sheet-fade-leave-active {
    opacity: 0;
}

.cube-action-sheet-fade-enter-active, .cube-action-sheet-fade-leave-active {
    transition: all 0.3s ease-in-out;
}

.cube-action-sheet-panel {
    text-align: center;
    font-size: $fontsize-medium;
    background-color: $action-sheet-bgc;
}

.cube-action-sheet-move-enter, .cube-action-sheet-move-leave-active {
    transform: translate3d(0, 100%, 0);
}

.cube-action-sheet-move-enter-active, .cube-action-sheet-move-leave-active {
    transition: all 0.3s ease-in-out;
}

.cube-action-sheet-cancel {
    background-color: $action-sheet-bgc;
}

.cube-action-sheet-cancel span, .cube-action-sheet-title, .cube-action-sheet-item {
    display: block;
    padding: 17px 16px;
    margin: 0;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    font-size: $fontsize-large;
    font-weight: normal;
    line-height: 1;
    color: $action-sheet-color;
    background-color: $action-sheet-bgc;
}

.cube-action-sheet-cancel span, .cube-action-sheet-item {
    &:active {
        background-color: $action-sheet-active-bgc;
    }
}

.cube-action-sheet-title {
    position: relative;
    padding-top: 0.09rem;
    padding-bottom: 0.14rem;
    color: $action-sheet-title-color;
    font-size: 0.32rem;
    line-height: 0.5rem;
}

.cube-action-sheet-subTitle {
    font-size: 0.24rem;
    line-height: 0.24rem;
    color: #575766;
}

.cube-action-sheet-content {
    background: $action-sheet-bgc;
    -webkit-overflow-scrolling: touch;
    height: 40vh;
    overflow: auto;
}

.cube-action-sheet-list {
    list-style: none;
    display: inline-block;
    padding: 0.28rem 0.16rem;
    padding-bottom: 0;
    width:100%
}

.cube-action-sheet-group {
    text-align: left;
    padding-left: 0.1rem;
    font-size: 0.24rem;
    color: #8B8E99;
    margin-bottom: 0.16rem;
}

.cube-action-sheet-group-item {
    display: flex;
    flex-flow: wrap;
    list-style: none;
    color: #8B8E99;
    font-size: 0;

    li {
        display: inline-block;
        border-radius: 0.04rem;
        overflow: hidden;
        width: 1.64rem;
        margin: 0 0.06rem;
        height: 0.7rem;
        line-height: 0.7rem;
        border: solid 1px rgba(61, 61, 77, 1);
        margin-bottom: 0.16rem;
        box-sizing: border-box;
        background-color: rgba(61, 61, 77, 1);
        font-size: 0.28rem;
        word-wrap: break-word;
    }

    .action-sheet-text-long {
        font-size: 0.24rem;
        white-space: normal;
        line-height: 0.28rem;
        box-box-sizing: border-box;
        padding-top: 0.06rem;
        width: 80%;
        margin: 0 auto;
    }

    li.active {
        color: #fff;
        border: solid 1px #fff;
    }
}

.cube-action-sheet-space {
    height: 6px;
    background-color: $action-sheet-space-bgc;
}

.cube-action-sheet-item_active {
    color: $action-sheet-active-color;
}

.cube-action-sheet_picker {
    .cube-action-sheet-space {
        height: 0;
    }

    .cube-action-sheet-title {
        padding-top: 0.09rem;
        padding-bottom: 0.14rem;
    }

    .cube-action-sheet-cancel {
        display: flex;
        justify-content: space-between;
        padding: 0.14rem 0.28rem 0.34rem 0.28rem;

        .cube-btn-primary:active {
            background-color: #4c94ff;
        }

        .cube-btn {
            width: 3.37rem;
            height: 0.72rem;
            border-radius: 0.36rem;
            padding-top: 0.24rem;
            padding-bottom: 0.23rem;
            font-size: 0.28rem;
        }

        .cube-btn-outline {
            border: solid 1px #4c94ff;
            color: #4c94ff;
        }

        .cube-btn-outline:after {
            content: normal;
        }
    }
}
</style>
