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
                    
                .block-right.block-red(v-if="item.flag == 0") +{{item.price}}%
                .block-right.block-green(v-if="item.flag  == 1") {{item.price}}%
                .block-right(v-if="item.flag  == 2") {{Math.abs(item.price).toFixed(2)}}%

        .block-element-nomore(v-if="noMoreShow")
            img.img(src="@/assets/img/fund/icon-norecord.png") 
            .no-record-box 暂无订单
</template>
<script>
import { List } from 'vant'
import { getFundNetPriceHistoryV1 } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
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
    methods: {
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
                this.list.map((item, index) => {
                    item.belongDay = dayjs(item.belongDay).format('YYYY-MM-DD')
                    item.netPrice = transNumToThousandMark(item.netPrice, 4)
                    if (index > 0) {
                        item.price =
                            (this.list[index - 1].netPrice -
                                this.list[index].netPrice) /
                            this.list[index].netPrice
                    } else {
                        if (this.list.length > 1) {
                            this.list[0].price =
                                (this.list[0].netPrice -
                                    this.list[1].netPrice) /
                                this.list[1].netPrice
                        } else {
                            this.list[0].price = 0.0
                        }
                    }
                    item.flag =
                        Number(item.price) > 0
                            ? 0
                            : Number(item.price) == 0
                            ? 2
                            : 1
                    item.price = transNumToThousandMark(item.price)
                })
                this.noMoreShow = this.total == 0
                // this.finishedText = this.$t('nomore1')
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
