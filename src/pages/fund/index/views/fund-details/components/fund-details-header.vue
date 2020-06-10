<template lang="pug">
.funds-details-header
    .fund-details-header-top
        h3 {{fundHeaderInfoVO.fundName}}
        .funds-details-subtitle 
            span ISIN：{{fundHeaderInfoVO.isin}}
            .rate-wrap(@click="morningstarRateAlert")
                span {{fundHeaderInfoVO.morningRating ? this.$t('hasRate') : this.$t('noRate')}}
                star(:score="fundHeaderInfoVO.morningRating")
    .block__right--tag(
        @click="confirmAlter"
        v-if="tagShow")
        //- .blcok__tag--left.iconfont.icon-warning1
        .block__tag--right
            p(v-if="tagsShow") {{$t('Derivatives')}} 
            p {{$t('Complex')}}
    .funds-details-number.border-bottom
        .header-left
            span {{isMonetaryFund ? $t('yieldInLast7d'):$t('oneYearShow')}}
            img(v-if="isMonetaryFund" src="@/assets/img/fund/tip.png" class="tipWarning" @click="yieldInLast7dClick")
            p(
                v-if="apy >0" 
                :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{apy}}%
            p(
                v-else-if="apy<0" 
                :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{apy}}%
            p(v-else) {{apy}}%
        .header-right
            span {{fundHeaderInfoVO.code === 1 ? $t('purchase') : $t('pirchaseHk')}}（{{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}}）
            p.number-black {{fundHeaderInfoVO.netPrice}}
    .funds-details-footer
        fund-tag(:title="fundHeaderInfoVO.assetTypeName")
        fund-tag(:title="fundHeaderInfoVO.fundRisk")
        fund-tag(:title="fundHeaderInfoVO.earningsTypeName")
        //- .block__details--left
        //-     template(v-if="isMonetaryFund")
        //-         span {{$t('tenKRTN')}}({{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}})：
        //-         span {{this.revenue}}
        //-     template(v-else)
        //-         span {{$t('fundPrice')}}({{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}})：{{fundHeaderInfoVO.netPrice}}
        //-         span(
        //-             :class="stockColorType === 1 ? 'number-red' : 'number-green'"
        //-             v-if="this.price>0") (+{{this.price}}%)
        //-         span(
        //-             :class="stockColorType === 1 ? 'number-green' : 'number-red'"
        //-             v-else-if="this.price<0") ({{this.price}}%)
        //-         span(v-else) ({{this.price}}%)
        //- .block__details--right
        //-     span {{$t('update')}}：{{fundHeaderInfoVO.belongDay}}
