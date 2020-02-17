<template>
  <div class="authBox">
    <img class="authImg" :src="img" />
    <div class="authTipTitle">{{content}}</div>
    <div v-show="buttonTitle!='null'" class="authTipButton" @click="buttonAction">{{buttonTitle}}</div>
  </div>
</template>

<script>
export default {
  name: "BlankView",
  props: {
    content: {
      type: String,
      required: true,
      default: "内容"
    },
    img: {
      type: String,
      required: true,
      default: "xx"
    },
    buttonTitle: {
      type: String,
      required: false,
      default: "null"
    },
    action: {
      type: Function,
      required: false,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    buttonAction() {
      if (this.action) {
        this.action();
      }
    }
  }
};
</script>

<style scoped  lang="scss">
.authBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  .authImg {
    width: 2.4rem;
  }
  .authTipTitle {
    box-sizing: border-box;
    height: 0.48rem;
    font-size: 0.32rem;
    font-weight: 400;
    color: rgba(235, 235, 245, 0.3);
    line-height: 0.48rem;
    margin-top: 0.16rem;
  }
  .authTipButton {
    box-sizing: border-box;
    height: 0.8rem;
    padding: 0 0.7rem;
    background: rgba(51, 133, 255, 1);
    border-radius: 0.4rem;
    font-size: 0.34rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 1);
    line-height: 0.8rem;
    text-align: center;
    margin-top: 0.24rem;
  }
}
</style>
