<template lang="pug">
    .fund-historacal
        van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad")
            .block-list.border-bottom(class="block-header")
                .block-left 日期
                .block-content 单位净值
                .block-right 日涨幅
            .block-list(class="border-bottom" v-for="(item,index) in list")
                .block-left {{item.belongDay}}
                .block-content {{item.netPrice}}
                .block-right(v-if="item.price > 0" :class="stockColorType === 1 ? 'block-red' : 'block-green'") +{{item.price |transNumToThousandMark}}%
                .block-right(v-else-if="item.price < 0" :class="stockColorType === 1 ? 'block-green' : 'block-red'") {{item.price|transNumToThousandMark}}%
                .block-right(v-else) {{item.price|transNumToThousandMark}}%
        .block-element-nomore(v-if="noMoreShow")
            img.img(src="@/assets/img/fund/icon-norecord.png") 
            .no-record-box 暂无数据
</template>
<script>
import { List } from 'vant'
import { getFundNetPriceHistoryV1 } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    components: {
        [List.name]: List
    },
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            noMoreShow: false,
            fundId: 1,
            pageNum: 1,
            pageSize: 20,
            total: 0,
            finishedText: '无更多内容'
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    methods: {
        sliceDeci(s, l) {
            let deci = s.split('.')[1].slice(0, l)
            return s.split('.')[0] + '.' + deci
        },
        //上拉加载更多
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                if (this.list.length < this.total) {
                    this.pageNum = this.pageNum + 1
                    this.getFundNetPriceHistoryV1()
                }
                // 加载状态结束
                this.loading = false

                // 数据全部加载完成
                if (this.list.length >= this.total) {
                    this.finished = true
                }
            }, 500)
        },
        //基金净值历史查询接口
        async getFundNetPriceHistoryV1() {
            try {
                const {
                    list,
                    pageNum,
                    pageSize,
                    total
                } = await getFundNetPriceHistoryV1({
                    fundId: this.$route.query.id,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                this.pageNum = pageNum
                this.pageSize = pageSize
                this.list = this.list.concat(list)
                this.total = total
                this.list.forEach((item, index) => {
                    item.belongDay = dayjs(item.belongDay).format('YYYY-MM-DD')
                    item.netPrice = this.sliceDeci(item.netPrice, 4)
                    if (index === this.list.length - 1) {
                        this.list[this.list.length - 1].netPrice = '0.00'
                    } else {
                        if (Number(this.list[index + 1].netPrice) !== 0) {
                            item.price =
                                ((this.list[index].netPrice -
                                    this.list[index + 1].netPrice) /
                                    this.list[index + 1].netPrice) *
                                100
                        } else {
                            item.price = '0.00'
                        }
                    }
                })
                this.noMoreShow = this.total == 0
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.getFundNetPriceHistoryV1()
    }
}
</script>
<style lang="scss" scoped>
.fund-historacal {
    background: #fff;
    // display: flex;
    float: left;
    width: 100%;
    // height: 100%;
}
.block-list {
    width: 96%;
    margin: 0 2%;
    display: flex;
    line-height: 40px;
    .block-left,
    .block-content,
    .block-right {
        width: 33.33%;
    }
    .block-content {
        text-align: center;
    }
    .block-right {
        text-align: right;
    }
    .block-red {
        color: #ea3d3d;
    }
    .block-green {
        color: #00ba60;
    }
}
.block-header {
    .block-left,
    .block-content,
    .block-right {
        color: $text-color5;
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
</style>
