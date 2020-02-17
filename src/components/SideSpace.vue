<template>
    <!-- 页面两边间距 -->
    <div class="side-space" :style="getBaseStyle()">
        <slot name='content' ></slot>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
            default: '20px'
        },
        left: {
            type: String,
            required: false,
        },
        right: {
            type: String,
            required: false,
        },
    },
    methods: {
        getBaseStyle(){
            return {
                 marginLeft:this.value,
                 marginRight:this.value,
            }
           
        }
    }
}
</script>
<style scoped lang="scss">
    // .side-space{
    //     margin-left:0.3rem;
    //     margin-right:0.3rem;
    // }
</style>

