<template lang="pug">
.block__element-wrapper
    .block__out--header
        p.title 转出金额
        .block__out--wrapper.border-bottom
            span.label HKD
            van-number-keyboard(
                :show="show"
                theme="custom"
                extra-key="."
                close-button-text="完成"
                @blur="show = false"
                @input="onInput"
                @delete="onDelete"
                )
            //- input(placeholder="请输入转出金额")
            span.block__all--out 全部转出
        p.desc 预计02-05开始收益
        .block__list
            .block__list--item.common-flex-space-between
                .block__list--left 手续费(预计)
                .block__list--right.common-flex-center
                    span.block__tips.common-flex-center 
                        em.num 0.00 
                        em 港币
                    p 50.00港币
            .block__list--item.common-flex-space-between
                .block__list--left 预计到账金额
                .block__list--right 9995.00

    .block__out--title.common-flex-space-between.border-bottom.common-marge-top
        p.title 转出方式
        p.tips 转出方式及额度规则
            em.iconfont.icon-iconEBgengduoCopy
    .block__out--content
        .block__out--list
            .left.iconfont.icon-unchecked
            .right
                p 普通转出
                p.desc 点前到账，转出后可立即购买股票，无额度限制，期间正常享受收益
        .block__out--list
            .left.iconfont.icon-icon-checkbox-selected
            .right
                p 普通转出
                p.desc 点前到账，转出后可立即购买股票，无额度限制，期间正常享受收益

</template>
<script>
import { NumberKeyboard } from 'vant-fork'
export default {
    components: {
        NumberKeyboard
    },
    data() {
        return {
            show: true,
            value: ''
        }
    },
    methods: {
        onInput(val) {
            console.log(val)
        },
        onDelete() {}
    }
}
</script>
<style lang="scss" scoped>
.title {
    font-size: 16px;
}
.block__out--header {
    padding: 20px 12px;
    background: #fff;

    .block__out--wrapper {
        margin: 14px 0 0 0;
        padding: 0 0 9px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        .label {
            font-size: 24px;
        }
        input {
            margin: 3px 10px 0 10px;
            font-size: 24px;
            // border: none;
            height: 40px;
            line-height: 40px;
            width: 220px;
        }
        input::-webkit-input-placeholder {
            font-size: 14px; /*WebKit browsers*/
            // line-height: 40px;
        }
        input::-moz-placeholder {
            font-size: 14px; /*Mozilla Firefox 4 to 18 */
            line-height: 40px;
        }
        input::-moz-placeholder {
            font-size: 14; /*Mozilla Firefox 19+ */
            line-height: 40px;
        }
        input::-ms-input-placeholder {
            font-size: 14px; /*Internet Explorer 10+*/
            line-height: 40px;
        }
        .block__all--out {
            font-size: 14px;
            flex: 1;
            text-align: right;
        }
    }
    .desc {
        font-size: 12px;
        margin: 9px 0;
        color: $text-color6;
    }
    .block__list {
        display: flex;
        flex-direction: column;
        .block__list--item {
            color: $text-color6;
            margin: 20px 0 0 0;
            .block__list--right {
                color: $text-color;
                font-size: 16px;
                span {
                    width: 65px;
                    font-size: 14px;
                    margin: 0 10px;
                    height: 20px;
                    background: #fb7123;
                    line-height: 20px;
                    border-radius: 5px;
                    color: #fff;
                    position: relative;
                    em {
                        font-style: normal;
                        font-size: 12px;
                        display: inline-block;
                        height: 100%;
                    }
                    .num {
                        // line-height: 20px;
                        font-size: 14px;
                        display: inline-block;
                        height: 100%;
                    }
                    &:after {
                        content: '';
                        border-top: 4px solid transparent;
                        border-bottom: 4px solid transparent;
                        border-left: 4px solid #fb7123;
                        width: 0;
                        height: 0;
                        right: -4px;
                        position: absolute;
                    }
                }
            }
        }
    }
}
.block__out--title {
    background: #fff;
    padding: 20px 12px 12px 12px;
    .tips {
        color: $text-color6;
        em {
            font-size: 15px;
        }
    }
}
.block__out--content {
    background: #fff;
    padding: 0 12px 14px 12px;
    .block__out--list {
        display: flex;
        padding: 14px 0 0 0;
        flex-direction: row;
        .left {
            width: 20px;
        }
        .right {
            flex: 1;
        }
    }
}
</style>
