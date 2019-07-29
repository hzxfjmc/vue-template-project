<template lang="pug">
.yx-hk-filed.border-bottom
    .field-title(v-if="$attrs.value") {{$attrs.placeholder}}
    van-field(
        v-bind="$attrs"
        v-on="listeners"
        :maxlength="$attrs.maxlength || 50"
        @focus="focusFlag = true"
        @blur="focusFlag = false"
        )
        .button.text-color2(v-if=" $attrs.arrow === '' || $attrs.arrow" slot="button" )
            .iconfont.icon-pulldown_icon
    .yk-hk-tip(v-if="fieldTip && !focusFlag && !$attrs.value") {{fieldTip}}
</template>

<script>
import { Icon } from 'vant'
export default {
    data() {
        return {
            focusFlag: false
        }
    },
    inheritAttrs: false,
    components: {
        [Icon.name]: Icon
    },
    props: {
        fieldTip: {
            type: String,
            default: ''
        }
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

<style lang="scss">
.yx-hk-filed {
    height: 70px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .van-cell:after {
        border: none;
    }
    .van-cell {
        font-size: 16px;
        padding: 0;
    }
    ::-webkit-input-placeholder {
        color: $hk-text-color2;
    }
    .yk-hk-tip {
        padding: 0;
        font-size: 12px;
        color: $hk-text-color2;
    }
    .icon-pulldown_icon {
        color: #ebebeb;
        font-size: 12px;
    }
}
</style>
