<template>
    <!-- 图片容器框 试图片居中 -->
    <div class="image-box">
         <slot name="content"></slot>
    </div>
</template>
<script>
</script>
<style scoped lang="scss">
  .image-box{
      text-align: center;
      margin:0 30px;
      img{
          max-width:95%
      }
  }
</style>

