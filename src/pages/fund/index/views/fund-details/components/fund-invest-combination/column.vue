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
                    .subTitle__item 规模   
                    .subTitle__item 更新时间     
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
    padding: 14px 0;
    .content__item {
        .content__item-title {
            text-align: left;
            font-size: 16px;
            font-weight: 400;
        }
        .content__item-subTitle {
            display: flex;
            justify-content: space-between;
            color: #666;
            font-size: 12px;
        }
    }
}
</style>
