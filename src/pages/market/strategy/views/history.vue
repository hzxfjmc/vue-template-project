<template lang="pug">
    .history
        no-data(v-if="$route.params.auth === '0'" :text="$t('noAccessBeforeUnlock')" :color="$root.isMainland ? 'black' : 'white'")
        template(v-else)
            template(v-if="data.length > 0")
                .header
                    .header__name {{ $t('nameAndCode') }}
                    .header__name {{ $t('operationDirection') }}
                    .header__name {{ $t('operationPrice') }}
                    .header__name(@click="dialog($t('tipsIncome'))")
                        | {{ $t('incomeRate') }}
                        .mark ?
                .main
                    van-list(v-model="loading" :finished="finished" :error.sync="error" @load="getData" :offset="20")
                        template(v-for="(item, index) in formatData")
                            .date(v-if="index === 0 || item.date !== formatData[index-1].date") {{ item.date }}
                            .tr
                                .td(@click="$gotoStockDetail(item)")
                                    .td__name {{ item.secu_name }}
                                    .td__code {{ item.secu_code ? item.secu_code.slice(2) : '--' }}
                                .td {{ item.oper_direct === 1 ? $t('transferIn') : $t('transferOut') }}
                                .td {{ item.oper_price || '--' }}
                                .td(:class="{up: item.return_rate > 0, down: item.return_rate < 0, reverse: $root.stockColorType === '2'}")
                                    | {{ item.return_rate | formatRate }}
            no-data(v-else :text="$t('nodata')" :color="$root.isMainland ? 'black' : 'white'")
            transition(name="fadeup")
                history-search(v-show="showHistory" @cancel="initTitleBar" @select="selectHistory")
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import NoData from '../../0-components/no-data'
import HistorySearch from '../components/history-search'
import { getLongStrategyHistory } from '../../0-service/market'
import { Toast, List } from 'vant'
import { getUrlParam } from '../../0-utils'

export default {
    name: 'history',
    components: {
        NoData,
        HistorySearch,
        [List.name]: List
    },
    data() {
        return {
            loading: false,
            finished: false,
            error: false,
            page: 1,
            showHistory: false,
            data: []
        }
    },
    computed: {
        formatData() {
            let res = []
            this.data.forEach(item => {
                item.stocks.forEach(citem => (citem.date = item.date))
                res = res.concat(item.stocks)
            })
            return res
        }
    },
    mounted() {
        this.getData()
    },
    activated() {
        if (this.$route.params.auth === '1') {
            this.initTitleBar()
        }
    },
    deactivated() {
        this.showHistory = false
    },
    methods: {
        // 设置titlebar
        initTitleBar() {
            this.showHistory = false
            if (JSBridge.isYouxinApp) {
                JSBridge.registerFn('search', () => this.hideTitlebarIcon())
                JSBridge.callApp('command_set_titlebar_button', {
                    position: 2,
                    type: 'icon',
                    icon: 'search',
                    clickCallback: 'search'
                })
            }
        },
        // 隐藏titlebar icon
        hideTitlebarIcon() {
            this.showHistory = true
            if (JSBridge.isYouxinApp) {
                JSBridge.callApp('command_set_titlebar_button', {
                    type: 'hide',
                    position: 2,
                    text: '',
                    clickCallback: ''
                })
            }
        },
        // 加载数据
        async getData(stockid = null) {
            try {
                const data = await getLongStrategyHistory({
                    strategy_id: getUrlParam('id'),
                    strategy_version: getUrlParam('version'),
                    stock_id: stockid,
                    offset: (this.page - 1) * 10,
                    pagesize: 10
                })
                if (this.page === 1) {
                    this.data = data.list
                } else {
                    this.data = this.data.concat(data.list)
                }
                this.page++
                this.loading = false
                this.finished = this.formatData.length >= data.count
            } catch (e) {
                this.loading = false
                this.error = true
                Toast(e.msg || this.$t('errorTips'))
            }
        },
        // 选择历史记录
        async selectHistory(item) {
            this.initTitleBar()
            this.page = 1
            this.getData(item.market + item.symbol)
        },
        dialog(message) {
            this.$dialog({
                message,
                confirmButtonText: this.$t('confirm')
            })
        },
        // 跳转个股详情
        gotoStock(stock) {
            // 埋点
            this.$buryingPoint({
                view_name: '个别股票',
                info_source: this.data.strategy_name,
                stock_id: stock.secu_code
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/mark.css';
.history {
    background: #fff;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.header {
    padding: 0 18px;
    background: #fff;
}
.header__name {
    font-size: 14px;
    line-height: 50px;
    color: rgba(#393939, 0.6);
    float: left;
    width: 21%;
    .mark {
        color: rgba(#393939, 0.6);
        border-color: rgba(#393939, 0.6);
    }
    &:nth-child(2),
    &:nth-child(4) {
        text-align: right;
    }
    &:nth-child(2) {
        width: 37%;
        padding-right: 10px;
    }
    &:nth-child(3) {
        text-align: center;
    }
}
.main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 18px 0;
}
.date {
    color: #393939;
    font-size: 20px;
    margin-top: 10px;
    &:not(:first-child) {
        margin-top: 20px;
    }
}
.tr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(#393939, 0.05);
    padding: 10px 0;
    height: 60px;
}
.td {
    width: 21%;
    font-size: 16px;
    color: #393939;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:first-child {
        width: 37%;
    }
    &:nth-child(2),
    &:nth-child(4) {
        text-align: right;
    }
    &:nth-child(2) {
        padding-right: 10px;
    }
    &:nth-child(3) {
        text-align: center;
    }
}
.td__name,
.td__code {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}
.td__code {
    font-size: 12px;
    color: rgba(#393939, 0.5);
}
@import '../../0-style/transition/fadeup.less';
/*大陆版*/
.is-mainland {
    .history {
        background: #0b121f;
    }
    .header {
        background: #0b121f;
        &__name {
            color: rgba(#ebebeb, 0.4);
            .mark {
                color: rgba(#ebebeb, 0.4);
                border-color: rgba(#ebebeb, 0.4);
            }
        }
    }
    .date {
        color: #ebebeb;
    }
    .td {
        color: #ebebeb;
    }
    .td__code {
        color: rgba(#ebebeb, 0.4);
    }
}
</style>
