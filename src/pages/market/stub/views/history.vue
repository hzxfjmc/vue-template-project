<template lang="pug">
    van-list.stub-history(
        v-model="loading"
        ref="scrollList"
        :class="{mainland: $ua.isMainland}"
        :finished="finished"
        :error.sync="error"
        :finished-text="tradingDayList.length ? i18n.noMore : ''"
        :immediate-check="true"
        @load="onLoad"
    )
        // 没有历史记录
        no-data(v-if="!tradingDayList.length && !loading" text="")

        // 历史记录列表
        van-collapse(
            v-if="tradingDayList.length"
            v-model="activeNames"
            accordion
            @change="changeHandler"
        )

            // 交易日列表
            van-collapse-item.history-item(
                v-for="(item, index) in tradingDayList"
                :key="item.id"
                :ref="`item${item.id}`"
                :title="`${item.id} ${$t('listCell').title(item.stock_num)}`"
                :name="item.id"
                :data-index="index"
                :data-time="item.id"
                :class="{ disabled: item.stock_num <= 0 }"
                :disabled="item.stock_num <= 0 || stockListLoading"
            )
                // 交易日对应股票列表
                list-cell(
                    :list="stockList[item.id] || []"
                    :loading="false"
                    :history="true"
                    :null-tip="nullTip"
                    :strategy-id="$route.params.id"
                    :strategy-name="$route.params.strategyName"
                )
</template>

<script>
import { Collapse, CollapseItem, List } from 'vant'
import ListCell from '../components/list-cell'
import NoData from '@market-components/no-data'
import { getStubHistory, getStubHistoryDate } from '@market-service/market'
import mixins from '../mixins'
import { isArray, isObject, isString } from '@market-utils'
import { isIOS } from '@/utils/html-utils'

const page_size = 60 // 交易日单页加载调试

/**
 * 更新
 * @type {{timer: null, close(): void, open(*): void}}
 */
// const update = {
//     timer: null,
//     delay: 10 * 1000, // 10秒更新一次
//     // 开启更新
//     open(vm) {
//         this.close()
//         this.timer = setTimeout(() => {
//             if (vm.activeNames) {
//                 // 获取当前展开入选日股票历史记录
//                 vm.isAutoLoading = true
//                 vm.getStubHistory(vm.activeNames)
//                     .then(() => {
//                         vm.isAutoLoading = false
//                         this.open(vm)
//                     })
//                     .catch(() => {
//                         vm.isAutoLoading = false
//                     })
//             }
//         }, this.delay)
//     },
//     // 关闭更新
//     close() {
//         this.timer && clearTimeout(this.timer)
//     }
// }

