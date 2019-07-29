<template lang="pug">
    .detail-stocks
        .header
            .header__title.section-title
                | {{ $t('currentStock') }}
                span ({{ $t('branch', data.stocks.length) }})
                a.header__history(href="javascript:" @click="gotoHistory")
                    | {{ $t('historyRecord') }}
                    img(v-if="$root.isHK" src="../../0-images/arrow-04.png")
                    img.arrow-mainland(v-if="$root.isMainland" src="../../0-images/arrow-06.png")
        .table
            template(v-if="data.auth.is_auth || data.stocks.length === 0")
                template(v-if="data.stocks.length > 0")
                    .table-left
                        .th {{ $t('nameAndCode') }}
                        .td(v-for="stock in data.stocks" :key="stock.secu_code" @click="gotoStock(stock)")
                            .td__name {{ stock.secu_name }}
                            .td__code {{ stock.secu_code ? stock.secu_code.slice(2) : '--' }}
                    .table-right
                        .table-right--scroll
                            .col.text-center
                                .th.font-12 {{ $t('beSelectedPrice') }}/{{ $t('newestPrice') }}
                                .td(v-for="stock in data.stocks" :key="stock.secu_code") {{ stock.sel_price || '--' }}<br>{{ stock.cur_price || '--' }}
                            .col.text-right
                                .th {{ $t('incomeRate') }}
                                .td(v-for="stock in data.stocks" :key="stock.secu_code" :class="rateClass(stock.return_rate)") {{ stock.return_rate | formatRate }}
                            .col.text-right
                                .th {{ $t('beSelectedDate') }}
                                .td.font-12(v-for="stock in data.stocks" :key="stock.secu_code") {{ stock.sel_date | formatDate }}
                .table__no-data(v-else)
                    img(src="../images/no-stock-data-hk.png" v-if="$root.isHK")
                    img(src="../images/no-stock-data-mainland.png" v-else)
                    p {{ $t('noStock') }}
            .table__no-access(v-else)
                div(@click="unlock")
                    img(src="../images/lock.png" v-if="$root.isHK")
                    img(src="../images/1-lock.png" v-else)
                    p {{ $t('unlock') }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import { Toast } from 'vant'
import dayjs from 'dayjs'

export default {
    name: 'detail-stocks',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        rateClass(rate) {
            if (typeof rate !== 'string') {
                return ''
            }
            if (parseFloat(rate) > 0) {
                return 'up'
            }
            if (parseFloat(rate) < 0) {
                return 'down'
            }
            return ''
        },
        // 解锁
        async unlock() {
            if (!JSBridge.isYouxinApp) {
                Toast(this.$t('skimInApp'))
                return
            }
            const options = {
                confirmButtonText: this.$t('gotoUnlock'),
                cancelButtonText: this.$t('cancel')
            }
            if (this.data.auth.is_auth === 0) {
                // 需要登录
                if (this.data.auth.strategy_group === 1) {
                    try {
                        options.message = this.$t('pleaseLogin')
                        await this.$dialog.confirm(options)
                        await JSBridge.callApp('command_user_login')
                        location.reload()
                    } catch (e) {} // eslint-disable-line
                    return
                }
                // 需要开户
                if (this.data.auth.strategy_group === 2) {
                    try {
                        options.message = this.$t('pleaseOpenAccount')
                        await this.$dialog.confirm(options)
                        JSBridge.gotoNativeModule('yxzq_goto://main_trade')
                    } catch (e) {} // eslint-disable-line
                }
            }
        },
        gotoHistory() {
            // 埋点
            this.$buryingPoint({
                view_name: '历史记录',
                info_source: this.data.strategy_name,
                stock_id: ''
            })
            this.$router.push(`/history/${this.data.auth.is_auth}`)
        },
        gotoStock(stock) {
            // 埋点
            this.$buryingPoint({
                view_name: '个别股票',
                info_source: this.$root.strategy_name,
                stock_id: stock.secu_code
            })
            this.$gotoStockDetail(stock)
        }
    },
    filters: {
        formatDate(date) {
            if (!date) {
                return '--'
            }
            return dayjs(date).format('YYYY-MM-DD')
        }
    }
}
</script>

<style lang="scss" scoped>
.detail-stocks {
    padding-bottom: 30px;
    margin-top: 10px;
}

.header__title {
    font-size: 20px;
    line-height: 28px;
    color: #393939;
    & span {
        color: rgba(#393939, 0.4);
        font-size: 14px;
        margin-left: 6px;
    }
}
.header__history {
    position: relative;
    float: right;
    font-size: 14px;
    color: rgba(#393939, 0.6);
    padding-right: 16px;
    img {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -2px;
        width: 10px;
        height: 6px;
        transform: rotate(-90deg);
        &.arrow-mainland {
            transform: rotate(0);
            width: 15px;
            height: 15px;
            margin-top: -7px;
        }
    }
}
.table {
    display: flex;
    white-space: nowrap;
    position: relative;
    min-height: 80px;
}
.table__no-data {
    width: 100%;
    text-align: center;
    margin-bottom: 70px;
    img {
        width: 130px;
    }
    p {
        margin-top: 14px;
        color: rgba(#393939, 0.5);
    }
}
.table__no-access {
    width: 100%;
    height: 235px;
    background-image: url(../images/blur-hk.png);
    background-size: 367px;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    img {
        width: 24px;
        margin-bottom: 8px;
    }
    p {
        font-size: 16px;
    }
}
.table-left {
    width: 100px;
    margin-left: 18px;
}
.text-center {
    vertical-align: top;
    .td {
        text-align: center;
    }
}
.table-right {
    flex: 1;
    position: relative;
    overflow-y: hidden;
    &--scroll {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        white-space: nowrap;
        padding-bottom: 10px;
        box-sizing: content-box;
        display: flex;
        justify-content: space-between;
    }
}
.col {
    display: inline-block;
    text-align: right;
    flex: 1;
    .th,
    .td {
        padding-right: 14px;
        @media (max-width: 374px) {
            padding-right: 12px;
        }
    }
}
.th,
.td {
    border-bottom: 1px solid rgba(#393939, 0.05);
    &.font-12 {
        @media (max-width: 374px) {
            font-size: 12px;
        }
    }
}
.th {
    color: rgba(#393939, 0.6);
    height: 46px;
    line-height: 22px;
    padding: 12px 0;
}
.td {
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 60px;
    font-size: 14px;
    color: #393939;
}
.td__name,
.td__code {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.td__code {
    color: rgba(#393939, 0.5);
}
/*大陆版*/
.is-mainland {
    .detail-stocks {
        &:before {
            content: '';
            display: block;
            height: 10px;
            background: #0a0f19;
        }
    }
    .header__title {
        padding-top: 10px;
        color: #ebebeb;
        & span {
            color: #9fb0ca;
        }
    }
    .header__history {
        color: #9fb0ca;
    }
    .th {
        color: #58687f;
    }
    .td {
        color: #ebebeb;
    }
    .td__code {
        color: rgba(#ebebeb, 0.4);
    }
    .table__no-data {
        p {
            color: rgba(#9fb0ca, 0.6);
        }
    }
    .table__no-access {
        background-image: url(../images/blur-mainland.png);
        color: #fff;
    }
}
</style>
