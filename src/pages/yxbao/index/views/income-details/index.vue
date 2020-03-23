<template lang="pug">
    .block__order--content
        .block__header--wrapper
            .block__left
                .top 持仓金额(港币）
                .bottom.block__amount 2.3456
            .block__right
                .top 累计收益
                .bottom 110.48
        hr
        .block__order--list.border-bottom
            .block__order--left
                p.title 普通转出
                p.color 2019-07-10 15:55:08
            .block__order--right
                p.num -10.88
                p.color 余额 1237.40
        .block__no-more 没有更多啦

</template>
<script>
import { getBaoCapitalTradeList } from '@/service/finance-server.js'
export default {
    data() {
        return {}
    },
    created() {
        this.getBaoCapitalTradeList()
    },
    methods: {
        async getBaoCapitalTradeList() {
            try {
                const res = await getBaoCapitalTradeList({
                    currency: 2,
                    recordType: 1
                })
                console.log(res)
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__header--wrapper {
    padding: 24px 12px 16px 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .top {
        color: $text-color6;
    }
    .bottom {
        font-family: yxFontDINPro-Medium;
        font-size: 28px;
    }
    .block__amount {
        color: #ff5431;
    }
}
hr {
    height: 6px;
    border: none;
    background: rgba(25, 25, 25, 0.05);
}
.block__order--content {
    background: #fff;
    width: 100%;
    height: 100%;
    .block__order--list {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 82px;
        align-items: center;
        .block__order--left {
            margin: 0 0 0 12px;
            .title {
                font-size: 16px;
            }
        }
        .block__order--right {
            margin: 0 12px 0 0;
            text-align: right;
            .num {
                font-size: 18px;
            }
        }
        p {
            line-height: 26px;
        }
        .color {
            color: rgba(25, 25, 25, 0.65);
        }
    }
    .block__no-more {
        width: 100%;
        text-align: center;
        color: rgba(25, 25, 25, 0.45);
        line-height: 20px;
        margin: 20px 0 0 0;
    }
}
</style>
