<template lang="pug">
.funds-details-header
    .fund-details-header-top
        h3 {{fundHeaderInfoVO.fundName}}
        .funds-details-subtitle 
            span ISIN：{{fundHeaderInfoVO.isin}}
        .block-left
            .fund_tag
                em.iconfont.icon-iconsjijinfengxiancopy-copy 
                span {{ fundHeaderInfoVO.assetTypeName }}
            .fund_tag
                em.iconfont.icon-iconsjijinfengxian
                span {{ fundHeaderInfoVO.fundRisk }}
            .fund_tag
                em.iconfont.icon-iconsjijinfengxiancopy-copy1
                span {{ fundHeaderInfoVO.earningsTypeName }}
        .block__right--tag(
            @click="confirmAlter"
            v-if="tagShow")
            .blcok__tag--left.iconfont.icon-warning1
            .block__tag--right
                p(v-if="tagsShow") {{$t('Derivatives')}} 
                p {{$t('Complex')}}
    .funds-details-number.border-bottom
        .header-left
            span {{isMonetaryFund ? $t('yieldInLast7d'):$t('oneYearShow')}}
            img(v-if="isMonetaryFund" src="@/assets/img/fund/tip.png" class="tipWarning" @click="yieldInLast7dClick")
            p(
                v-if="fundHeaderInfoVO.apy >0" 
                :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{fundHeaderInfoVO.apy}}%
            p(
                v-else-if="fundHeaderInfoVO.apy<0" 
                :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{fundHeaderInfoVO.apy}}%
            p(v-else) {{fundHeaderInfoVO.apy}}%
        .header-right
            span {{fundHeaderInfoVO.code === 1 ? $t('purchase') : $t('pirchaseHk')}}（{{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}}）
            p.number-black {{fundHeaderInfoVO.initialInvestAmount}}
    .funds-details-footer
        .block__details--left
            template(v-if="isMonetaryFund")
                span {{$t('tenKRTN')}}({{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}})：
                span {{this.revenue}}
            template(v-else)
                span {{$t('fundPrice')}}({{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}})：{{fundHeaderInfoVO.netPrice}}
                span(
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    v-if="this.price>0") (+{{this.price}}%)
                span(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    v-else-if="this.price<0") ({{this.price}}%)
                span(v-else) ({{this.price}}%)
        .block__details--right
            span {{$t('update')}}：{{fundHeaderInfoVO.belongDay}}
