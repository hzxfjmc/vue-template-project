<template lang="pug">
.block--hold__wrapper
    .block--hold__header
        .block--header__left
            .fund-name.ellipse {{fundHeaderInfoVO.fundName}}
            span ISIN:{{fundHeaderInfoVO.isin}}
        .block--header__right(
            v-if="fundHeaderInfoVO.release"
            @click="goToFundDetails")
            span {{$t('fundDetails')}}
            em.iconfont.icon-iconEBgengduoCopy
    .block--hold__content
        .blockk--hold__top  
            .block--top__item
                span.top__l {{$t('positionMarketValue')}}({{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}})
                .num {{initState.positionMarketValue|transNumToThousandMark}}
        .block--hold__list
            .block__item
                span {{$t('positionShare')}}
                .num {{initState.positionShare}}
            .block__item.block--element_c
                span {{$t('weekEarnings')}}
                .num(
                    v-if="initState.weekEarnings>0" 
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{initState.weekEarnings|transNumToThousandMark}}
                .num(
                    v-if="initState.weekEarnings<0" 
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{initState.weekEarnings|transNumToThousandMark}}
                .num( v-if="initState.weekEarnings==0") {{initState.weekEarnings|transNumToThousandMark}}
            .block__item.block--element_r
                span {{$t('profitPosition')}}
                .num(
                    v-if="initState.positionEarnings>0" 
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{initState.positionEarnings|transNumToThousandMark}}
                .num(
                    v-if="initState.positionEarnings<0" 
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{initState.positionEarnings|transNumToThousandMark}}
                .num( v-if="initState.positionEarnings==0") {{initState.positionEarnings|transNumToThousandMark}}
        .block--subscribe__content(@click="JumpUrl('/order-record')")
            .block__item(v-if="initState.redeemDeliveryShare != 0")
                span.block_span {{$t('Redemption')}}
                span.blpck_content {{$t('')}} {{initState.redeemDeliveryShare|transNumToThousandMark}}
            .block__item(v-if="initState.inTransitAmount != 0")
                span.block_span {{$t('subscribe')}}
                span.blpck_content {{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}} {{initState.inTransitAmount|transNumToThousandMark}}
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
    .block--element__tab
        .block--tab__list
            .block--tab__item(@click="JumpUrl('/income-details')")
                em.iconfont.icon-shouru
                span {{$t('incomeDetails')}}
            .block--tab__item(@click="JumpUrl('/order-record')")
                em.iconfont.icon-zijin
                span {{$t('orderRecord')}}
            .block--tab__item(
                v-if="fixedPlanNum!=0"
                @click="JumpUrl('/my-investment')")
                em.iconfont.icon-dingtou
                span {{$t('A75')}}({{fixedPlanNum}})
                            

