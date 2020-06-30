<template lang="pug">
    .fund-colunm(:class="lang")
        .fund-colunm__header
            .col-left
                .iconfont.icon-icon_collect
                .title {{$t('A10')}}（{{$t('A24')}}）   
            .col-right(@click="handleGoDetail")
                span.title {{$t('A11')}}
                span.iconfont.icon-iconEBgengduoCopy    
        .fund-colunm__content
            .content__item
                .item-title {{$t('A17')}}
                .item-value(
                     :class="getStockClass(sharpeRatio3Yr)"
                ) {{Number(sharpeRatio3Yr).toFixed(2) || '--'}} 
            .content__item
                .item-title {{$t('A18')}}
                .item-value(
                    :class="getStockClass(maxDrawDown3Yr)"
                ) {{maxDrawDown3Yr | filterRatio}}     
            .content__item
                .item-title {{$t('A19')}}
                .item-value(
                   :class="getStockClass(captureRatioUpside3Yr)"
                ) {{captureRatioUpside3Yr | filterRatio}}
</template>
<script>
/**
 * @description 基金详情页分析数据模块
 * @author Aaron Lam
 * @date 2020/06/03
 */
import { mapGetters } from 'vuex'
import { getFundAnalysisDataV1 } from '@/service/finance-info-server.js'
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
        return {
            sharpeRatio3Yr: '',
            captureRatioUpside3Yr: '',
            maxDrawDown3Yr: ''
        }
    },
    filters: {
        filterRatio(val) {
            return val
                ? Number(val) > 0
                    ? `+${Number(val).toFixed(2)}%`
                    : `${Number(val).toFixed(2)}%`
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
        async getFundAnalysisData() {
            try {
                const params = {
                    fundId: this.fundHeaderInfoVO.fundId
                }
                const {
                    relativeRiskMeasureCategoryApiVO = {},
                    riskMeasureApiVO = {}
                } = await getFundAnalysisDataV1(params)
                this.sharpeRatio3Yr = riskMeasureApiVO.sharpeRatio3Yr
                this.captureRatioUpside3Yr =
                    relativeRiskMeasureCategoryApiVO.captureRatioUpside3Yr
                this.maxDrawDown3Yr = riskMeasureApiVO.maxDrawDown3Yr
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
        this.getFundAnalysisData()
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
    display: flex;
    padding: 14px 0;
    justify-content: space-between;
    .content__item {
        text-align: center;
        flex: 1;
        .item-title {
            color: $text-color5;
        }
        .item-value {
            font-size: 20px;
            font-family: yxFontDINPro-Medium;
            font-weight: 500;
        }
        &:nth-child(2) {
            border-left: 1px solid rgba(25, 25, 25, 0.05);
            border-right: 1px solid rgba(25, 25, 25, 0.05);
        }
    }
}
.fund-colunm.en {
    .fund-colunm__content {
        .item-title {
            font-size: 10px;
        }
    }
}
</style>
