<template lang="pug">
    #app(:class="{mainland: isMainland}")
        .tabs
            .tab(:class="{selected: tabActive_0}" @click="pickEntry") {{ tab_0 }}
            .tab(:class="{selected: tabActive_1}" @click="pickDaterange") {{ tab_1 }}
        .main(v-if="list.length > 0")
            van-pull-refresh(v-model="pullLoading" @refresh="onRefresh" :loosing-text="$t('loosingText')" :pulling-text="$t('pullingText')" :loading-text="$t('loadingText')")
                van-list.vant-list-wrap(v-model="listLoading" :finished="finished" :finished-text="$t('noMore')" :loading-text="$t('loadingText')" @load="onLoad" :offset="20")
                    template(v-for="(item, index) in list")
                        .date(v-if="index ===0 || item.showMonth !== list[index-1].showMonth") {{ item.showMonth }}
                        .item
                            .item__line
                                span {{ item.businessName || '--' }}
                                span {{ item.occurBalance | signFormat }}
                            .item__subline
                                span {{ item | formatTime }}
                                span {{ $t('canUseCash') + item.afterBalance }}
        no-data(v-else :text="$t('nodata')")
        pick-entry(v-model="tab_0" @input="onRefresh" :show.sync="tabSelected_0")
</template>

<script>
import { List, PullRefresh, Toast } from 'vant'
import PickEntry from './components/pick-entry'
import NoData from '../0-components/no-data'
import pickDaterange from './utils/pick-daterange'
import { fetchFundRecord } from '../0-service/market'
import dayjs from 'dayjs'
import config from '../0-config'

export default {
    name: 'App',
    components: {
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        NoData,
        PickEntry
    },
    data() {
        return {
            isMainland: config.isMainland,
            tab_0: 'HKD',
            tab_1: this.$t('all'),
            tabActive_0: false,
            tabActive_1: false,
            tabSelected_0: false,
            tabSelected_1: false,
            pullLoading: false,
            listLoading: false,
            finished: true,
            list: [],
            pageNum: 1,
            daterange: {
                type: -1,
                value: [null, null]
            }
        }
    },
    mounted() {
        this.onLoad(true)
    },
    methods: {
        async onLoad(showLoading) {
            try {
                const moneyMap = new Map([['USD', 1], ['HKD', 2]])
                const startTime = this.daterange.value[0]
                    ? this.daterange.value[0] + ' 00:00:00'
                    : null
                const endTime = this.daterange.value[1]
                    ? this.daterange.value[1] + ' 23:59:59'
                    : null
                const data = await fetchFundRecord(
                    {
                        dateType: this.daterange.type,
                        moneyType: moneyMap.get(this.tab_0),
                        pageNum: this.pageNum,
                        pageSize: 10,
                        startTime,
                        endTime
                    },
                    { _no_loading: !showLoading }
                )
                if (this.pageNum === 1) {
                    this.list = data.list.map(item => {
                        item.showMonth = dayjs(item.month).format('YYYY-MM')
                        return item
                    })
                } else {
                    this.list = this.list.concat(
                        data.list.map(item => {
                            item.showMonth = dayjs(item.month).format('YYYY-MM')
                            return item
                        })
                    )
                }
                this.pageNum++
                this.listLoading = false
                this.finished = this.list.length >= data.total
            } catch (e) {
                this.listLoading = false
                this.error = true
                Toast(e.msg || this.$t('errorTips'))
            }
        },
        pickEntry() {
            pickDaterange.hide()
            this.tabSelected_1 = false
            this.tabSelected_0 = !this.tabSelected_0
        },
        // 切换日期选择器
        async pickDaterange(ev) {
            this.tabSelected_0 = false
            if (!this.tabSelected_1) {
                this.tabSelected_1 = true
                try {
                    this.daterange = await pickDaterange(ev.target)
                    this.tab_1 = this.daterange.name || this.$t('customize')
                    this.tabSelected_1 = false
                    this.tabActive_1 = true
                    this.onRefresh()
                } catch (e) {
                    this.tabSelected_1 = false
                }
            } else {
                this.tabSelected_1 = false
                pickDaterange.hide()
            }
        },
        async onRefresh() {
            this.pageNum = 1
            await this.onLoad()
            this.pullLoading = false
            this.tabActive_0 = true
        }
    },
    filters: {
        formatTime(item) {
            item.time = item.time || ''
            return dayjs(item.month + ' ' + item.time).format(
                item.time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
            )
        },
        signFormat(value) {
            return parseFloat(value) > 0 ? '+' + value : value
        }
    }
}
</script>

<style lang="less" scoped>
#app {
    display: flex;
    flex-direction: column;
    color: #393939;
}
.tabs {
    z-index: 1;
    display: flex;
    justify-content: space-around;
}
.tab {
    color: rgba(#393939, 0.6);
    line-height: 44px;
    &:after {
        content: '';
        display: inline-block;
        border-width: 5px 5px 0;
        border-style: solid;
        border-color: #c4c4c4 transparent transparent;
        margin-left: 5px;
        position: relative;
        top: -2px;
    }
    &.selected {
        color: #0055ff;
        &:after {
            border-color: #0055ff transparent transparent;
        }
    }
}
.main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
</style>

<style lang="scss">
/*.item的div偶尔会出现最后一个style scoped不生效的,原因也许与template有关，待验证*/
.vant-list-wrap {
    .date {
        color: rgba(#353547, 0.6);
        background: #f8f8f8;
        padding: 0 18px;
        line-height: 30px;
    }
    .item {
        margin: 0 18px;
        padding: 14px 0;
        + .item {
            border-top: 1px solid rgba(#393939, 0.08);
        }
        .item__line,
        .item__subline {
            display: flex;
            justify-content: space-between;
        }
        .item__line {
            font-size: 16px;
            color: #191919;
            margin-bottom: 3px;
        }
        .item__subline {
            color: rgba(#191919, 0.4);
        }
    }
    .mainland {
        .date {
            color: rgba(#353547, 0.5);
            background: #f1f3f8;
            line-height: 36px;
        }
        .item {
            margin: 0 8px;
            padding: 14px 6px;
        }
    }
}
</style>
