<template>
    <div>
         <MainLayout
            :title="$route.meta.title"
            :headerStyle="$config.headerStyle"
            class="common-layout-back"
            :isShowBackWord="false"
        >
            <div
                slot="page-body"               
            >
                <div class="error-page">
                <i class="cubeic-sad error-page-icon"></i>
                <div class="error-page-txt"> {{this.$route.query.message}}</div>
                 </div>
            </div>
         </MainLayout>
    </div>
</template>
<script>
// import ErrorPage from '@components/ErrorPage.vue'
export default {
    // components: {
    //     ErrorPage
    // }
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.error-page{
    text-align: center;
    width:80%;
    margin:60px auto 0;
 .error-page-icon{
     font-size:90px;
     color:$commonOrgange
 }
 .error-page-txt{
     color:#fff;
     line-height:$commonLineHeight01 
 }
}
</style>


