<template lang="pug">
    .fund-colunm(:class="lang")
        .fund-colunm__header
            .col-left
                img(src="@/assets/img/fund/icon/icon-invest@2x.png")
                .title {{$t(['投资组合','投資組合','Portfolio'])}} 
            .col-right(@click="handleGoDetail")
                span.title {{$t(['查看更多','查看更多','More'])}}
                span.iconfont.icon-iconEBgengduoCopy    
        .fund-colunm__content
            .content__item  
                .content__item-title 
                    .title {{$t(['行业分布','行業分佈','Industrial Distribution'])}}
                    .iconfont.icon-warning(@click="showTips")             
                .content__item-sub-title
                    .sub-title__item 
                        span {{$t(['规模','规模','Scale'])}}({{$t('currency',investmentData.currency,lang)}})：
                        span  {{changeFundSizeLang(investmentData.fundSize,investmentData.currency,'')||'--'}}  
                    .sub-title__item {{$t(['数据更新时间','數據更新時間','As of'])}} ：{{investmentData.updateTime}}  
                .content__item-chart  
                    ChartPie(
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
                    yx-no-list(v-else)    
            TopTen(
                v-if="fundHeaderInfoVO.fundId"
                :fundId="fundHeaderInfoVO.fundId"
            )                      
</template>
<script>
/**
 * @description 基金详情页投资组合
 * @author Aaron Lam
 * @date 2020/07/30
 */
import { mapGetters } from 'vuex'
import { getFundInvestmentDataV1 } from '@/service/finance-info-server.js'
import mixin from './mixin'
import ChartPie from './ChartPie'
import TopTen from './TopTen'
export default {
    mixins: [mixin],
    components: {
        ChartPie,
        TopTen
    },
    props: {
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters(['stockColorTypeClass', 'lang'])
    },
    data() {
        return {
            showMore: false,
            holdingsList: [],
            investmentData: {},
            globalStockSectorBreakdownList: []
        }
    },
    methods: {
        showTips() {
            this.$confirm({
                title: this.$t(['年化收益', '年化收益', 'Annualized Return']),
                showCancelButton: false,
                message: this.$t([
                    '年化收益率是把当前收益率（日/月/年/持有期收益率）换算成年收益率，即让投资者大致了解到持有该产品每年能获得的收益。',
                    '年化收益率是把當前收益率（日/月/年/持有期收益率）換算整年收益率，即讓投資者大致瞭解到持有該產品每年能獲得的收益。',
                    'Annualized return is the calculation of changing current return (day/month/year/holding period return) to the yearly return for helping investors to figure out the estimated annual return on investing the product.'
                ]),
                confirmButtonText: this.$t(['我知道了', '我知道了', 'ok'])
            })
        },
        handleShowMore() {
            this.showMore = !this.showMore
        },
        handleGoDetail() {
            let queryString = ''
            ;['fundId', 'fundName', 'isin'].forEach(key => {
                queryString += `${key}=${encodeURIComponent(
                    this.fundHeaderInfoVO[key]
                )}&`
            })
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/fund-invest-combination?${queryString.slice(
                0,
                -1
            )}`
            if (this.$jsBridge.isYouxinApp) {
                this.$jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        async getFundInvestmentData() {
            try {
                const params = {
                    fundId: this.fundHeaderInfoVO.fundId
                }
                this.investmentData = await getFundInvestmentDataV1(params)
                const item = this.investmentData.globalStockSectorBreakdownApiVO
                let dataList = []
                Object.keys(item).forEach(key => {
                    Number(item[key]) &&
                        dataList.push({
                            name: this.i18n[key],
                            percent: +Number(item[key]).toFixed(2),
                            a: '1'
                        })
                })
                // 降序排序
                dataList = dataList.sort((a, b) => {
                    return b.percent - a.percent
                })
                this.globalStockSectorBreakdownList = dataList
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
        this.getFundInvestmentData()
    }
}
</script>
<style lang="scss" scoped>
.fund-colunm {
    margin-top: 6px;
    padding: 0 10px;
    background-color: $background-color;
}
.fund-colunm__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(25, 25, 25, 0.05);
    .col-left {
        display: flex;
        align-items: center;
        .title {
            font-size: 16px;
            padding-left: 10px;
        }
        .iconfont {
            font-size: 18px;
        }
        img {
            width: 18px;
            height: 18px;
        }
    }
    .col-right {
        .title {
            font-size: 12px;
            color: #666;
        }
        text-align: right;
        .iconfont {
            font-size: 15px;
        }
    }
}
.fund-colunm__content {
    .content__item {
        .content__item-title {
            display: flex;
            align-items: center;
            padding-top: 14px;
            text-align: left;
            font-size: 16px;
            font-weight: 400;
        }
        .content__item-sub-title {
            display: flex;
            padding: 10px 0 10px;
            justify-content: space-between;
            color: #666;
            font-size: 12px;
        }
    }
}
</style>
