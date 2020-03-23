<template lang="pug">
.block__fund--trading
    .block__fundheader--survey(@click="tofundTrade")
        em.iconfont.icon-iconEBshoucang1
        span.title {{$t('rule')}}
        .block__list--right
            span {{$t('tips')}}
            em.iconfont.icon-iconEBgengduoCopy

    .block__fundcontent--list
        FundSteps(
            style="margin-top: -5px;"
            :curStep="3"
            :stepNames="[buySubmit.label,buyConfirm.label ,buyProfitLoss.label ]"
            :stepTimes="[fundTradeInfoVO.buySubmit,fundTradeInfoVO.buyConfirm ,fundTradeInfoVO.buyProfitLoss ]")
        .block__list--item
            p.block__list--left {{fundTradeInfoVO.code ? $t('subscriptionFee') : $t('subscriptionFeeHk')}}
            p.block__list--right {{fundTradeInfoVO.subscriptionFee*100|transNumToThousandMark(2)}}%
        .block__list--item
            p.block__list--left {{$t('redemptionFee')}}
            p.block__list--right {{fundTradeInfoVO.redemptionFee*100|transNumToThousandMark(2)}}%
        .block__list--item
            p.block__list--left {{$t('managementFee')}}
            p.block__list--right {{fundTradeInfoVO.managementFee*100|transNumToThousandMark(2)}}%
        .block__list--item
            p.block__list--left {{$t('platformManagementFee')}}
            p.block__list--right {{fundTradeInfoVO.platformManagementFee*100|transNumToThousandMark(2)}}%
</template>
<script>
import FundSteps from '@/biz-components/fond-steps'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'

export default {
    i18n: {
        zhCHS: {
            rule: '交易规则',
            tips: '交易流程、费率',
            subscriptionFee: '申购费',
            subscriptionFeeHk: '申购费',
            redemptionFee: '赎回费',
            managementFee: '基金管理费',
            platformManagementFee: '平台管理费',
            buySubmit: '申购提交',
            buyConfirm: '确认份额',
            buyProfitLoss: '查看盈亏'
        },
        zhCHT: {
            rule: '交易規則',
            tips: '交易流程、費率',
            subscriptionFee: '申購費',
            subscriptionFeeHk: '認購費',
            redemptionFee: '贖回費',
            managementFee: '基金管理費',
            platformManagementFee: '平台管理費',
            buySubmit: '認購提交',
            buyConfirm: '確認份額',
            buyProfitLoss: '查看盈虧'
        },
        en: {
            rule: 'Trading Rules',
            tips: 'Process,Fees',
            subscriptionFee: 'Subscription Fee',
            subscriptionFeeHk: 'Subscription Fee',
            redemptionFee: 'Redemption Fee',
            managementFee: 'Management Fee',
            platformManagementFee: 'Platform Fee',
            buySubmit: 'Submit',
            buyConfirm: 'Allocate Fund Units',
            buyProfitLoss: 'Check P/L'
        }
    },
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
    created() {
        this.buySubmit.label = this.$t('buySubmit')
        this.buyConfirm.label = this.$t('buyConfirm')
        this.buyProfitLoss.label = this.$t('buyProfitLoss')
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
            let url = `${window.location.origin}/wealth/fund/index.html#/trade-rule?id=${this.fundTradeInfoVO.fundId}&assetType=${this.fundTradeInfoVO.assetType}&displayLocation=${this.$route.query.displayLocation}`
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
            line-height: 28px;
        }
        .block__list--left {
            color: rgba(25, 25, 25, 0.5);
        }
        .block__list--right {
            text-align: right;
        }
    }
    .block__list--item:last-child {
        padding: 0 0 14px 0;
    }
}

.block__fund--trading {
    width: 100%;
    padding: 0 3%;
    margin: 6px 0 0 0;
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
        .iconfont {
            font-size: 20px;
        }
    }
}
</style>
