<template lang="pug">
    .fund-colunm__content 
        .content__item  
                .content__item-title 十大持仓（{{allPercent}}%）    
                .content__item-sub-title
                    .sub-title__item 
                        span 名称
                    .sub-title__item 占比 
                .content__item-percentage(:class="{'more':showMore}")
                    .percentage-item(v-for="item,index in holdingsList" :key="item.name")
                        .item-top
                            .item-top__label {{item.name}}    
                            .item-top__value {{Number(item.weighting).toFixed(2)}}%   
                        .item-line(
                            :class="index<3?`bg-${index}`:'bg-3'" 
                            :style="{width:`${item.width}%`}")
                .content__item-btn(@click="handleShowMore")
                    span.label {{showMore ? '收起':'展开更多'}}
                    span.iconfont.icon-iconxiala(:class="{'more':showMore}")                     
</template>
<script>
/**
 * @description 基金详情页投资组合
 * @author Aaron Lam
 * @date 2020/07/30
 */
import { mapGetters } from 'vuex'
import {
    getFundTop10HoldingsV1,
    getFundInvestmentDataV1
} from '@/service/finance-info-server.js'
import mixin from './mixin'
import ChartPie from './ChartPie'
export default {
    mixins: [mixin],
    components: {
        ChartPie
    },
    props: {
        fundId: {
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
            globalStockSectorBreakdownList: [],
            allPercent: 0
        }
    },
    methods: {
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
        async getFundTop10Holdings() {
            try {
                const params = {
                    fundId: this.fundId
                }
                const list = (await getFundTop10HoldingsV1(params)) || []
                list.forEach((item, index) => {
                    if (index === 0) {
                        item.width = 100
                    } else {
                        item.width = Number(
                            (list[index].weighting / list[0].weighting) * 100
                        ).toFixed(2)
                    }
                    this.allPercent += +Number(item.weighting).toFixed(2)
                })
                this.allPercent = Number(this.allPercent).toFixed(2)
                this.holdingsList = list
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getFundInvestmentData() {
            try {
                const params = {
                    fundId: this.fundId
                }
                this.investmentData = await getFundInvestmentDataV1(params)
                const item = this.investmentData.globalStockSectorBreakdownApiVO
                let dataList = []
                Object.keys(item).forEach(key => {
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
        this.getFundTop10Holdings()
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

.fund-colunm__content {
    .content__item {
        .content__item-title {
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
        .content__item-percentage {
            height: 200px;
            overflow: hidden;
            padding-bottom: 10px;
            transition: all 0.3s ease-out;
            &.more {
                height: 400px;
            }
        }
        .content__item-btn {
            display: flex;
            padding-bottom: 20px;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: #666;
            .label {
                padding-right: 6px;
            }
            .iconfont {
                transition: all 0.3s ease-out;
            }
            .icon-iconxiala.more {
                transform: rotate(180deg);
            }
        }
        .percentage-item {
            padding: 5px 0;
            .item-top {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }
            .item-top__value {
                font-size: 14px;
                font-weight: 500;
            }
            .item-line {
                width: 50%;
                height: 9px;
                transition: all 0.3s ease-out;
                &.bg-0 {
                    background-color: #1d41a5;
                }
                &.bg-1 {
                    background-color: #0d50d8;
                }
                &.bg-2 {
                    background-color: #2f79ff;
                }
                &.bg-3 {
                    background-color: #249cff;
                }
            }
        }
    }
}
</style>
