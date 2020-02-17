<template>
    <div class="button-container">
        <button class="button" :style="[getBaseStyles]" v-if="type!=='simple'" @click="clientEvent">{{value}}</button>
        <button class="button simple" :style="[getBaseStyles]" v-else @click="clientEvent">{{value}}</button>
    </div>
</template>
<script>
export default {
    props: {
        width: {
            type: String,
            required: false,
            default: '60%'
        },
        height: {
            type: String,
            required: false,
        },
        value: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: false,
        },
        clientEvent:{
             type: Function,
            required: false,
            default:()=>{}
        }

    },
    computed: {
        getBaseStyles() {
            return {
                width: this.width,
                height: this.height,
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import "@public/css/appGlobal.scss";

.button-container {
    text-align: center;
    padding: 0.2rem;
    .simple {
        background: none;
        color: $commonColorBlur;
        border: $commonBorderWidth solid $commonColorBlur;
    }
}
.button {
    background: $commonColorBlur;
    line-height: 1rem;
    text-align: center;
    color: #2E2E3B;
    font-size: $commonFsButton;
    border: none;
    margin-left: auto;
    margin-right: auto;
    border-radius: 0.1rem;
    outline: none
}
</style>

