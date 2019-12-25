<template lang="pug">
.block__fund--historical
    .block__fund--item.block__fund--header
        span.block__fund--left 时间区间
        span.block__fund--right 涨跌幅
    .block__fund--item(
        v-for="(item,index) in timeList" 
        :key="index")
        span.block__fund--left {{item.label}}
        span.block__fund--right(
            :class="stockColorType === 1 ? 'number-red' : 'number-green'"
            v-if="item.value>0") +{{item.value}}%
        span.block__fund--right(
            :class="stockColorType === 1 ? 'number-red' : 'number-green'"
            v-else-if="item.value<0") -{{item.value}}%
        span.block__fund--right(v-else-if="item.value==='--'") {{item.value}}
        span.block__fund--right(v-else) {{item.value}}%
    .block__fund-p
        p 基金過往業績不預示未來表現，示構成投資建議，市場有風險投資需謹慎
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
    data() {
        return {
            timeList: {
                oneWeek: {
                    label: '近一周',
                    value: ''
                },
                oneMonth: {
                    label: '近一個月',
                    value: ''
                },
                threeMonth: {
                    label: '近三個月',
                    value: ''
                },
                sixMonth: {
                    label: '近六個',
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
                    this.timeList[key].value = res[key] * 100 || '--'
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
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
        background: #e1e1e1;
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
