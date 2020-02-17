<template>
    <!-- 状态栏 -->
    <div>
        <div class="layout-statu-bar">test</div>
        <div class="layout-body">

        </div>
    </div>
</template>
<style lang="scss">
body,
html {
    height: 100%;
}
.layout-body {
    height: 100%;
    background: #ccc;
}
@supports (bottom: constant(safe-area-inset-bottom)) or
    (bottom: env(safe-area-inset-bottom)) {
    .layout-body {
        height: calc(100 - env(safe-area-inset-bottom));
        background: rgb(8, 48, 180);
    }
    .layout-statu-bar {
        color: #fff;
        background: #f60;
        height: constant(safe-area-inset-bottom);
        height: env(safe-area-inset-top);
    }
}
</style>