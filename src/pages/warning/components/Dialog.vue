<template>
    <cube-popup
        type="my-popup"
        ref="myPopup"
        :visible="visible"
    >
        <div class="custom-dialog-container">
            <div class="custom-dialog-title">保存提示</div>
            <div class="custom-dialog-content">您还没有保存盯盘设置，是否保存？</div>
            <div class="custom-dialog-btns">
                <ul :class="{'flex':direct}" class="custom-dialog-btns-ul">
                    <!-- <li class="custom-dialog-btns-item primary">保存</li>
                    <li class="custom-dialog-btns-item">放弃保存</li>
                    <li class="custom-dialog-btns-item">取消</li> -->
                    <li class="custom-dialog-btns-item" v-for="(item,index) in btns" :key="index" @click="item.func" :class="{'primary':item.hasOwnProperty('primary')}">{{item.text}}</li>
                </ul>
            </div>
        </div>
    </cube-popup>
</template>
<script>
export default {
    props: {
        visible:{
            type:Boolean,
            required:true,
            default:false
        },
        direct:{
              type:String,
            required:false,
            default:'row'
        },
        btns: {
            type: Array,
            required: false,
            default: [
                {
                    text: '保存',
                    primary:true,
                    func: function () {

                    }
                },
                {
                    text: '取消',
                    func: function () {

                    }
                },
            ]

        }
    }
}
</script>
<style lang="scss" scoped>
.custom-dialog-title {
    color: #fff;
    padding: 0.42rem 0.28rem 0.19rem;
    font-size: 0.36rem;
    text-align: center;
    font-weight: bold;
}
.custom-dialog-content {
    color: #797d8c;
    font-size: 0.28rem;
    padding: 0 0.28rem;
    text-align: center;
}
.custom-dialog-container {
    width: 5.4rem;
    border-radius: 0.14rem;
    background: rgba(41, 41, 51, 1);
}
.custom-dialog-btns {
    margin-top: 0.36rem;
}
.custom-dialog-btns-ul{
    display: flex;
    width: 100%
}
.custom-dialog-btns-item {
    height: 0.98rem;
    line-height: 0.98rem;
    color: rgba(235, 235, 245, 0.3);
    font-size: 0.36rem;
    border-top: 2px solid #222;
    border-color: rgba(0, 0, 0, 0.15);
    text-align: center;
    font-weight: bold;
    flex: 1;
    border-left:2px solid #222;
    &:first-child{
        border-left: none
    }
}
.primary {
    color: #4c94ff;
}
</style>