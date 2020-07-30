<template lang="pug">
    .fund-colunm(:class="lang")
        .fund-colunm__header
            .col-left
                .iconfont.icon-icon_collect
                .title 投资组合 
            .col-right(@click="handleGoDetail")
                span.title 持仓数据、行业分布
                span.iconfont.icon-iconEBgengduoCopy    
        .fund-colunm__content
            .content__item  
                .content__item-title 行业分布    
                .content__item-subTitle
                    .subTitle__item 
                        span 规模
                        span 1，2324亿   
                    .subTitle__item 更新时间 ：2019-12-23    
                .content__item-chart   
            .content__item  
                .content__item-title 重仓债券（10.00%）    
                .content__item-subTitle
                    .subTitle__item 
                        span 债券名称
                    .subTitle__item 占比 
                .content__item-percentage
                    .percentage-item
                        .item-top
                            .item-top__label 债券名称    
                            .item-top__value 25%    
                        .item-line
                    .percentage-item
                        .item-top
                            .item-top__label 债券名称    
                            .item-top__value 25%    
                        .item-line  
                    .percentage-item
                        .item-top
                            .item-top__label 债券名称    
                            .item-top__value 25%    
                        .item-line
                .content__item-btn
                    span.label 展开更多
                    span.iconfont.icon-iconxiala                       
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
import i18n from './i18n'
export default {
    i18n,
    components: {},
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
        return {}
    },
    filters: {
        filterRatio(val, notNeedUnit) {
            let unit = notNeedUnit ? '' : '%'
            return val
                ? Number(val) > 0
                    ? `+${Number(val).toFixed(2)}${unit}`
                    : `${Number(val).toFixed(2)}${unit}`
                : '--'
        }
    },
    methods: {
        getStockClass(val) {
            return val > 0
                ? this.stockColorTypeClass.up
                : val < 0
                ? this.stockColorTypeClass.down
                : ''
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
            }/wealth/fund/index.html#/fund-analyze-data?${queryString.slice(
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
                    fundId: this.fundHeaderInfoVO.fundId
                }
                const data = await getFundTop10HoldingsV1(params)
                console.log(data)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getFundInvestmentData() {
            try {
                const params = {
                    fundId: this.fundHeaderInfoVO.fundId
                }
                const data = await getFundInvestmentDataV1(params)
                console.log(data)
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
            padding-top: 14px;
            text-align: left;
            font-size: 16px;
            font-weight: 400;
        }
        .content__item-subTitle {
            display: flex;
            padding: 10px 0 10px;
            justify-content: space-between;
            color: #666;
            font-size: 12px;
        }
        .content__item-percentage {
            padding-bottom: 10px;
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
        }
        .percentage-item {
            padding: 5px 0;
            .item-top {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }
            .item-line {
                width: 50%;
                height: 9px;
                background-color: #1d41a5;
            }
        }
    }
}
</style>
