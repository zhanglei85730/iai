<template>
    <div id="App">
        <router-view></router-view>
    </div>
</template>

<script>
import { initPage, saveInfoToStorage, gobackForIaiTrader } from '@public/js/util.js'
export default {
    name: 'App',
    mounted() {
        const t = this;
        // 提供给iai-trade app 调用的方法
        window.fromFlutter = function (path, type = 'push') {
            t.$router.push(path);
            // console.log('path='+path)
            // try{
            //      const _route= t.$router[type]
            //      _route(path);
            // }catch(e){
            //     console.log(e.message)
            // }
        }
        window.refreshPage = function (queryPamrs) {
            console.log('queryPamrs0000000000000000000000000000=' + queryPamrs)
            initPage(t.$router, queryPamrs);
        }
        window.updateUserInfo = function (data = {}) {
            saveInfoToStorage(data);
        }
        //提供给iai-trade flutter app 手势返回
        window.gobackForIaiTraderApp = function () {
            if (
                t.$route.name != "winList" &&
                t.$route.name != "minePage" &&
                t.$route.name != "iaiTraderAppIndex" &&
                t.$route.name != "advanceAssign" &&
                t.$route.name != "myWarning"
            ) {
                t.$router.go(-1);
            } else {
                //不是上述几个页面，特殊处理
                if (t.$route.name == "login") {
                    t.$router.push({ name: "minePage" });
                } else if (vueContext.$route.name == "myWarning") {
                    t.$router.push({ name: "minePage" });
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped="" type="text/css">
</style>
