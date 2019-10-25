<template lang="pug">
.income-details-content
    van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad")
        .list(class="border-bottom" v-for="(item,index) in list")
            .block-left 
                span.element-fund-name {{$t('FundNmae')}}
                span.element-price {{$t('amountMoney')}}
                span.element-time {{$t('time')}}
            .block-right 
                span.element-fund-name {{item.fundName}}
                span.element-price-red(v-if="item.msg == 0") +{{item.earnings}}
                span.element-price-green(v-if="item.msg == 1") {{item.earnings}}
                span.element-price(v-if="item.msg == 2") {{item.earnings}}
                span.element-time {{item.belongDate}}
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box {{$t('nomore')}}
</template>
<script>
import { getFundPositionEarningsListV1 } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
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
            time: '时间',
            nomore: '暂无收益',
            nomore1: '无更多内容'
        },
        zhCHT: {
            FundNmae: '基金名称',
            amountMoney: '金额',
            time: '时间',
            nomore: '暂无收益',
            nomore1: '无更多内容'
        },
        en: {
            FundNmae: '基金名称',
            amountMoney: '金额',
            time: '时间',
            nomore: '暂无收益',
            nomore1: '无更多内容'
        }
    },
    data() {
        return {
            list: [],
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
    methods: {
        //上拉加载更多
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                if (this.list.length < this.total) {
                    this.pageNum = this.pageNum + 1
                    this.getFundPositionEarningsListV1()
                }
                // 加载状态结束
                this.loading = false

                // 数据全部加载完成
                if (this.list.length >= this.total) {
                    this.finished = true
                }
            }, 500)
        },
        async getFundPositionEarningsListV1() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getFundPositionEarningsListV1({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    currency: 2
                })
                list.map(item => {
                    item.msg =
                        Number(item.earnings) > 0
                            ? 0
                            : Number(item.earnings) < 0
                            ? 1
                            : 2
                    item.earnings = transNumToThousandMark(item.earnings)
                    item.belongDate = dayjs(item.belongDate).format(
                        'YYYY-MM-DD HH:MM:SS'
                    )
                })
                this.list = this.list.concat(list)
                this.pageSize = pageSize
                this.pageNum = pageNum
                this.total = total
                // this.total = 0
                this.noMoreShow = this.total == 0
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.getFundPositionEarningsListV1()
    }
}
</script>
<style lang="scss" scoped>
.income-details-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    .list {
        width: 100%;
        padding: 10px 2%;
        // height: 150px;
        display: flex;
        align-items: center;
        .block-left {
            display: flex;
            width: 30%;
            flex-direction: column;
            span {
                display: inline-block;
                line-height: 25px;
                color: $text-color5;
            }
        }
        .block-right {
            display: flex;
            width: 70%;
            justify-content: flex-end;
            flex-direction: column;
            align-items: flex-end;
            span {
                display: inline-block;
                line-height: 25px;
            }
            .element-price-red {
                color: #ea3d3d;
            }
            .element-price-green {
                color: #00ba60;
            }
        }
    }
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
