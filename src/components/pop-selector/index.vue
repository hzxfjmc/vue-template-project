<template lang="pug">
    .pop-selector
        van-picker.picker(
        v-bind="$attrs"
        :item-height="50"
        v-on="listeners"
        )
</template>
<script>
import { Picker } from 'vant'
export default {
    components: {
        [Picker.name]: Picker
    },
    computed: {
        listeners() {
            return {
                ...this.$listeners
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.pop-selector {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(57, 57, 57, 0.2);
    .picker {
        height: 254px;
        width: 323px;
        margin: 0 auto;
        border-radius: 20px;
        position: absolute;
        bottom: 40px;
        left: 50%;
        margin-left: -161.5px;
        /deep/ {
            .van-picker__toolbar {
                height: 62px;
                line-height: 62px;
                &::after {
                    content: none;
                }
            }
            $padding: 0 26px;
            .van-picker__cancel {
                color: rgba(57, 57, 57, 0.7);
                padding: $padding;
            }
            .van-picker__confirm {
                padding: $padding;
                color: $primary-color;
            }
        }
    }
}
</style>
