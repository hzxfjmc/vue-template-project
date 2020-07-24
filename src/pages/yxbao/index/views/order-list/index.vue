<template lang="pug">
.income-details-content
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
            .block__order--list
                .block__order--left
                    p.title {{item.fundName}}
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
        v-model="typeListShow"
        position="top"
        @click-overlay="handleClick"
    )
        .block-type__list
            .list__item(
                v-for="item in recordTypeList"
                @click="chooseRecoderType(item.val)"
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
            type: '全部类型',
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
            noMoreShow: false,
            typeListShow: false,
            buttonText: this.$t('filterText'),
            recordType: 0,
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
                this.filterList = this.list
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
        chooseRecoderType(val) {
            this.typeListShow = false
            this.setFilterButton()
            if (this.recordType === val) return
            this.recordType = val
            switch (val) {
                case 0:
                    this.filterList = this.list
                    break
                case 1:
                    this.filterList = this.list.filter(item => {
                        return item.recordType === 1
                    })
                    break
                case 2:
                    this.filterList = this.list.filter(item => {
                        return item.outType === 1
                    })
                    break
                case 3:
                    this.filterList = this.list.filter(item => {
                        return item.outType === 2
                    })
                    break
                case 4:
                    this.filterList = this.list.filter(item => {
                        return item.recordType === 3
                    })
            }
            this.noMoreShow = this.filterList.length == 0
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
        recordTypeList() {
            return [
                {
                    key: 'type',
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
        stockColorType() {
            return +getStockColorType()
        }
    },
    async created() {
        this.getBaoCapitalTradeListV2()
        this.setFilterButton()
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
