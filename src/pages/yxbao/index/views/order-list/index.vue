<template lang="pug">
.income-details-content
    .block__top(v-if="!isSingle")
        .block__left(
            @click="moneyTypeClick"
            :class="{active: moneyTypeShow}"
        )
            span {{moneyTypeText}}
            span.iconfont.icon-pulldown_icon
        .block__right(
            @click="typeListClick"
            :class="{active: typeListShow}"
        )
            span.ellipse(v-if="recordTypeName") {{recordTypeName}}
            span.text(v-else) {{$t('allType')}}
            span.iconfont.icon-pulldown_icon
    van-list.order-record-list(
        v-model="loading"
        :class="{'not-single': !isSingle}"
        :finished="finished" 
        :finished-text="finishedText" 
        @load="onLoad")
        .block-list(
            class="border-bottom"
            v-for="(item,index) in list" 
            :key="index" 
            @click="toDetailHandle(item)"
            )
            .block__order--list(v-if="!isSingle")
                .block__order--left
                    p.title.ellipse {{item.fundName}}(
                        span {{item.currency === 1 ? $t('usd') : $t('hkd')}})
                    p.color {{item.createTime}}
                .block__order--right(v-if="item.recordType != 3")
                    p {{item.recordTypeName}}
                    p.num(
                        v-if="item.recordType === 1"
                    ) +{{item.recordAmount | transNumToThousandMark}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(
                        v-else-if="item.recordType === 2"
                    ) -{{item.recordAmount | transNumToThousandMark}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(v-else) {{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                .block__order--right(v-else)
                    p {{item.recordTypeName}}
                    p.num(
                        v-if="item.recordAmount>0"
                    ) +{{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(
                        v-else
                    ) {{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
            .block__order--list(v-else)
                .block__order--left
                    p.title {{item.recordTypeName}}
                    p.color {{item.createTime}}
                .block__order--right(v-if="item.recordType != 3")
                    p.num(
                        v-if="item.recordType === 1"
                    ) +{{item.recordAmount | transNumToThousandMark}}{{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.num(
                        v-else-if="item.recordType === 2"
                    ) -{{item.recordAmount}}{{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.num(v-else) {{item.recordAmount | transNumToThousandMark}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.color {{$t('Balance')}} {{item.recordBalance}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                .block__order--right(v-else)
                    p.num(
                        v-if="item.recordAmount>0"
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    ) +{{item.recordAmount}}
                    p.num(
                        v-else
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    ) {{item.recordAmount}}
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/yxbao/data.png") 
        .no-record-box {{$t('nomore')}}
    van-popup(
            v-model="moneyTypeShow"
            position="top"
        )
            .block-type__list
                .list__item(
                    v-for="item in moneyTypeItem"
                    @click="chooseMoneyType(item)"
                )
                    p(
                        :class="{active: currency === item.currency}"
                    ) {{$t(item.key)}}
                    p(v-if="currency === item.currency")
                        span.iconfont.icon-tick-
    van-popup(
        :class="{'no-top': isSingle}"
        v-model="typeListShow"
        position="top"
        @click-overlay="handleClick"
    )
        .block-type__list
            .list__item(
                v-for="item in recordTypeItem"
                @click="chooseRecoderType(item)"
            )
                p.title(:class="{active: recordType === item.recordType && outType === item.outType}") {{$t(item.key)}}
                p(v-if="recordType === item.recordType && outType === item.outType")
                    span.iconfont.icon-tick-
</template>
<script>
import { getBaoCapitalTradeListV2 } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { List, Popup } from 'vant'
import { isYouxinApp } from '../../../../../utils/html-utils'
import { jsBridge } from 'yx-base-h5'
import { getStockColorType } from '@/utils/html-utils.js'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    components: {
        [List.name]: List,
        [Popup.name]: Popup
    },
    i18n: {
        zhCHS: {
            Balance: '余额',
            nomore: '暂无数据',
            filterText: '筛选',
            cancleText: '取消'
        },
        zhCHT: {
            Balance: '餘額',
            nomore: '暫無數據',
            filterText: '篩選',
            cancleText: '取消'
        },
        en: {
            Balance: 'Balance',
            nomore: 'No Data',
            filterText: 'Filter',
            cancleText: 'Cancel'
        }
    },
    data() {
        return {
            list: [],
            filterList: [],
            recordTypeList: [],
            moneyTypeList: [],
            noMoreShow: false,
            typeListShow: false,
            recordTypeName: '',
            moneyTypeShow: false,
            lockOnload: false,
            moneyTypeText: this.$t('moneyType'),
            currency: '',
            recordType: '',
            outType: '',
            isSingle: !!this.$route.query.id,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容'
        }
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    methods: {
        // 跳转到详情
        toDetailHandle(item) {
            if (item.recordType === 3) return
            let data = {
                name: 'account-details',
                params: {
                    data: item
                }
            }
            this.$router.push(data)
        },
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total && !this.lockOnload) {
                this.pageNum = this.pageNum + 1
                this.getBaoCapitalTradeListV2()
            }
        },
        async getBaoCapitalTradeListV2() {
            try {
                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    fundId: this.$route.query.id,
                    currency: this.currency,
                    recordType: this.recordType,
                    outType: this.outType
                }
                for (let key in params) {
                    if (!params[key]) {
                        delete params[key]
                    }
                }
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getBaoCapitalTradeListV2(params)
                this.loading = false
                this.lockOnload = false
                let outTypeName = this.$t([
                    '普通转出',
                    '普通轉出',
                    'Redemption（Fast）'
                ])
                let fastOutTypeName = this.$t([
                    '快速转出',
                    '快速轉出',
                    'Redemption（Common）'
                ])
                list.map(item => {
                    item.createTime = dayjs(item.createTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                    if (item.outType === 2) {
                        item.recordTypeName = fastOutTypeName
                    }
                    if (item.outType === 1) {
                        item.recordTypeName = outTypeName
                    }
                })
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
        },
        chooseMoneyType(item) {
            this.typeListShow = false
            this.moneyTypeShow = false
            if (this.currency === item.currency) return
            this.currency = item.currency
            this.moneyTypeText = this.$t(item.key)
            this.lockOnload = true
            this.list = []
            this.pageNum = 1
            this.finished = false
            this.getBaoCapitalTradeListV2()
        },
        chooseRecoderType(item) {
            this.typeListShow = false
            this.moneyTypeShow = false
            this.setFilterButton()
            this.outType = item.outType
            this.recordType = item.recordType
            this.recordTypeName = this.$t(item.key)
            this.lockOnload = true
            this.list = []
            this.pageNum = 1
            this.finished = false
            this.getBaoCapitalTradeListV2()
        },
        setFilterButton() {
            if (isYouxinApp && this.isSingle) {
                jsBridge.callApp('command_set_titlebar_button', {
                    position: 2, //position取值1、2
                    clickCallback: 'clickFilterCallback',
                    type: 'text',
                    text: this.typeListShow
                        ? this.$t('cancleText')
                        : this.$t('filterText')
                })
            }
        },
        handleClick() {
            this.typeListShow = false
            this.setFilterButton()
        },
        moneyTypeClick() {
            this.moneyTypeShow = !this.moneyTypeShow
            this.typeListShow = false
        },
        typeListClick() {
            this.typeListShow = !this.typeListShow
            this.moneyTypeShow = false
        }
    },
    computed: {
        recordTypeItem() {
            return [
                {
                    key: 'allType',
                    recordType: '',
                    outType: '',
                    desc: '全部类型'
                },
                {
                    key: 'C9',
                    recordType: 1,
                    outType: '',
                    desc: '转入'
                },
                {
                    key: 'C18',
                    recordType: 2,
                    outType: 1,
                    desc: '普通转出'
                },
                {
                    key: 'C19',
                    recordType: 2,
                    outType: 2,
                    desc: '快速转出'
                },
                {
                    key: 'C11',
                    recordType: 3,
                    outType: '',
                    desc: '收益'
                }
            ]
        },
        moneyTypeItem() {
            return [
                {
                    key: 'moneyType',
                    currency: '',
                    desc: '全部币种'
                },
                {
                    key: 'hkd',
                    currency: 2,
                    desc: '港币'
                },
                {
                    key: 'usd',
                    currency: 1,
                    desc: '美元'
                }
            ]
        },
        stockColorType() {
            return +getStockColorType()
        }
    },
    async created() {
        this.getBaoCapitalTradeListV2()
        if (this.$route.query.id) {
            this.setFilterButton()
        }
        window.clickFilterCallback = async () => {
            this.typeListShow = !this.typeListShow
            this.setFilterButton()
        }
    }
}
</script>
<style lang="scss" scoped>
.income-details-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    .block-list {
        width: 100%;
        // padding: 10px 2%;
        // display: flex;
        align-items: center;
    }
}
.block__top {
    width: 100%;
    position: fixed;
    height: 40px;
    z-index: 3000;
    background: #fff;
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
    .active {
        color: #2f79ff;
    }
}
.not-single {
    margin-top: 30px;
}
.block__order--list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 82px;
    align-items: center;
    .block__order--left {
        width: 50%;
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
.van-popup {
    top: 40px;
    border-radius: 0px 0px 10px 10px;
    &.no-top {
        top: 0;
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
    .iconfont,
    .active {
        color: #2f79ff;
    }
}
.block__no-more {
    width: 100%;
    text-align: center;
    color: rgba(25, 25, 25, 0.45);
    line-height: 20px;
    margin: 20px 0 0 0;
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