</template>
<script>
import dayjs from 'dayjs'
import { Tag } from 'vant'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    components: {
        [Tag.name]: Tag
    },
    i18n: {
        zhCHS: {
            Derivatives: '衍生产品',
            Complex: '复杂产品',
            fundPrice: '基金净值',
            minInvestment: '起投金额',
            purchase: '起购金额',
            pirchaseHk: '起购金额',
            update: '更新时间',
            oneYearShow: '近一年涨跌幅',
            yieldInLast7d: '近七日年化',
            hkd: '港币',
            usd: '美元',
            iknow: '我知道了',
            content:
                '您目前期望申购的开放式公募基金为获香港证监会认可的衍生产品及复杂产品，请根据您自身风险偏好和风险承受能力做出审慎判断。请注意投资此类产品或可导致阁下遭受巨大损失，损失金额或可大于投资本金。也请注意证监会认可不等同于对该产品作出推介或认许，亦不是对该产品的商业利弊或业绩表现作出保证。点击继续操作将视为您自愿承担该产品风险及损失，友信并未主动向您推荐该产品。\n若您未有衍生品相关知识，请注意购买此类产品或可存在一些您无法理解的风险及损失，请依据自己的实际情况、风险承受能力以及风险偏好做出谨慎选择。',
            contentHk:
                '您目前期望申购的开放式公募基金为获香港证监会认可的衍生产品及复杂产品，请根据您自身风险偏好和风险承受能力做出审慎判断。请注意投资此类产品或可导致阁下遭受巨大损失，损失金额或可大于投资本金。也请注意证监会认可不等同于对该产品作出推介或认许，亦不是对该产品的商业利弊或业绩表现作出保证。点击继续操作将视为您自愿承担该产品风险及损失，友信并未主动向您推荐该产品。\n若您未有衍生品相关知识，请注意购买此类产品或可存在一些您无法理解的风险及损失，请依据自己的实际情况、风险承受能力以及风险偏好做出谨慎选择。',
            tenKRTN: '萬元收益',
            yieldInLast7dTips:
                '货币基金的七日年化收益率是通过计算其近七日收益率，并进行单利年化，从而模拟出其平均每年能够为投资者创造的收益。由于是模拟短期业绩，并不代表基金的真实年收益率，因此仅供参考用。<br/>计算公式：七日年化=（T日nav-（T-7）日nav）/T-7日nav/自然日天数*365*100%'
        },
        zhCHT: {
            Derivatives: '衍生產品',
            Complex: '複雜產品',
            fundPrice: '基金價格',
            minInvestment: '起投金額',
            oneYearShow: '近一年漲跌幅',
            yieldInLast7d: '近七日年化',
            hkd: '港幣',
            usd: '美元',
            purchase: '起購金額',
            pirchaseHk: '最低認購費',
            update: '更新時間',
            iknow: '我知道了',
            content:
                '您目前期望的申購購置的開放式公募基金為獲香港證監會認可的衍生產品及復雜產品，請根據您自身的風險和風險承受能力作出審慎判斷。請注意投資此類產品或可導致重大的重大損失 ，則損失金額或可增加投資本金。也請注意證監會認可不相等於該產品承諾推廣或認許，亦不是該產品的商業利弊或業績表現作出保證。 承擔該產品風險及損失，友信重新主動向您推薦該產品。\n若您未有衍生品相關知識，請注意購買此類產品或可存在一些您無法理解的風險及損失，請根據自己的實際情況，風險承受能力以及風險做出適當的選擇。',
            contentHk:
                '您目前期望的認購購置的開放式公募基金為獲香港證監會認可的衍生產品及復雜產品，請根據您自身的風險和風險承受能力作出審慎判斷。請注意投資此類產品或可導致重大的重大損失 ，則損失金額或可增加投資本金。也請注意證監會認可不相等於該產品承諾推廣或認許，亦不是該產品的商業利弊或業績表現作出保證。 承擔該產品風險及損失，友信重新主動向您推薦該產品。\n若您未有衍生品相關知識，請注意購買此類產品或可存在一些您無法理解的風險及損失，請根據自己的實際情況，風險承受能力以及風險做出適當的選擇。',
            tenKRTN: '万元收益',
            yieldInLast7dTips:
                '貨幣基金的七日年化收益率是通過計算其近七日收益率，並進行單利年化，從而模擬出其平均每年能夠為投資者創造的收益。由於是模擬短期業績，並不代表基金的真實年收益率，因此僅供參考。<br/>計算公式：七日年化=（T日nav-（T-7）日nav）/T-7日nav/自然日天數*365*100%'
        },
        en: {
            Derivatives: 'Derivatives',
            Complex: 'Complex',
            fundPrice: 'NAV',
            minInvestment: 'Min. Initial Investment',
            oneYearShow: '1-Year Rtn(Cum)',
            hkd: 'HKD',
            usd: 'USD',
            yieldInLast7d: 'Yield in Last 7d',
            purchase: 'Min. Subs. Amount',
            pirchaseHk: 'Min. Subs. Amount',
            update: 'Update Time',
            iknow: 'I get it',
            content:
                'This SFC authorized open-ended fund to be purchased is a derivative product and a complex product. Please note that investment in such products may cause huge losses, which might be greater than the original investment amount. Please cautiously evaluate your own risk appetite and risk tolerance prior to subscription. The SFC authorization does not imply official recommendation, or that SFC authorization is not a recommendation or endorsement of a product nor does it guarantee the commercial merits of a product or its performance.\nClicking on the operation will be deemed as voluntarily bearing the risks and losses of the product, and uSMART has made no recommendation of this product.\nIf you do not have knowledge of derivatives or other complex investments, please note that there may be risks and losses that you cannot understand when purchasing such products. Please evaluate your actual situation, risk tolerance, and risk appetite prior to making any investments, please be prudent and wise.',
            contentHk:
                'This SFC authorized open-ended fund to be purchased is a derivative product and a complex product. Please note that investment in such products may cause huge losses, which might be greater than the original investment amount. Please cautiously evaluate your own risk appetite and risk tolerance prior to subscription. The SFC authorization does not imply official recommendation, or that SFC authorization is not a recommendation or endorsement of a product nor does it guarantee the commercial merits of a product or its performance.\nClicking on the operation will be deemed as voluntarily bearing the risks and losses of the product, and uSMART has made no recommendation of this product.\nIf you do not have knowledge of derivatives or other complex investments, please note that there may be risks and losses that you cannot understand when purchasing such products. Please evaluate your actual situation, risk tolerance, and risk appetite prior to making any investments, please be prudent and wise.',
            tenKRTN: '10K RTN',
            yieldInLast7dTips:
                "The money market fund's annualized 7-day-return tries to reflect the average annual return for investors by annualizing the most recent 7-day-return.Please note that this data is fo reference only since it does not represent the realized annual return.<br/>Calculation Formula：<br/>Yield in Last 7d=（T-day nav-（T-7）-day nav）/（T-7）-day nav/Natural Days*365*100%"
        }
    },
    props: {
        price: {
            type: String,
            default: ''
        },
        revenue: {
            type: String,
            default: ''
        },
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        },
        tagShow: {
            type: Boolean,
            default: false
        },
        tagsShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            nowDate: dayjs(Date.parse(new Date())).format('MMDDYYYY')
        }
    },
    methods: {
        confirmAlter() {
            let contentMessage =
                this.fundHeaderInfoVO.code === 1
                    ? this.$t('content')
                    : this.$t('contentHk')
            this.$dialog.alert({
                message: contentMessage,
                confirmButtonText: this.$t('iknow')
            })
        },
        yieldInLast7dClick() {
            this.$dialog.alert({
                title: this.$t('yieldInLast7d'),
                message: this.$t('yieldInLast7dTips'),
                confirmButtonText: this.$t('iknow'),
                messageAlign: 'left'
            })
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        isMonetaryFund() {
            return Number(this.fundHeaderInfoVO.assetType) === 4 // 货币型基金
        }
        // tagShow() {
        //     return this.fundHeaderInfoVO.derivativeType !== 1
        // },
        // tag1Show() {
        //     return this.fundHeaderInfoVO.derivativeType !== 3
        // }
    }
}
</script>
<style lang="scss" scoped>
.funds-details-header {
    background: $background-color;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 174px;
    background: #fff;
    .fund-details-header-top {
        width: 100%;
        padding: 10px;
        background: #fbfcfe;
        position: relative;
        .block__right--tag {
            position: absolute;
            width: 86px;
            height: 38px;
            border-top-left-radius: 32px;
            border-bottom-left-radius: 32px;
            border: 1px solid #edc92c;
            border-right: none;
            line-height: 32px;
            display: flex;
            align-items: center;
            bottom: 14px;
            right: 0;
            .iconfont {
                color: #edc92c;
                margin: 0 0 0 10px;
            }
            .block__tag--right {
                font-size: 9px;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                p {
                    line-height: 16px;
                    margin: 0 0 0 2px;
                }
            }
        }
    }
    h3 {
        font-size: 0.32rem;
        color: $text-color;
        margin: 10px 0 3px 0;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .funds-details-subtitle {
        color: $text-color3;
        width: 100%;
        display: flex;
        font-size: 0.24rem;
    }
    .block-left {
        display: flex;
        .fund_tag {
            margin: 0 8px 0 0;
            display: flex;
            flex-direction: row;
            span {
                font-size: 10px;
                line-height: 25px;
                color: #666666;
            }
        }
        .iconfont {
            font-size: 16px;
        }
        .icon-iconsjijinfengxiancopy-copy {
            color: #b38c23;
        }
        .icon-iconsjijinfengxian {
            color: #d0524a;
        }
        .icon-iconsjijinfengxiancopy-copy1 {
            color: #f8d61c;
        }
    }
    .funds-details-number {
        width: 100%;
        padding: 10px 10px 20px 10px;
        background: #fff;
        display: flex;
        flex-direction: row;
        .header-left,
        .header-right {
            p {
                font-size: 0.56rem;
                font-weight: 500;
                font-family: yxFontDINPro-Medium;
            }
            .number-red {
                color: rgba(234, 61, 61, 1);
            }
            .number-green {
                color: #04ba60;
            }
            .number-black {
                color: $text-color;
            }
            span {
                color: $text-color5;
                font-size: 0.24rem;
            }
        }
        .header-left {
            margin: 0 40px 0 0;
            .tipWarning {
                width: 20px;
                height: 20px;
                padding: 3px;
            }
        }
    }
    .funds-details-footer {
        width: 100%;
        background: #fff;
        display: flex;
        flex-direction: row;
        padding: 10px;
        font-size: 11px;
        color: $text-color5;
        .block__details--left {
            width: 50%;
        }
        .number-red {
            color: rgba(234, 61, 61, 1);
        }
        .number-green {
            color: #04ba60;
        }
        .block__details--right {
            width: 50%;
            text-align: right;
        }
    }
}
</style>