// 短线详情历史记录
export default {
    name: 'history',
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [List.name]: List,
        'list-cell': ListCell,
        'no-data': NoData
    },
    mixins: [mixins],
    data() {
        return {
            // 滚动加载相关加载相关
            loading: false,
            finished: false,
            error: false,

            tradingDayList: [], // 交易日列表

            activeNames: '', // 当前选中交易日
            stockList: {}, // 当前选中交易日对应股票列表
            nullTip: '', // 交易日没有股票时的提示文案
            stockListLoading: true, // 股票列表加载状态
            // isAutoLoading: false, // 是否在自動刷新
            startDate: '' // 最开始有股票的时间
        }
    },
    computed: {
        // 多语言
        i18n() {
            return this.$t('history')
        }
    },
    activated() {
        this.$html.setTitle(this.i18n.title)
    },
    // watch: {
    //     // 判断当前是否交易是否需要定时更新（未过期需要定时更新）
    //     activeNames() {
    //         if (this.activeNames) {
    //             const day = this.getActiveDate(this.activeNames)
    //
    //             if (!day.expire) {
    //                 update.open(this)
    //             } else {
    //                 update.close()
    //             }
    //         } else {
    //             update.close()
    //         }
    //     }
    // },
    methods: {
        /**
         * 获取历史记录交易日
         * @param no_loading 是否显示加载loading
         * @returns {Promise<Array>}
         */
        async getStubHistoryDate(no_loading = false) {
            let openItem = undefined

            // 交易日加载完成
            if (this.finished) return Promise.resolve(openItem)

            // 已经取到第一条有股票的交易日
            if (
                this.startDate &&
                this.tradingDayList.length &&
                new Date(this.startDate) < new Date(this.tradingDayList[0].date)
            ) {
                this.loading = false
                this.finished = true
                return Promise.resolve(openItem)
            }

            try {
                const { id, version } = this.$route.params
                const { list = [] } = await getStubHistoryDate(
                    {
                        strategy_id: id,
                        strategy_version: version,
                        offset: this.tradingDayList.length,
                        pagesize: page_size
                    },
                    no_loading
                )

                this.loading = false
                if (list.length < page_size) {
                    this.finished = true
                }

                // 数据适配
                list.forEach(item => {
                    let _item = {
                        id: item,
                        date: item, // 交易日
                        expire: true, // true过期，false未过期
                        stock_num: 0 // 交易日包含股票數
                    }

                    try {
                        if (isObject(item)) {
                            _item = {
                                id: item.date,
                                date: item.date,
                                expire: Boolean(+item.expire),
                                stock_num: +(
                                    item.stock_count ||
                                    item.Stock_count ||
                                    0
                                )
                            }
                        } else if (isString(item)) {
                            _item = {
                                id: item,
                                date: item,
                                expire: true,
                                stock_num: 0
                            }
                        } else if (isArray(item)) {
                            const [date, expire, stock_num] = item
                            _item = {
                                id: date,
                                date,
                                expire: Boolean(+expire),
                                stock_num: +stock_num
                            }
                        }
                    } catch (e) {
                        _item = {
                            id: item,
                            date: item,
                            expire: true,
                            stock_num: 0
                        }
                    }

                    // 当前加载的第一条数据
                    if (!openItem && _item.stock_num > 0) openItem = _item
                    this.tradingDayList.push(_item)
                })

                return Promise.resolve(openItem)
            } catch (e) {
                this.loading = false
                this.error = true
            }
        },
        /**
         * 获取历史纪录
         * @param date
         * @param no_loading
         * @returns {Promise<void>}
         */
        async getStubHistory(date, no_loading = true) {
            try {
                const { id, version } = this.$route.params
                const user_auth = await this.getUserAuth()

                this.stockListLoading = true

                const data = await getStubHistory(
                    {
                        strategy_id: id,
                        strategy_version: version,
                        startdate: date,
                        days: 1,
                        user_auth
                    },
                    no_loading
                )

                this.stockListLoading = false
                this.startDate = data.startdate

                // 数据适配
                this.stockList[date] = (data.stocks || []).map(item => {
                    const market = item.secu_code.slice(0, 2)
                    const market_code = item.secu_code.slice(2)

                    return {
                        delisting: +item.delisting, // 是否已退市，0未退市，1已退市
                        name: item.secu_name, // 股票名称
                        code: item.secu_code, // 股票市场+代码
                        market, // 股票市场
                        market_code, // 股票代码
                        price: item.sel_price, // 入选价
                        suggest: item.stop_profit_price, // 止盈
                        loss: item.stop_loss_price, // 止损
                        rise: item.inc_rate, // 涨幅
                        riseMax: item.hinc_rate, // 最高涨幅
                        expiredMark: !!+item.expired_mark, // 是否已过期 0-未过期 1-已过期
                        stopProfit: +item.stop_status // 止盈状态：0既不止盈也不止损；1止盈；2止损
                    }
                })

                this.nullTip = data.norecommend_tips // 没有股票时提示
            } catch (e) {
                this.stockListLoading = false
            }
        },
        /**
         * 展示交易日切换
         * @param date 待展示交易日‘2018-01-20’
         */
        async changeHandler(date) {
            if (date) {
                this.stockListLoading = true
                this.handleOpen(date)
                await this.getStubHistory(date)
                this.handleOpen(date)
            }
        },
        /**
         * 交易日列表加载
         */
        onLoad() {
            // 获取交易日列表
            this.getStubHistoryDate(true).then(openDate => {
                if (
                    !openDate ||
                    !openDate.id ||
                    this.tradingDayList.length > page_size
                )
                    return

                // 获取交易日对应历史记录
                this.getStubHistory(openDate.id).then(() => {
                    if (this.tradingDayList.length <= page_size) {
                        this.$nextTick(() => {
                            this.activeNames = openDate.id
                        })
                    }
                })
            })
        },
        /**
         * 展开滚动
         */
        handleOpen(date) {
            if (isIOS) {
                window.setTimeout(() => {
                    const cell = this.$refs[`item${this.activeNames}`][0] // 当前展开元素
                    const cell_el = cell.$el
                    const index = +cell_el.getAttribute('data-index')
                    const scrollTop = index * 44

                    console.log('scrollTop:', scrollTop)
                    window.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    })
                    console.log(
                        'document.body.scrollTop:',
                        document.body.scrollTop
                    )
                }, 0)
            } else {
                window.setTimeout(() => {
                    try {
                        // 展开列表滚动到可视区域 scrollIntoViewIfNeed/scrollIntoView
                        const cellListElement = this.$refs[`item${date}`][0].$el
                        cellListElement.scrollIntoView({
                            block: 'start',
                            behavior: 'smooth'
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }, 300)
            }
        }
        /**
         * 获取当前展开交易日
         * @param id
         * @returns {*}
         */
        // getActiveDate(id) {
        //     return this.tradingDayList.find(item => {
        //         return item.id === id
        //     })
        // }
    }
}
</script>

<style scoped lang="scss">
$titleColor: #323233;
$titleColorMainland: #ebebeb;

.stub-history {
    min-height: 100%;
    transition: transform 0.6s;

    /deep/ .van-collapse-item__content {
        padding: 0;
    }

    /deep/ .list {
        padding-bottom: 0 !important;
    }

    /deep/ .list .item:last-child {
        border-bottom: 0;
    }

    /deep/ .van-cell {
        background: rgba(248, 248, 248, 1);
        color: $titleColor;
    }

    .history-item {
        &.disabled {
            /deep/ .van-cell__title {
                color: $titleColor;
            }

            /deep/ .van-icon {
                display: none;
            }
        }
    }
}

.mainland {
    background: #0b121f;

    .van-collapse {
        &:after {
            display: none;
        }
    }

    /deep/ .van-cell {
        color: $titleColorMainland;
    }

    .history-item {
        &:after {
            display: none;
        }

        /deep/ .van-cell {
            background: #0a0f19;

            &:after {
                border-bottom: 0 !important;
            }
        }

        /deep/ .van-cell__title {
            color: #ebebeb;
        }

        /deep/ .van-hairline--top::after {
            display: none;
        }

        &.disabled {
            /deep/ .van-cell__title {
                color: $titleColorMainland;
            }
        }
    }

    .no-data {
        /deep/ p {
            color: #9c9c9c;
        }
    }
}
</style>
