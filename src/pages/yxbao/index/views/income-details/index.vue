<template lang="pug">
    .block__order--content
        .block__header--wrapper
            .block__left
                .top {{$t('C3')}}
                .bottom.block__amount {{positionMarketValue|transNumToThousandMark}}
            .block__right
                .top {{$t('C5')}}
                .bottom {{totalEarnings|transNumToThousandMark}}
        hr
        van-list.order-record-list(
            v-model="loading" 
            :finished="finished" 
            :finished-text="finishedText" 
            @load="onLoad")
            .block__order--list.border-bottom(
                v-for="(item,index) in list")
                .block__order--left
                    p.title {{item.recordTypeName}}
                    p.color {{item.createTime}}
                .block__order--right
                    p.num(
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                        v-if="item.recordAmount>0") +{{item.recordAmount}}
                    p.num(
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                        v-else-if="item.recordAmount < 0") {{item.recordAmount}}
                    p.num(v-else) {{item.recordAmount}}
        .block-element-nomore(v-if="noMoreShow")
            img.img(src="@/assets/img/fund/data.png") 
            .no-record-box {{$t('nomore1')}}

</template>
<script>
import {
    getBaoCapitalTradeList,
    getBaoPostion
} from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { getStockColorType } from '@/utils/html-utils.js'
import { List } from 'vant'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    components: {
        [List.name]: List
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    i18n: {
        zhCHS: {
            Balance: '余额',
            nomore1: '暂无数据'
        },
        zhCHT: {
            Balance: '餘額',
            nomore1: '暫無數據'
        },
        en: {
            Balance: 'Balance',
            nomore1: 'No Data'
        }
    },
    data() {
        return {
            positionMarketValue: '',
            totalEarnings: '',
            list: [],
            noMoreShow: false,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容'
        }
    },
    created() {
        this.getBaoCapitalTradeList()
        this.getBaoPostion()
    },
    methods: {
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getBaoCapitalTradeList()
            }
        },
        //获取持仓数据
        async getBaoPostion() {
            try {
                const {
                    positionMarketValue,
                    totalEarnings
                } = await getBaoPostion({
                    currency: 2
                })
                this.positionMarketValue = positionMarketValue
                this.totalEarnings = totalEarnings
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getBaoCapitalTradeList() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getBaoCapitalTradeList({
                    currency: 2,
                    recordTypes: [3],
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                list.map(item => {
                    item.createTime = dayjs(item.createTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                })
                this.loading = false
                this.list = this.list.concat(list)
                this.pageNum = pageNum
                this.total = total
                this.pageSize = pageSize
                this.noMoreShow = this.total == 0
                if (this.list.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__header--wrapper {
    padding: 20px 12px 14px 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .top {
        color: $text-color6;
    }
    .bottom {
        font-family: yxFontDINPro-Medium;
        font-size: 28px;
    }
    .block__amount {
        color: #ff5431;
    }
}
hr {
    height: 6px;
    margin: 0;
    padding: 0;
    border: none;
    background: rgba(25, 25, 25, 0.05);
}
.block__order--content {
    background: #fff;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .block__order--list {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 82px;
        align-items: center;
        .block__order--left {
            margin: 0 0 0 12px;
            .title {
                font-size: 16px;
            }
        }
        .block__order--right {
            margin: 0 12px 0 0;
            text-align: right;
            .num {
                font-size: 18px;
            }
        }
        p {
            line-height: 26px;
        }
        .color {
            color: rgba(25, 25, 25, 0.65);
        }
    }
    .block__no-more {
        width: 100%;
        text-align: center;
        color: rgba(25, 25, 25, 0.45);
        line-height: 20px;
        margin: 20px 0 0 0;
    }
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 150px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
.number-red {
    color: #ea3d3d;
}
.number-green {
    color: #04ba60;
}
</style>
