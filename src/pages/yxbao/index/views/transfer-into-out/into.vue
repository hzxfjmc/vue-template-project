<template lang="pug">
.block__element-wrapper
    .block__out--header
        p.title 转入金额
        NumberKeyboard(
            placeholder="10000.00港币起"
        )
        p.desc 预计02-05开始收益
       

    .block__out--title.common-flex-space-between.common-marge-top
        p.title 转出方式
        .tips 
            p.tips--top uSMART证券账户
            p.tips--bottom 可用余额：单笔1000.00港币
    van-button.btn(:disabled="disabled") 转入

</template>
<script>
import NumberKeyboard from './number-keyboard'
export default {
    components: {
        NumberKeyboard
    },
    data() {
        return {
            disabled: true
        }
    },
    methods: {}
}
</script>
<style lang="scss" scoped>
.btn {
    background: #0d50d8;
    color: #fff;
    width: 343px;
    height: 48px;
    font-size: 16px;
    margin: 20px 16px;
    border-radius: 6px;
}
.title {
    font-size: 16px;
}
.block__out--header {
    padding: 20px 12px 0 12px;
    background: #fff;
    .desc {
        font-size: 12px;
        padding: 9px 0;
        color: $text-color6;
    }
}
.block__out--title {
    background: #fff;
    padding: 15px 12px 14px 12px;
    .tips {
        text-align: right;
        .tips--top {
            font-size: 16px;
            color: $text-color;
        }
        .tips--bottom {
            color: $text-color6;
            font-size: 12px;
            padding: 6px 0 0 0;
        }
    }
}
</style>
