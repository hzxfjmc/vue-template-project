<template lang="pug">
    .block__order--content
        .block__header--wrapper(v-if="isSingle")
            .block__left
                .top {{this.currency === 1? $t('C89') :$t('C3')}}
                .bottom.block__amount {{positionMarketValue|transNumToThousandMark}}
            .block__right
                .top {{$t('C5')}}
                .bottom(
                    v-if="totalEarnings>0"
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                ) +{{totalEarnings|transNumToThousandMark}}
                .bottom(
                    v-else-if="totalEarnings<0"
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                ) {{totalEarnings|transNumToThousandMark}}
                .bottom(
                    v-else
                ) {{totalEarnings|transNumToThousandMark}}
        hr(v-if="isSingle")
        .block__top(v-if="!isSingle")
            .block__left(@click="moneyTypeShow = true")
                span {{$t(moneyTypeText)}}
                span.iconfont.icon-pulldown_icon
            .block__right(@click="fundListShow = true")
                span.ellipse(v-if="fundName") {{fundName}}
                span.text(v-else) {{$t('allFund')}}
                span.iconfont.icon-pulldown_icon
        van-list.order-record-list(
            v-model="loading" 
            :finished="finished" 
            :finished-text="finishedText" 
            @load="onLoad")
            .block__order--list.border-bottom(
                v-for="(item,index) in filterList")
                .block__order--left
                    p.title.ellipse {{item.fundName}}
                    p.color {{item.createTime}}
                .block__order--right
                    p.num(
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                        v-if="item.recordAmount>0") +{{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                        v-else-if="item.recordAmount < 0") {{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(v-else) {{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
        .block-element-nomore(v-if="noMoreShow")
            img.img(src="@/assets/img/fund/data.png") 
            .no-record-box {{$t('noData')}}
        van-popup(
            v-model="moneyTypeShow"
            position="top"
            :closeable="true"
        )
            .block-type__list
                .list__item(
                    v-for="item in moneyTypeList"
                    @click="chooseMoneyType(item)"
                )
                    p(
                        :class="{active: currency === item.type}"
                    ) {{$t(item.key)}}
                    p(v-if="currency === item.type")
                        span.iconfont.icon-tick-
        van-popup(
            v-model="fundListShow"
            position="top"
        )
            .block-type__list
                .list__item(@click="chooseFund({fundId: '',fundName:''})")
                    p(
                        :class="{active:fundId === ''}"
                    ) {{$t('allFund')}}
                    p(v-if="fundId === ''")
                        span.iconfont.icon-tick-
                .list__item(
                    v-for="item in baoPositionList"
                    @click="chooseFund(item)"
                )
                    p(
                        :class="{active:fundId === item.fundId}"
                    ) {{item.fundName}}
                    p(v-if="fundId === item.fundId")
                        span.iconfont.icon-tick-

</template>
<script>
import {
    getBaoCapitalTradeListV2,
    getBaoPostionV2
} from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { getStockColorType } from '@/utils/html-utils.js'
import { List, Popup } from 'vant'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    components: {
        [List.name]: List,
        [Popup.name]: Popup
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        moneyTypeList() {
            return [
                {
                    key: 'moneyType',
                    type: '',
                    desc: '全部币种'
                },
                {
                    key: 'hkd',
                    type: 2,
                    desc: '港币'
                },
                {
                    key: 'usd',
                    type: 1,
                    desc: '美元'
                }
            ]
        }
    },
    i18n: {
        zhCHS: {
            Balance: '余额',
            noData: '暂无数据',
            nomore: '没有更多了'
        },
        zhCHT: {
            Balance: '餘額',
            noData: '暫無數據',
            nomore: '没有更多了'
        },
        en: {
            Balance: 'Balance',
            noData: 'No Data',
            nomore: 'No More'
        }
    },
    data() {
        return {
            positionMarketValue: '',
            totalEarnings: '',
            list: [],
            filterList: [],
            noMoreShow: false,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            moneyTypeShow: false,
            fundListShow: false,
            isSingle: !!this.$route.query.id,
            finishedText: '无更多内容',
            currency: '',
            moneyTypeText: 'moneyType',
            fundId: '',
            fundName: '',
            baoPositionList: []
        }
    },
    created() {
        this.getBaoCapitalTradeListV2()
        this.getBaoPostionV2()
    },
    methods: {
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getBaoCapitalTradeListV2()
            }
        },
        // 订单筛选
        filterListAction() {
            if (!this.fundId && !this.currency) {
                this.filterList = this.list
            } else if (!this.fundId) {
                this.filterList = this.list.filter(item => {
                    return item.currency === this.currency
                })
            } else if (!this.currency) {
                this.filterList = this.list.filter(item => {
                    return item.fundId === this.fundId
                })
            } else {
                this.filterList = this.list.filter(item => {
                    return (
                        item.fundId === this.fundId &&
                        item.currency === this.currency
                    )
                })
            }
            this.noMoreShow = this.filterList.length === 0
            if (this.filterList.length === 0) {
                this.finishedText = ''
            }
        },
        // 获取持仓基金list
        async getBaoPostionV2() {
            try {
                const { baoPositionList } = await getBaoPostionV2({
                    currency: 1
                })
                this.baoPositionList = baoPositionList
                if (this.$route.query.id) {
                    let choosedFund = this.baoPositionList.filter(
                        item => item.fundId === this.$route.query.id
                    )
                    this.currency = choosedFund[0].currency
                    this.positionMarketValue =
                        this.currency === 1
                            ? choosedFund[0].usdPositionMarketValue
                            : choosedFund[0].hkdPositionMarketValue
                    this.totalEarnings =
                        this.currency === 1
                            ? choosedFund[0].usdTotalEarnings
                            : choosedFund[0].hkdTotalEarnings
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getBaoCapitalTradeListV2() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getBaoCapitalTradeListV2({
                    currency: this.currency,
                    fundId: this.$route.query.id,
                    recordType: 3,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                list.map(item => {
                    item.createTime = dayjs(item.createTime).format(
                        'YYYY-MM-DD'
                    )
                })
                this.loading = false
                this.list = this.list.concat(list)
                this.filterListAction()
                this.pageNum = pageNum
                this.total = total
                this.pageSize = pageSize
                this.noMoreShow = this.total == 0
                if (this.filterList.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore')
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //选择币种
        chooseMoneyType(item) {
            this.moneyTypeShow = false
            if (this.currency === item.type) return
            this.currency = item.type
            this.moneyTypeText = item.key
            this.filterListAction()
        },
        // 选择基金
        chooseFund(item) {
            this.fundListShow = false
            this.fundId = item.fundId
            this.fundName = item.fundName
            this.filterListAction()
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
.block__top {
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
    color: #353547;
    text-align: center;
    .block__left,
    .block__right {
        max-width: 50%;
        display: flex;
        align-items: center;
    }
    .iconfont {
        font-size: 10px;
        padding-left: 10px;
    }
}
.block-type__list {
    margin: 0 12px;
    line-height: 20px;
    .list__item {
        padding: 14px 0;
        display: flex;
        align-content: center;
        justify-content: space-between;
        border-bottom: 1px solid $text-color8;
    }
    .active,
    .iconfont {
        color: #2f79ff;
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
