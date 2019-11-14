<template lang="pug">
    .yx-popup
        van-popup(
        v-model="show"
        v-bind="$attrs"
        :class="isPhoneX ? 'fix-bottom':''"
        )
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
        },
        isPhoneX() {
            return (
                /iphone/gi.test(window.navigator.userAgent) &&
                window.screen.height >= 812
            )
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
    .van-popup--bottom.fix-bottom {
        bottom: 30px !important;
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
