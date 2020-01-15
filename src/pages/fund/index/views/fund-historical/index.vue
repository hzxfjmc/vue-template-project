<template lang="pug">
    .fund-historacal
        van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="$t('finishedText')" @load="onLoad")
            .block-list.border-bottom(class="block-header")
                .block-left {{$t('time')}}
                .block-content {{$t('nav')}}
                .block-right {{isMMF?$t('RTNDetail'):$t('dayChg')}}
            .block-list(class="border-bottom" v-for="(item,index) in list")
                .block-left {{item.belongDay}}
                .block-content {{item.netPrice}}
                template(v-if="isMMF")
                    .block-right {{item.revenue}}
                template(v-else)
                    .block-right(v-if="item.price > 0" :class="stockColorType === 1 ? 'block-red' : 'block-green'") +{{item.price }}%
                    .block-right(v-else-if="item.price < 0" :class="stockColorType === 1 ? 'block-green' : 'block-red'") {{item.price}}%
                    .block-right(v-else) {{item.price}}%
        .block-element-nomore(v-if="noMoreShow")
            img.img(src="@/assets/img/fund/icon-norecord.png") 
            .no-record-box {{$t('finishedText')}}
</template>
<script>
import { List } from 'vant'
import { getFundNetPriceHistoryV1 } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
import { FUND_ASSET_TYPE } from '@/pages/fund/index/map'
export default {
    i18n: {
        zhCHS: {
            dayChg: '日涨幅',
            nav: '单位净值',
            time: '日期',
            finishedText: '无更多内容',
            RTNDetail: '收益详情'
        },
        zhCHT: {
            dayChg: '日漲幅',
            nav: '單位淨值',
            time: '日期',
            finishedText: '無更多內容',
            RTNDetail: '收益詳情'
        },
        en: {
            dayChg: 'Day%Chg',
            time: 'Time',
            nav: 'NAV',
            finishedText: 'No More Content',
            RTNDetail: 'RTN Details'
        }
    },
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
            assetType: this.$route.query.assetType,
            total: 0,
            finishedText: '无更多内容'
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        isMMF() {
            return (
                FUND_ASSET_TYPE.MMF.value ===
                Number(this.$route.query.assetType)
            )
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
            // setTimeout(() => {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getFundNetPriceHistoryV1()
            }

            // }, 500)
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
                        this.list[this.list.length - 1].price = '0.00' // 最后一项涨跌幅无法则算为0
                        this.list[this.list.length - 1].revenue = '0.00' // 最后一项涨跌幅无法则算为0
                    } else {
                        if (Number(this.list[index + 1].netPrice) !== 0) {
                            item.price =
                                ((this.list[index].netPrice -
                                    this.list[index + 1].netPrice) /
                                    this.list[index + 1].netPrice) *
                                100
                            item.price =
                                this.assetType != 4
                                    ? Number(item.price).toFixed(2)
                                    : Number(item.price).toFixed(4)
                            item.revenue = Number(
                                Number(item.price).toFixed(4) * 100
                            ).toFixed(2)
                        } else {
                            item.price = '0.00'
                            item.revenue = '0.00'
                        }
                    }
                })
                // 加载状态结束
                this.loading = false
                // 数据全部加载完成
                if (this.list.length >= this.total) {
                    this.finished = true
                }
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
