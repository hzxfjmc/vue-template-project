<template lang="pug">
.block__fund--historical
    .block__fund--item.border-bottom
        span.block__fund--left {{$t('timeMore')}}
        span.block__fund--right {{$t('nav')}}
    .block__fund--item.border-bottom(
        v-for="(item,index) in timeList" 
        :key="index")
        span.block__fund--left {{item.label}}
        span.block__fund--right(
            :class="stockColorType === 1 ? 'number-red' : 'number-green'"
            v-if="item.value>0") +{{item.value}}%
        span.block__fund--right(
            :class="stockColorType === 1 ? 'number-green' : 'number-red'"
            v-else-if="item.value<0") {{item.value}}%
        //- span.block__fund--right(v-else-if="item.value==='--'") {{item.value}}
        span.block__fund--right(v-else) {{item.value}}%
    .block__fund-p
        p {{$t('msg')}}
</template>
<script>
import { getFundPerformanceHistory } from '@/service/finance-info-server.js'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    i18n: {
        zhCHS: {
            timeMore: '时间区间',
            nav: '涨跌幅',
            timeTranslation: {
                oneWeek: '近一周',
                oneMonth: '近一月',
                threeMonth: '近三月',
                sixMonth: '近六月',
                oneYear: '近一年',
                twoYear: '近两年',
                threeYear: '近三年',
                fiveYear: '近五年',
                toYear: '今年来',
                all: '成立来'
            },
            msg:
                '基金过往业绩不预示未来表现不构成投资建议，市场有风险投资需谨慎'
        },
        zhCHT: {
            timeMore: '時間區間',
            nav: '漲跌幅',
            timeTranslation: {
                oneWeek: '近一周',
                oneMonth: '近一月',
                threeMonth: '近三月',
                sixMonth: '近六月',
                oneYear: '近一年',
                twoYear: '近两年',
                threeYear: '近三年',
                fiveYear: '近五年',
                toYear: '今年来',
                all: '成立来'
            },
            msg:
                '基金過往業績不預示未來表現不構成投資建議，市場有風險投資需謹慎'
        },
        en: {
            timeMore: 'Period',
            nav: 'Chg%',
            timeTranslation: {
                oneWeek: 'Last 1 week',
                oneMonth: 'Last 1 month',
                threeMonth: 'Last 3 month',
                sixMonth: 'Last 6 month',
                oneYear: 'Last 1 year',
                twoYear: 'Last 2 year',
                threeYear: 'Last 3 year',
                fiveYear: 'Last 5 year',
                toYear: 'YTD',
                all: 'ALL'
            },
            msg:
                'Past performance is not indicative of future performance.All investments involve risk. Investors should consult all available information，before making any investment strategy.'
        }
    },
    data() {
        return {
            timeList: {
                oneWeek: {
                    label: '近一周',
                    value: ''
                },
                oneMonth: {
                    label: '近一月',
                    value: ''
                },
                threeMonth: {
                    label: '近三月',
                    value: ''
                },
                sixMonth: {
                    label: '近六月',
                    value: ''
                },
                oneYear: {
                    label: '近一年',
                    value: ''
                },
                twoYear: {
                    label: '近两年',
                    value: ''
                },
                threeYear: {
                    label: '近三年',
                    value: ''
                },
                fiveYear: {
                    label: '近五年',
                    value: ''
                },
                toYear: {
                    label: '今年来',
                    value: ''
                },
                all: {
                    label: '成立来',
                    value: ''
                }
            }
        }
    },
    methods: {
        async getFundPerformanceHistory() {
            try {
                const res = await getFundPerformanceHistory({
                    fundId: this.$route.query.id
                })
                for (let key in this.timeList) {
                    this.timeList[key].value = (res[key] * 100).toFixed(2)
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        init18InState() {
            for (let key in this.timeList) {
                this.timeList[key].label = this.$t('timeTranslation')[key]
            }
        }
    },
    created() {
        this.init18InState()
        this.getFundPerformanceHistory()
    }
}
</script>
<style lang="scss" scoped>
.block__fund--historical {
    background: #fff;
    position: relative;
    width: 100%;
    height: 100%;
    .block__fund--item {
        width: 100%;
        display: flex;
        padding: 0 20px;
        line-height: 40px;
        flex-direction: row;
        .block__fund--left,
        .block__fund--right {
            width: 50%;
        }
        .block__fund--right {
            text-align: right;
        }
    }
    .block__fund--header {
        height: 30px;
        // background: #e1e1e1;
        line-height: 30px;
    }
    .block__fund-p {
        width: 100%;
        padding: 0 15px;
        font-size: 12px;
        margin: 40px 0 0 0;
        color: #999999;
    }
}
.number-red {
    color: #ea3d3d;
}
.number-green {
    color: #04ba60;
}
</style>
