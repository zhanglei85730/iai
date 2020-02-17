<template>
    <div class="index-loading">
        <cube-loading :size="40"></cube-loading> {{$t('common.loadingText')}}
    </div>
</template>
<script>
import i18n from '@warning/i18n';
export default {
    data(){
        return {

        }
    },
    i18n
}
</script>

<style lang="scss" scope>
@import "@public/css/warningGlobal.scss";
    .index-loading{
        height:100vh;
        width:100vw;
        background:$commonBackgroundDark;
        display: flex;
        justify-content: center;
        align-items: center
    }
</style>

