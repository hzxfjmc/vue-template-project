<template lang="pug">
.funds-details-header
    .fund-details-header-top.border-bottom
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
            //- .fund-tag
            //-     van-tag(
            //-         color="#2177FF"
            //-         plain
            //-         ) {{ fundHeaderInfoVO.assetTypeName }}
            //- .fund-tag
            //-     van-tag(
            //-         color="#2177FF"
            //-         plain
            //-         ) {{ fundHeaderInfoVO.fundRisk }}
            //- .fund-tag
            //-     van-tag(
            //-         color="#2177FF"
            //-         plain
            //-         ) {{ fundHeaderInfoVO.earningsTypeName }}
    .funds-details-number.border-bottom
        .header-left
            span {{isMonetaryFund ? $t('yieldInLast7d'):$t('oneYearShow')}}
            p(v-if="fundHeaderInfoVO.apy >0" :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{fundHeaderInfoVO.apy}}%
            p(v-else-if="fundHeaderInfoVO.apy<0" :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{fundHeaderInfoVO.apy}}%
            p(v-else) {{fundHeaderInfoVO.apy}}%
        .header-right
            span {{$t('fundPrice')}} {{fundHeaderInfoVO.belongDay}}（{{fundHeaderInfoVO.currencyType==='HKD'? $t('hkd'):$t('usd')}}）
            p.number-black {{fundHeaderInfoVO.netPrice}}
    .funds-details-footer
        .block__details--left
            span 基金價格(美元):1,234.56 
            span (-0.32)
        .block__details--right
            span 更新時間:2019-12-10
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
            fundPrice: '基金价格',
            minInvestment: '起投金额',
            oneYearShow: '近一年收益率',
            yieldInLast7d: '近七日年化',
            hkd: '港币',
            usd: '美元'
        },
        zhCHT: {
            fundPrice: '基金價格',
            minInvestment: '起投金額',
            oneYearShow: '近一年表現',
            yieldInLast7d: '近七日年化',
            hkd: '港幣',
            usd: '美元'
        },
        en: {
            fundPrice: 'Price',
            minInvestment: 'Min. Initial Investment',
            oneYearShow: 'Past Year',
            hkd: 'HKD',
            usd: 'USD',
            yieldInLast7d: 'Yield in Last 7d'
        }
    },
    props: {
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            nowDate: dayjs(Date.parse(new Date())).format('MMDDYYYY')
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        isMonetaryFund() {
            return Number(this.fundHeaderInfoVO.assetType) === 4 // 货币型基金
        }
    }
}
</script>
<style lang="scss" scoped>
.funds-details-header {
    width: 100%;
    min-height: 174px;
    .fund-details-header-top {
        width: 100%;
        padding: 10px;
        float: left;
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
        padding: 20px 10px 0 10px;
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
        }
    }
    .funds-details-footer {
        width: 100%;
        background: #fff;
        display: flex;
        flex-direction: row;
        padding: 10px 10px 5px 10px;
        font-size: 11px;
        color: $text-color5;
        .block__details--left {
            width: 60%;
        }
        .block__details--right {
            width: 40%;
            text-align: right;
        }
    }
}
</style>
