<!-- 价格盯盘列表、组合指标盯盘列表-->
<template>
    <div
        slot="page-body"
        class="warning-index">
        <SelectList :data="tabContentData" />
    </div>
</template>

<script>
import SelectList from '../components/SelectList'
import i18n from '@warning/i18n';

export default {
    props: {
      tabContentData: {
          type: Array,
          required: true
      },
    },
    components: {
        SelectList
    },
    data() {
        const t = this;
        return {
            title: t.$t('common').warning
        }
    },
    i18n
}
</script>
<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
.warning-index {
}
</style>