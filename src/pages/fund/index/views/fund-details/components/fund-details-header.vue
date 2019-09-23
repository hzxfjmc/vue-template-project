<template lang="pug">
.funds-details-header
        h3 {{fundHeaderInfoVO.fundName}}
        p.funds-details-subtitle {{fundHeaderInfoVO.isin}}
        .funds-details-number
            .header-left
                span {{$t('oneYearShow')}}
                p(v-if="fundHeaderInfoVO.apy >0" :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{fundHeaderInfoVO.apy}}
                p(v-else-if="fundHeaderInfoVO.apy<0" :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{fundHeaderInfoVO.apy}}
                p(v-else) {{fundHeaderInfoVO.apy}}
            .header-right
                span {{$t('fundPrice')}} {{fundHeaderInfoVO.belongDay}}
                p.number-black ${{fundHeaderInfoVO.netPrice}}
        .funds-details-footer
            p {{$t('minInvestment')}} {{fundHeaderInfoVO.currencyType}} {{fundHeaderInfoVO.initialInvestAmount}}
            .fund-tag
                van-tag(
                    color="#2177FF"
                    plain
                    ) {{ fundHeaderInfoVO.assetType }}
            .fund-tag
                van-tag(
                    color="#2177FF"
                    plain
                    ) {{ fundHeaderInfoVO.fundRisk }}
            //- span {{fundHeaderInfoVO.assetType}}
            //- span {{fundHeaderInfoVO.fundRisk}}
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
            oneYearShow: '近一年收益率'
        },
        zhCHT: {
            fundPrice: '基金價格',
            minInvestment: '起投金額',
            oneYearShow: '近一年表現'
        },
        en: {
            fundPrice: 'Price',
            minInvestment: 'Min. Initial Investment',
            oneYearShow: 'Past Year'
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
            return getStockColorType()
        }
    }
}
</script>
<style lang="scss" scoped>
.funds-details-header {
    background: $background-color;
    float: left;
    width: 100%;
    min-height: 180px;
    padding: 10px;
    h3 {
        font-size: 0.32rem;
        color: $text-color;
        margin: 10px 0 3px 0;
        // height:50px;
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
        float: left;
        font-size: 0.24rem;
    }
    .funds-details-number {
        width: 100%;
        margin: 20px 0 0 0;
        float: left;
        .header-left,
        .header-right {
            float: left;
            p {
                font-size: 0.56rem;
                font-weight: 500;
                font-family: DINPro;
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
        float: left;
        margin: 10px 0;
        p {
            color: $text-color5;
            float: left;
            font-size: 0.24rem;
            margin: 0 20px 0 0;
            line-height: 22px;
        }
        .fund-tag {
            float: left;
        }
        // span {
        //     float: left;
        //     font-size: 0.2rem;
        //     border: 1px solid rgba(33, 119, 255, 1);
        //     margin: 0 3px;
        //     padding: 0 5px;
        //     color: rgba(33, 119, 255, 1);
        // }
    }
}
</style>
