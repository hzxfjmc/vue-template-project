<template lang="pug">
.income-details-content
    .block__top(v-if="!isSingle")
        .block__left(@click="moneyTypeShow = true")
            span {{$t(moneyTypeText)}}
            span.iconfont.icon-pulldown_icon
        .block__right(@click="typeListShow = true")
            span.ellipse(v-if="recordTypeName") {{recordTypeName}}
            span.text(v-else) {{$t('allType')}}
            span.iconfont.icon-pulldown_icon
    van-list.order-record-list(
        v-model="loading" 
        :finished="finished" 
        :finished-text="finishedText" 
        @load="onLoad")
        .block-list(
            class="border-bottom"
            v-for="(item,index) in filterList" 
            :key="item.recordNo" 
            @click="toDetailHandle(item)"
            )
            .block__order--list(v-if="!isSingle")
                .block__order--left
                    p.title {{item.fundName}}
                    p.color {{item.createTime}}
                .block__order--right(v-if="item.recordType != 3")
                    p.num {{item.recordTypeName}}
                    p.num(
                        v-if="item.recordType === 1"
                    ) +{{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(
                        v-else-if="item.recordType === 2"
                    ) -{{item.recordAmount}}{{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.num(v-else) {{item.recordAmount}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                .block__order--right(v-else)
                    p.num(
                        v-if="item.recordAmount>0"
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    ) +{{item.recordAmount}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.num(
                        v-else
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    ) {{item.recordAmount}} {{item.currency === 1 ? $t('usd') : $t('hkd')}}
                    p.color {{$t('Balance')}} {{item.recordBalance}} {{item.currency === 1 ? $t('usd') : $t('hkd')}}
            .block__order--list(v-else)
                .block__order--left
                    p.title {{item.recordTypeName}}
                    p.color {{item.createTime}}
                .block__order--right(v-if="item.recordType != 3")
                    p.num(
                        v-if="item.recordType === 1"
                    ) +{{item.recordAmount}}{{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.num(
                        v-else-if="item.recordType === 2"
                    ) -{{item.recordAmount}}{{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.num(v-else) {{item.recordAmount}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.color {{$t('Balance')}} {{item.recordBalance}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                .block__order--right(v-else)
                    p.num(
                        v-if="item.recordAmount>0"
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    ) +{{item.recordAmount}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.num(
                        v-else
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    ) {{item.recordAmount}} {{item.currency === 1 ? 'USD' : 'HKD'}}
                    p.color {{$t('Balance')}} {{item.recordBalance}} {{item.currency === 1 ? 'USD' : 'HKD'}}
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
                        :class="{active: currency === item.type}"
                    ) {{$t(item.key)}}
                    p(v-if="currency === item.type")
                        span.iconfont.icon-tick-
    van-popup(
        v-model="typeListShow"
        position="top"
        @click-overlay="handleClick"
    )
        .block-type__list
            .list__item(
                v-for="item in recordTypeItem"
                @click="chooseRecoderType(item)"
            )
                p.title(:class="{active: recordType === item.val}") {{$t(item.key)}}
                p(v-if="recordType === item.val")
                    span.iconfont.icon-tick-
</template>
<script>
import { getBaoCapitalTradeListV2 } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { List, Popup } from 'vant'
import { isYouxinApp } from '../../../../../utils/html-utils'
import { jsBridge } from 'yx-base-h5'
import { getStockColorType } from '@/utils/html-utils.js'
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
            moneyTypeText: 'moneyType',
            currency: '',
            recordType: 0,
            isSingle: !!this.$route.query.id,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容'
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
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getBaoCapitalTradeListV2()
            }
        },
        filterRecoderType() {
            switch (this.recordType) {
                case 0:
                    this.recordTypeList = this.list
                    break
                case 1:
                    this.recordTypeList = this.list.filter(item => {
                        return item.recordType === 1
                    })
                    break
                case 2:
                    this.recordTypeList = this.list.filter(item => {
                        return item.outType === 1
                    })
                    break
                case 3:
                    this.recordTypeList = this.list.filter(item => {
                        return item.outType === 2
                    })
                    break
                case 4:
                    this.recordTypeList = this.list.filter(item => {
                        return item.recordType === 3
                    })
            }
        },
        filterMoneyType() {
            if (!this.currency) {
                this.moneyTypeList = this.list
            } else {
                this.moneyTypeList = this.list.filter(item => {
                    return item.currency === this.currency
                })
            }
        },
        comFilterAction() {
            if (!this.currency && !this.recordType) {
                this.filterList = this.list
            } else if (!this.currency) {
                this.filterRecoderType()
                this.filterList = this.recordTypeList
            } else if (!this.recordType) {
                this.filterMoneyType()
                this.filterList = this.moneyTypeList
            } else {
                this.filterRecoderType()
                this.filterMoneyType()
                this.filterList = this.moneyTypeList.filter(item => {
                    return this.recordTypeList.indexOf(item) !== -1
                })
            }
            this.noMoreShow = this.filterList.length === 0
        },
        async getBaoCapitalTradeListV2() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getBaoCapitalTradeListV2({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    fundId: this.$route.query.id
                })
                this.loading = false
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
                this.filterList = list
                this.comFilterAction()
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
            this.moneyTypeShow = false
            if (this.currency === item.type) return
            this.currency = item.type
            this.moneyTypeText = item.key
            this.comFilterAction()
        },
        chooseRecoderType(item) {
            this.typeListShow = false
            this.setFilterButton()
            if (this.recordType === item.val) return
            this.recordType = item.val
            this.recordTypeName = this.$t(item.key)
            this.comFilterAction()
        },
        setFilterButton() {
            if (isYouxinApp) {
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
        }
    },
    computed: {
        recordTypeItem() {
            return [
                {
                    key: 'allType',
                    val: 0,
                    desc: '全部类型'
                },
                {
                    key: 'C9',
                    val: 1,
                    desc: '转入'
                },
                {
                    key: 'C18',
                    val: 2,
                    desc: '普通转出'
                },
                {
                    key: 'C19',
                    val: 3,
                    desc: '快速转出'
                },
                {
                    key: 'C11',
                    val: 4,
                    desc: '收益'
                }
            ]
        },
        moneyTypeItem() {
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
            font-weight: 420;
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
    border-radius: 0px 0px 20px 20px;
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
