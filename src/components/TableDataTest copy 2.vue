<template>
    <div class="ant-table-container ant-table-layout-fixed" style="margin:100px 20px">
        <!-- ============固定列===================== -->
        <div class="ant-table-fixed-left">
            <div class="ant-table-header">
                <table class="ant-table-fixed">
                    <thead class="ant-table-thead">
                        <tr class="ant-table-row">
                            <th>固定列</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="ant-table-body-outer" style="height:200px;overflow:hidden"  ref="fixedScroll">
                <div class="ant-table-body-inner">
                    <table class="ant-table-fixed">
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row">
                                <td>固定列内容</td>
                            </tr>
                            <tr class="ant-table-row">
                                <td>固定列内容</td>
                            </tr>
                             <tr class="ant-table-row">
                                <td>固定列内容</td>
                            </tr>
                            <tr class="ant-table-row">
                                <td>固定列内容</td>
                            </tr>
                             <tr class="ant-table-row">
                                <td>固定列内容</td>
                            </tr>
                            <tr class="ant-table-row">
                                <td>固定列内容</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        <!-- =====================表格主要内容========================= -->
        <div class="ant-table-scroll"  style="overflow-x:scroll">
            <!-- 表头 -->
            <div class="ant-table-header" style="width:760px;">
                <table class="ant-table-fixed">
                    <thead class="ant-table-thead">
                        <tr>
                            <th>内容头1</th>
                            <th>内容头2</th>
                            <th>内容头3</th>
                            <th>内容头4</th>
                            <th>内容头5</th>
                            <th>内容头6</th>
                            <th>内容头7</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <!-- 内容 -->
            <div class="ant-table-body" style="width:760px;height:200px;overflow-y:scroll" ref="tableMainScroll">
                <table class="ant-table-fixed">
                    <tbody class="ant-table-tbody">
                        <tr class="ant-table-row">
                            <td>内容列100</td>
                            <td>内容列2</td>
                            <td>内容列3</td>
                            <td>内容列4</td>
                            <td>内容列5</td>
                            <td>内容列6</td>
                            <td>内容列7</td>

                        </tr>
                         <tr class="ant-table-row">
                            <td>内容列1</td>
                            <td>内容列2</td>
                            <td>内容列3</td>
                            <td>内容列4</td>
                            <td>内容列5</td>
                            <td>内容列6</td>
                            <td>内容列7</td>
                        </tr>
                         <tr class="ant-table-row">
                            <td>内容列1</td>
                            <td>内容列2</td>
                            <td>内容列3</td>
                            <td>内容列4</td>
                            <td>内容列5</td>
                            <td>内容列6</td>
                            <td>内容列7</td>

                        </tr>
                         <tr class="ant-table-row">
                            <td>内容列1</td>
                            <td>内容列2</td>
                            <td>内容列3</td>
                            <td>内容列4</td>
                            <td>内容列5</td>
                            <td>内容列6</td>
                            <td>内容列7</td>
                        </tr>
                         <tr class="ant-table-row">
                            <td>内容列1</td>
                            <td>内容列2</td>
                            <td>内容列3</td>
                            <td>内容列4</td>
                            <td>内容列5</td>
                            <td>内容列6</td>
                            <td>内容列7</td>

                        </tr>
                         <tr class="ant-table-row">
                            <td>内容列1</td>
                            <td>内容列2</td>
                            <td>内容列3</td>
                            <td>内容列4</td>
                            <td>内容列5</td>
                            <td>内容列6</td>
                            <td>内容列7</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        tableMainScroll(){
            console.log(this.$refs.tableMainScroll.scrollTop)
            this.$refs.fixedScroll.scrollTop=this.$refs.tableMainScroll.scrollTop
        }
    },
    mounted(){
        this.$refs.tableMainScroll.addEventListener('scroll',this.tableMainScroll)
    }
}
</script>
<style lang="scss" scoped>
.ant-table-layout-fixed{
    table{
        table-layout: fixed
    }
}
.ant-table-container{
    table{
        border-collapse: collapse;
        border:0,
    }
    position:relative;
    padding-left:100px;
    .ant-table-fixed-left{
        position: absolute;
        left:0;
        top:0
    }
    .ant-table-tbody>tr>td,.ant-table-thead>tr>th
    {
        width:100px;
        border:1px solid #000;
        height:40px;
        vertical-align: middle;
        text-align: center;

    }
    .ant-table-fixed-left{
        background:#ccc;
        position: absolute;
        top:0
    }
    .ant-table-scroll{
        min-width: 100%;
        // padding-top:40px;
        .ant-table-header{
            // position: fixed;
        }
    }
}
</style>