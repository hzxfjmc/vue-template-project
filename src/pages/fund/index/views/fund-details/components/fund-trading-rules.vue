<template lang="pug">
.block__fund--trading
    .block__fundheader--survey(@click="tofundTrade")
        em.iconfont.icon-iconEBshoucang1
        span.title 交易规则
        .block__list--right
            span 交易流程、費率
            em.iconfont.icon-iconEBgengduoCopy

    .block__fundcontent--list
        FundSteps(
            style="margin-top: -5px;"
            :curStep="3"
            :stepNames="[buySubmit.label,buyConfirm.label ,buyProfitLoss.label ]"
            :stepTimes="[fundTradeInfoVO.buySubmit,fundTradeInfoVO.buyConfirm ,fundTradeInfoVO.buyProfitLoss ]")
        .block__list--item
            p.block__list--left 申購費
            p.block__list--right {{fundTradeInfoVO.subscriptionFee|transNumToThousandMark(2)}}%
        .block__list--item
            p.block__list--left 贖回費
            p.block__list--right {{fundTradeInfoVO.redemptionFee|transNumToThousandMark(2)}}%
        .block__list--item
            p.block__list--left 基金管理費
            p.block__list--right {{fundTradeInfoVO.managementFee|transNumToThousandMark(2)}}%
        .block__list--item
            p.block__list--left 平台管理費
            p.block__list--right {{fundTradeInfoVO.platformManagementFee|transNumToThousandMark(2)}}%
</template>
<script>
import FundSteps from '@/biz-components/fond-steps'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'

export default {
    components: {
        FundSteps
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    props: {
        fundTradeInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            buySubmit: {
                label: '买入提交',
                value: ''
            },
            buyConfirm: {
                label: '确认份额',
                value: ''
            },
            buyProfitLoss: {
                label: '查看盈亏',
                value: ''
            }
        }
    },
    methods: {
        tofundTrade() {
            let url = `${window.location.origin}/wealth/fund/index.html#/trade-rule?id=${this.fundTradeInfoVO.fundId}&assetType=${this.fundTradeInfoVO.assetType}`
            jumpUrl(3, url)
        }
    }
}
</script>
<style lang="scss" scoped>
.block__fundcontent--list {
    .block__list--item {
        display: flex;
        flex-direction: row;
        p {
            width: 50%;
            line-height: 25px;
        }
        .block__list--left {
            color: #666666;
        }
        .block__list--right {
            text-align: right;
        }
    }
}

.block__fund--trading {
    width: 100%;
    padding: 0 3%;
    margin: 10px 0 0 0;
    background: #fff;
    .block__fundheader--survey {
        display: flex;
        flex-direction: row;
        padding: 15px 0;
        line-height: 22px;
        .icon-icon-gaishu {
            font-size: 20px;
        }
        .title {
            font-size: 16px;
            margin: 0 0 0 10px;
        }
        .block__list--right {
            margin-right: auto;
            flex-grow: 1; //这三个元素只有它在有空余空间时可伸缩，也就是它占据了所有剩余空间
            display: flex; //将它设置为flex,就可以单独对他进行主轴右对齐
            justify-content: flex-end;
            text-align: right;
            span {
                font-size: 14px;
                color: #666666;
            }
            .iconfont {
                font-size: 15px;
                line-height: 25px;
            }
        }
    }
}
</style>
