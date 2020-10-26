<template lang="pug">
.block__fund--historical
    .block__fund--item.border-bottom.block__title
        span.block__fund--left {{$t('timeMore')}}
        span.block__fund--right {{$t('nav')}}
    .block__content
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
            span.block__fund--right(v-if="item.value==='--'") {{item.value}}
            span.block__fund--right(v-if="item.value==0") {{item.value}}%
    .block__fund-p
        p {{$t('msg1')}}
        p {{$t('msg2')}}
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
            msg1:
                '*本页面资料来源于基金管理公司、晨星资讯（深圳）有限公司（“晨星”）和/或其他基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,uSMART盈立证券对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。',
            msg2:
                '相关数据仅供参考，本页面非任何法律文件，投资前请阅读基金合同，招募说明书。基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。'
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
            msg1:
                '*本頁面資料來源於基金管理公司、晨星資訊（深圳）有限公司（“晨星”）和/或其他基金服務提供供應商。所有數據截至最新淨值日期（除特殊標註外）,uSMART盈立證券對基金的業績表現計算是按該時期的資產淨值、相關類別貨幣計算。如有未顯示年度/時期的表現，則指該年度/時期未有足夠資料計算。',
            msg2:
                '相關數據僅供參考，本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書。基金過往業績不預示未來表現，不構成投資建議，市場有風險,投資需謹慎。'
        },
        en: {
            timeMore: 'Period',
            nav: 'Chg%',
            timeTranslation: {
                oneWeek: 'Last 1-Week',
                oneMonth: 'Last 1-Month',
                threeMonth: 'Last 3-Month',
                sixMonth: 'Last 6-Month',
                oneYear: 'Last 1-Year',
                twoYear: 'Last 2-Year',
                threeYear: 'Last 3-Year',
                fiveYear: 'Last 5-Year',
                all: 'Since Inception',
                toYear: 'YTD'
            },
            msg1:
                "* The information on this page comes from fund management companies, Morningstar ShenZhen Limited（“Morningstar”）and/or fund service providers. All data are up to the date of the latest net worth (unless otherwise specified). uSMART calculates the fund's performance on a NAV-to-NAV basis in the relevant share class currency. Whenever there is no past performance shown, no sufficient data available in that year to calculate performance.",
            msg2:
                'The relevant data is for reference only. This page is not a legal document. Please carefully read the fund’s prospectus before investing. Past performance is not an indicator of future performance. All investments involve risk. Investors should consider all available information before making any investment decisions.'
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
                    if (!res[key] && res[key] != 0) {
                        this.timeList[key].value = '--'
                    } else {
                        this.timeList[key].value = (res[key] * 100).toFixed(2)
                    }
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
.block__title {
    position: fixed;
    width: 100%;
    height: 40px;
    background: #fff;
    top: 0;
    z-index: 999999;
}
.block__content {
    margin: 40px 0 0 0;
}
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
        p {
            margin-bottom: 10px;
            text-align: justify;
        }
    }
}
.number-red {
    color: #ea3d3d;
}
.number-green {
    color: #04ba60;
}
</style>