</template>
<script>
import dayjs from 'dayjs'
import star from '@/components/yx-star'
import { Tag } from 'vant'
import './fund-details-header.scss'
import { getStockColorType } from '@/utils/html-utils.js'
import fundTag from '@/biz-components/fund-tag/index.vue'
export default {
    components: {
        [Tag.name]: Tag,
        'fund-tag': fundTag,
        star
    },
    i18n: {
        zhCHS: {
            Derivatives: '衍生产品',
            Complex: '复杂产品',
            fundPrice: '基金净值',
            minInvestment: '起投金额',
            purchase: '单位净值',
            pirchaseHk: '单位净值',
            update: '更新时间',
            oneYearShow: '近一年涨跌幅',
            yieldInLast7d: '近七日年化',
            hkd: '港币',
            usd: '美元',
            iknow: '我知道了',
            hasRate: '晨星评级',
            noRate: '暂无评级',
            content:
                '您目前期望申购的开放式公募基金为获香港证监会认可的衍生产品及复杂产品，请根据您自身风险偏好和风险承受能力做出审慎判断。请注意投资此类产品或可导致阁下遭受巨大损失，损失金额或可大于投资本金。也请注意证监会认可不等同于对该产品作出推介或认许，亦不是对该产品的商业利弊或业绩表现作出保证。点击继续操作将视为您自愿承担该产品风险及损失，友信并未主动向您推荐该产品。\n若您未有衍生品相关知识，请注意购买此类产品或可存在一些您无法理解的风险及损失，请依据自己的实际情况、风险承受能力以及风险偏好做出谨慎选择。',
            contentHk:
                '您目前期望申购的开放式公募基金为获香港证监会认可的衍生产品及复杂产品，请根据您自身风险偏好和风险承受能力做出审慎判断。请注意投资此类产品或可导致阁下遭受巨大损失，损失金额或可大于投资本金。也请注意证监会认可不等同于对该产品作出推介或认许，亦不是对该产品的商业利弊或业绩表现作出保证。点击继续操作将视为您自愿承担该产品风险及损失，友信并未主动向您推荐该产品。\n若您未有衍生品相关知识，请注意购买此类产品或可存在一些您无法理解的风险及损失，请依据自己的实际情况、风险承受能力以及风险偏好做出谨慎选择。',
            tenKRTN: '萬元收益',
            yieldInLast7dTips:
                '货币基金的七日年化收益率是通过计算其近七日收益率，并进行单利年化，从而模拟出其平均每年能够为投资者创造的收益。由于是模拟短期业绩，并不代表基金的真实年收益率，因此仅供参考用。<br/>计算公式：七日年化=（T日nav-（T-7）日nav）/T-7日nav/自然日天数*365*100%',
            rateMessage:
                '晨星把每只具备3年以上业绩数据的基金归类，在同类基金中，基金按照"晨星风险调整后收益"指标（Morningstar Risk-Adjusted Return）由大到小进行排序：前10%被评为5星；接下来22.5%被评为4星；中间35%被评为3星；随后22.5%被评为2星；最后10%被评为1星。'
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
            purchase: '基金價格',
            pirchaseHk: '基金價格',
            update: '更新時間',
            iknow: '我知道了',
            hasRate: '晨星評級',
            noRate: '暫無評級',
            content:
                '您目前期望的申購購置的開放式公募基金為獲香港證監會認可的衍生產品及復雜產品，請根據您自身的風險和風險承受能力作出審慎判斷。請注意投資此類產品或可導致重大的重大損失 ，則損失金額或可增加投資本金。也請注意證監會認可不相等於該產品承諾推廣或認許，亦不是該產品的商業利弊或業績表現作出保證。 承擔該產品風險及損失，友信重新主動向您推薦該產品。\n若您未有衍生品相關知識，請注意購買此類產品或可存在一些您無法理解的風險及損失，請根據自己的實際情況，風險承受能力以及風險做出適當的選擇。',
            contentHk:
                '您目前期望的認購購置的開放式公募基金為獲香港證監會認可的衍生產品及復雜產品，請根據您自身的風險和風險承受能力作出審慎判斷。請注意投資此類產品或可導致重大的重大損失 ，則損失金額或可增加投資本金。也請注意證監會認可不相等於該產品承諾推廣或認許，亦不是該產品的商業利弊或業績表現作出保證。 承擔該產品風險及損失，友信重新主動向您推薦該產品。\n若您未有衍生品相關知識，請注意購買此類產品或可存在一些您無法理解的風險及損失，請根據自己的實際情況，風險承受能力以及風險做出適當的選擇。',
            tenKRTN: '万元收益',
            yieldInLast7dTips:
                '貨幣基金的七日年化收益率是通過計算其近七日收益率，並進行單利年化，從而模擬出其平均每年能夠為投資者創造的收益。由於是模擬短期業績，並不代表基金的真實年收益率，因此僅供參考。<br/>計算公式：七日年化=（T日nav-（T-7）日nav）/T-7日nav/自然日天數*365*100%',
            rateMessage:
                '晨星把每只具備3年以上業績數據的基金歸類，在同類基金中，基金按照"晨星風險調整後收益"指標（Morningstar Risk-Adjusted Return）由大到小進行排序：前10%被評為5星；接下來22.5%被評為4星；中間35%被評為3星；隨後22.5%被評為2星；最後10%被評為1星。'
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
            purchase: 'NAV',
            pirchaseHk: 'NAV',
            update: 'Update Time',
            iknow: 'Got it',
            hasRate: 'MorningStar Rating',
            noRate: 'No Rate',
            content:
                'This SFC authorized open-ended fund to be purchased is a derivative product and a complex product. Please note that investment in such products may cause huge losses, which might be greater than the original investment amount. Please cautiously evaluate your own risk appetite and risk tolerance prior to subscription. The SFC authorization does not imply official recommendation, or that SFC authorization is not a recommendation or endorsement of a product nor does it guarantee the commercial merits of a product or its performance.\nClicking on the operation will be deemed as voluntarily bearing the risks and losses of the product, and uSMART has made no recommendation of this product.\nIf you do not have knowledge of derivatives or other complex investments, please note that there may be risks and losses that you cannot understand when purchasing such products. Please evaluate your actual situation, risk tolerance, and risk appetite prior to making any investments, please be prudent and wise.',
            contentHk:
                'This SFC authorized open-ended fund to be purchased is a derivative product and a complex product. Please note that investment in such products may cause huge losses, which might be greater than the original investment amount. Please cautiously evaluate your own risk appetite and risk tolerance prior to subscription. The SFC authorization does not imply official recommendation, or that SFC authorization is not a recommendation or endorsement of a product nor does it guarantee the commercial merits of a product or its performance.\nClicking on the operation will be deemed as voluntarily bearing the risks and losses of the product, and uSMART has made no recommendation of this product.\nIf you do not have knowledge of derivatives or other complex investments, please note that there may be risks and losses that you cannot understand when purchasing such products. Please evaluate your actual situation, risk tolerance, and risk appetite prior to making any investments, please be prudent and wise.',
            tenKRTN: '10K RTN',
            yieldInLast7dTips:
                "The money market fund's annualized 7-day-return tries to reflect the average annual return for investors by annualizing the most recent 7-day-return.Please note that this data is fo reference only since it does not represent the realized annual return.<br/>Calculation Formula：<br/>Yield in Last 7d=（T-day nav-（T-7）-day nav）/（T-7）-day nav/Natural Days*365*100%",
            rateMessage:
                "Morningstar rates mutual funds from one to five stars based on how well they've performed (after adjusting for risk and accounting for all sales charges) in comparison to similar funds. In other words, stars are assigned to funds in the Hong Kong/Taiwan/Singapore universe based on relative performance. Within each Morningstar Category, the top 10% of funds receive five stars, the next 22.5% four stars, the middle 35% three stars, the next 22.5% two stars, and the bottom 10% receive one star. Funds with at least 36 months of history are also rated for up to three time periods--three-, five-, and ten-year --and these ratings are combined to produce an overall rating. In short, no rating will be assigned for funds with less than three years of history. Ratings are objective, based entirely on a mathematical evaluation of past performance. They're a useful tool for identifying funds worthy of further research, but shouldn't be considered buy or sell recommendations."
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
            this.$alert({
                message: contentMessage,
                className: 'text-align-justify',
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#0D50D8'
            })
        },
        async morningstarRateAlert() {
            await this.$confirm({
                showCancelButton: false,
                title: this.$t('hasRate'),
                message: this.$t('rateMessage'),
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#0D50D8'
            })
        },
        yieldInLast7dClick() {
            this.$dialog.alert({
                title: this.$t('yieldInLast7d'),
                message: this.$t('yieldInLast7dTips'),
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#3c78fa',
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
        },
        apy() {
            const func =
                this.fundHeaderInfoVO.apy && this.fundHeaderInfoVO.apy > 0
                    ? Math.floor
                    : Math.ceil
            let apyNum =
                this.fundHeaderInfoVO.assetType === 4
                    ? (
                          func((this.fundHeaderInfoVO.apy - 0) * 1000000) /
                          10000
                      ).toFixed(4)
                    : (
                          func((this.fundHeaderInfoVO.apy - 0) * 10000) / 100
                      ).toFixed(2)
            return this.fundHeaderInfoVO && apyNum
        }
    }
}
</script>
<style lang="scss" scoped>
.rate-wrap {
    display: flex;
    span {
        margin-left: 33px;
        margin-right: 6px;
    }
}
</style>
