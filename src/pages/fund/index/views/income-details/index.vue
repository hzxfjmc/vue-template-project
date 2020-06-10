<template lang="pug">
.income-details-content
    .block__element--header
        span {{$t('positionEarnings')}}({{positionInfo.curreny === 'HKD' ?$t('hkd'):$t('usd')}})
        .num(
            v-if="positionInfo.positionEarnings>0"
            :class="stockColorType === 1 ?'element-price-red':'element-price-green'") +{{positionInfo.positionEarnings}}
        .num(
            v-if="positionInfo.positionEarnings<0"
            :class="stockColorType === 1 ?'element-price-green':'element-price-red'") {{positionInfo.positionEarnings}}
        .num(v-if="positionInfo.positionEarnings==0") {{positionInfo.positionEarnings}}
    span.hr
    van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad") 
        .block__title.border-bottom
            .item--title {{$t('A97')}}
            .item--title {{$t('C11')}}({{positionInfo.curreny}})
        .list(class="border-bottom" v-for="(item,index) in list" :key="index")
            span {{item.belongDate}}
            span(v-if="item.msg == 0" :class="stockColorType === 1 ?'element-price-red':'element-price-green'") +{{item.earnings}}
            span(v-if="item.msg == 1" :class="stockColorType === 1 ?'element-price-green':'element-price-red'") {{item.earnings}}
            span.element-price(v-if="item.msg == 2") {{item.earnings}}
               
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box {{$t('nomore')}}
</template>
<script>
import { getFundPositionEarningsListV1 } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
import dayjs from 'dayjs'
import { List } from 'vant'
export default {
    components: {
        [List.name]: List
    },
    i18n: {
        zhCHS: {
            FundNmae: '基金名称',
            amountMoney: '金额',
            time: '日期',
            nomore: '暂无收益',
            nomore1: '无更多内容',
            positionEarnings: '持仓收益',
            C11: '收益'
        },
        zhCHT: {
            FundNmae: '基金名稱',
            amountMoney: '金額',
            time: '日期',
            nomore: '暫無收益',
            nomore1: '無更多內容',
            positionEarnings: '持有收益',
            C11: '收益'
        },
        en: {
            FundNmae: 'Fund Name',
            amountMoney: 'Amount',
            time: 'Date',
            nomore: 'No Return',
            nomore1: 'No More Content',
            positionEarnings: 'Total P/L',
            C11: 'Return'
        }
    },
    data() {
        return {
            list: [],
            positionInfo: {},
            noMoreShow: false,
            pageSize: 10,
            pageNum: 1,
            total: 0,
            loading: false,
            finishedText: '无更多内容',
            finished: false,
            currency: this.$route.query.currency
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    methods: {
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getFundPositionEarningsListV1()
            }
        },
        async getFundPositionEarningsListV1() {
            try {
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                if (this.$route.query.id) {
                    data.fundId = this.$route.query.id
                }
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getFundPositionEarningsListV1(data)
                list.map(item => {
                    item.msg =
                        Number(item.earnings) > 0
                            ? 0
                            : Number(item.earnings) < 0
                            ? 1
                            : 2
                    item.earnings = transNumToThousandMark(item.earnings)
                    item.belongDate = dayjs(item.belongDate).format('YY-MM-DD')
                })
                this.list = this.list.concat(list)
                this.pageSize = pageSize
                this.pageNum = pageNum
                this.total = total
                // this.total = 0
                this.noMoreShow = this.total == 0
                // 加载状态结束
                this.loading = false
                // 数据全部加载完成
                if (this.list.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.getFundPositionEarningsListV1()
        if (this.$route.query.positionEarnings) {
            this.positionInfo.positionEarnings = this.$route.query.positionEarnings
            this.positionInfo.curreny = this.$route.query.curreny
        }
    }
}
</script>
<style lang="scss" scoped>
.block-right {
    .element-fund-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
        width: 100%;
        text-align: right;
    }
}
.list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.block__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 16px;
    height: 44px;
    color: rgba(25, 25, 25, 0.5);
    margin: -6px 0 0 0;
    align-items: center;
}
.block__element--header {
    width: 100%;
    height: 92px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    background: #fff;
    z-index: 999999;
    span {
        color: rgba(25, 25, 25, 0.45);
    }
    .num {
        font-family: yxFontDINPro-Medium;
        font-size: 28px;
    }
    // flex: 1;
}
.hr {
    width: 100%;
    height: 6px;
    background: #f3f3f3;
    display: inline-block;
    margin: 92px 0 0 0;
}
.income-details-content {
    // display: flex;
    // flex-direction: column;
    height: 100%;
    // -webkit-overflow-scrolling: touch;
    background: #fff;
    // overflow: hidden;
    // overflow-y: auto;
    .order-record-list {
        margin: 0px 0 0 0;
        background: #fff;
    }
    .list {
        width: 100%;
        padding: 10px 16px;
        // height: 150px;
        display: flex;
        align-items: center;
        .block-left {
            display: flex;
            width: 30%;
            // float: left;
            flex-direction: column;
            // align-items: flex-start;
            span {
                display: inline-block;
                line-height: 25px;
                color: $text-color5;
            }
        }
        .block-right {
            display: flex;
            // float: right;
            width: 70%;
            justify-content: flex-end;
            flex-direction: column;
            align-items: flex-end;
            span {
                display: inline-block;
                line-height: 25px;
            }
        }
    }
}
.element-price-red {
    color: #ea3d3d;
}
.element-price-green {
    color: #00ba60;
}
.footer-msg {
    width: 100%;
    text-align: center;
    margin: 10px 0;
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
</style>
