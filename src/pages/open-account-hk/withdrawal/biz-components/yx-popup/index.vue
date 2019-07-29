<template lang="pug">
    .yx-popup
        van-popup(
        v-model="show"
        v-bind="$attrs")
            slot
</template>

<script>
import { Popup } from 'vant'
export default {
    components: {
        [Popup.name]: Popup
    },
    inheritAttrs: false,
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>
<style lang="scss">
.yx-popup {
    .van-popup--bottom {
        width: 90%;
        top: auto;
        bottom: 20px;
        right: auto;
        border-radius: 20px;
    }
    .van-picker__toolbar::after {
        border: none;
    }
    .van-picker__cancel {
        opacity: 0.6;
        color: $hk-text-color;
    }
}
</style>