</template>
<script>
import dayjs from 'dayjs'
import { Tag } from 'vant'
import './fund-details-header.scss'
import { getStockColorType } from '@/utils/html-utils.js'
import { getFundFixedPlanCount } from '@/service/finance-server.js'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
export default {
    components: {
        [Tag.name]: Tag
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
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
            tenKRTN: '萬元收益',
            positionShare: '持有份额',
            weekEarnings: '近7日收益',
            profitPosition: '持有收益',
            Redemption: '赎回中',
            subscribe: '申购中',
            share: '份额',
            positionMarketValue: '持有资产'
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
            pirchaseHk: '最低認購金額',
            update: '更新時間',
            iknow: '我知道了',
            tenKRTN: '万元收益',
            positionShare: '持有份額',
            weekEarnings: '近7日收益',
            profitPosition: '持倉收益',
            Redemption: '贖回中',
            subscribe: '認購中',
            share: '份額',
            positionMarketValue: '持有市值'
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
            iknow: 'Got it',
            tenKRTN: '10K RTN',
            positionShare: 'Holding Units',
            weekEarnings: 'Last 1 week',
            profitPosition: 'Total Return',
            Redemption: 'Redeming',
            subscribe: 'Purchasing',
            share: 'Unit',
            positionMarketValue: 'Holding Value'
        }
    },
    props: {
        initState: {
            type: Object,
            default: () => {}
        },
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
            nowDate: dayjs(Date.parse(new Date())).format('MMDDYYYY'),
            fixedPlanNum: 0
        }
    },
    created() {
        this.getFundFixedPlanCount()
    },
    methods: {
        async getFundFixedPlanCount() {
            try {
                const { fixedPlanNum } = await getFundFixedPlanCount({
                    fundId: this.$route.query.id
                })
                this.fixedPlanNum = fixedPlanNum
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        goToFundDetails() {
            this.$router.push({
                name: 'fund-details',
                query: {
                    id: this.fundHeaderInfoVO.fundId
                }
            })
        },
        JumpUrl(data) {
            let url
            if (data === '/income-details') {
                url = `${window.location.origin}/wealth/fund/index.html#${data}?id=${this.$route.query.id}&curreny=${this.fundHeaderInfoVO.currencyType}&positionEarnings=${this.initState.positionEarnings}`
            } else {
                url = `${window.location.origin}/wealth/fund/index.html#${data}?id=${this.$route.query.id}`
            }
            jumpUrl(3, url)
        },
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
.block--element__tab {
    background: #fff;
    margin: 6px 0 0 0;
    height: 80px;
    .block--tab__list {
        display: flex;
        flex-direction: row;
        height: 100%;
        justify-content: space-around;
        .block--tab__item {
            display: flex;
            justify-content: center;
            align-content: center;
            flex-direction: column;
            text-align: center;
            em {
                font-size: 24px;
                color: #2f79ff;
            }
        }
    }
}
.block--hold__content {
    background: #fff;
    margin: 6px 0 0 0;
    padding: 0 12px;
}
.block--hold__list {
    display: flex;
    flex-direction: row;
    margin: 10px 0 0 0;
    justify-content: space-between;
    .block--element_r {
        text-align: right;
    }
    .block--element_c {
        text-align: center;
    }
    span {
        color: rgba(25, 25, 25, 0.45);
        line-height: 20px;
    }
    .num {
        font-size: 16px;
    }
}
.block--subscribe__content {
    max-height: 84px;
    background: rgba(25, 25, 25, 0.03);
    margin: 14px 0 0 0;
    display: flex;
    flex-direction: column;
    align-content: center;
    border-radius: 4px;
    .block__item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 15px 10px 0 10px;
    }
    .block__item:last-child {
        padding: 15px 10px 15px 10px;
    }
}
.blockk--hold__top {
    padding: 20px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .block--top_r {
        text-align: right;
    }
    .top__l {
        font-size: 12px;
        color: rgba(25, 25, 25, 0.5);
    }
    .num {
        font-family: yxFontDINPro-Medium;
        font-size: 28px;
        line-height: 36px;
    }
}
.block--hold__header {
    background: #fff;
    padding: 0 0 0 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 77px;
    align-items: center;
    .block--header__left {
        width: 70%;
        .fund-name {
            font-size: 16px;
        }
        span {
            font-size: 12px;
            color: rgba(25, 25, 25, 0.3);
        }
    }
    .block--header__right {
        // width: 87px;
        height: 27px;
        background: rgba(47, 121, 255, 0.05);
        border-radius: 100px 0px 0px 100px;
        font-size: 12px;
        color: rgba(47, 121, 255, 1);
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
            padding: 0 0 0 10px;
            display: inline-block;
        }
    }
}
.funds-details-footer {
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    font-size: 11px;
    justify-content: space-between;
    color: $text-color5;

    .block__details--right {
        text-align: right;
    }
}
.number-red {
    color: rgba(234, 61, 61, 1);
}
.number-green {
    color: #04ba60;
}
</style>
