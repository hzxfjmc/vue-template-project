<template lang="pug">
    .index(v-if="data")
        detail-plate(:data="data")
        .section-title {{ $t('strategyIncomeTrend') }}
        detail-chart(v-if="trend" :data="trend")
        detail-stocks(:data="data")
        .detail-tips {{ $t('riskWarning') }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import DetailPlate from '../components/detail-plate'
import DetailChart from '../components/detail-chart'
import DetailStocks from '../components/detail-stocks'
import {
    getLongStrategyDetail,
    getLongStrategyTrend,
    strategySubscribe
} from '../../0-service/market'
import { Toast } from 'vant'
import { getUrlParam, throttle } from '../../0-utils'
export default {
    name: 'index',
    components: {
        DetailPlate,
        DetailChart,
        DetailStocks
    },
    data() {
        return {
            data: null,
            trend: null,
            timing: null,
            user_auth: 0, // 0-未登录，1-已登录，2-已开户
            hkQuoteLevel: 1 // 港股行情权限：0-延时、1-BMP、3-level2
        }
    },
    mounted() {
        this.getTrend()
    },
    async activated() {
        this.registerFn()
        await this.getUserAuth()
        this.getDetail(true)
    },
    deactivated() {
        clearTimeout(this.timing)
    },
    methods: {
        // 获取用户权限
        async getUserAuth() {
            if (!JSBridge.isYouxinApp) {
                return
            }
            const user = await JSBridge.callApp('get_user_info')
            console.log('=====get_user_info', user)
            if (user.hkQuoteLevel !== undefined) {
                this.hkQuoteLevel = user.hkQuoteLevel
            }
            if (!user.userToken) {
                this.user_auth = 0
                return
            }
            if (!user.openedAccount) {
                this.user_auth = 1
                return
            }
            this.user_auth = 2
        },
        // 设置titlebar
        setTitlebar(status) {
            if (JSBridge.isYouxinApp) {
                JSBridge.callApp('command_set_titlebar_button', {
                    position: 2,
                    type: 'text',
                    text:
                        status === 0
                            ? this.$t('subscribe')
                            : this.$t('subscribed'),
                    clickCallback:
                        status === 0 ? 'subscribe' : 'cancelSubscribe'
                })
            }
        },
        // 注册app调用的方法
        registerFn() {
            if (JSBridge.isYouxinApp) {
                // 注册订阅方法
                JSBridge.registerFn(
                    'subscribe',
                    throttle(async () => {
                        // 埋点
                        this.$buryingPoint({
                            view_name: '订阅',
                            info_source: this.$root.strategy_name,
                            stock_id: ''
                        })
                        try {
                            // 提示信息
                            const options = {
                                confirmButtonText: this.$t('gotoUnlock'),
                                cancelButtonText: this.$t('cancel')
                            }
                            // 未登录处理
                            const unLoginHandler = async () => {
                                try {
                                    options.message = this.$t('pleaseLogin')
                                    await this.$dialog.confirm(options)
                                    await JSBridge.callApp('command_user_login')
                                    location.reload()
                                } catch (e) {} // eslint-disable-line
                            }
                            // 无权限
                            if (this.data.auth.is_auth === 0) {
                                // 需要登錄
                                if (this.data.auth.strategy_group === 1) {
                                    await unLoginHandler()
                                    return
                                }
                                // 需要开户
                                if (this.data.auth.strategy_group === 2) {
                                    try {
                                        options.message = this.$t(
                                            'pleaseOpenAccount'
                                        )
                                        await this.$dialog.confirm(options)
                                        JSBridge.gotoNativeModule(
                                            'yxzq_goto://main_trade'
                                        )
                                    } catch (e) {} // eslint-disable-line
                                    return
                                }
                            } else {
                                // 有权限 也需要验证登录
                                if (this.user_auth === 0) {
                                    await unLoginHandler()
                                    return
                                }
                            }
                            // 订阅
                            await strategySubscribe({
                                strategy_id: parseInt(getUrlParam('id')),
                                strategy_version: parseInt(
                                    getUrlParam('version')
                                ),
                                subscribe: 1,
                                user_auth: this.user_auth
                            })
                            this.setTitlebar(1)
                            Toast(this.data.subscribe.success_tips)
                        } catch (e) {
                            Toast(e.msg || this.$t('errorTips'))
                        }
                    }, 1000)
                )
                // 注册取消订阅方法
                JSBridge.registerFn(
                    'cancelSubscribe',
                    throttle(async () => {
                        // 埋点
                        this.$buryingPoint({
                            view_name: '已订阅',
                            info_source: this.$root.strategy_name,
                            stock_id: ''
                        })
                        try {
                            await strategySubscribe({
                                strategy_id: parseInt(getUrlParam('id')),
                                strategy_version: parseInt(
                                    getUrlParam('version')
                                ),
                                subscribe: 0
                            })
                            this.setTitlebar(0)
                            Toast(this.data.subscribe.cancel_tips)
                        } catch (e) {
                            Toast(e.msg || this.$t('errorTips'))
                        }
                    }, 1000)
                )
            }
        },
        // 获取数据聚合接口
        async getDetail(showLoading) {
            try {
                this.data = await getLongStrategyDetail(
                    {
                        strategy_id: parseInt(getUrlParam('id')),
                        strategy_version: parseInt(getUrlParam('version')),
                        user_auth: this.user_auth
                    },
                    {
                        _no_loading: !showLoading
                    }
                )
                this.$root.strategy_name = this.data.strategy_name
                this.setTitlebar(this.data.subscribe.status)
                // 不是港股BMP权限则轮询
                const hasHkStock =
                    this.data.stocks &&
                    this.data.stocks.some(
                        item => item.secu_code.slice(0, 2) === 'hk'
                    )
                if (this.hkQuoteLevel !== 1 || !hasHkStock) {
                    clearTimeout(this.timing)
                    this.timing = setTimeout(this.getDetail, 10000)
                }
            } catch (e) {
                Toast(e.msg || this.$t('errorTips'))
            }
        },
        // 获取趋势图
        async getTrend() {
            try {
                this.trend = await getLongStrategyTrend({
                    strategy_id: getUrlParam('id'),
                    strategy_version: getUrlParam('version')
                })
            } catch (e) {
                Toast(e.msg || this.$t('errorTips'))
            }
        }
    }
}
</script>

<style lang="less" scoped>
.index {
    background: #fff;
    padding: 1px 0 77px;
}

.detail-tips {
    margin: 0 18px;
    font-size: 12px;
    color: rgba(#393939, 0.4);
}
</style>
<style lang="less">
.section-title {
    position: relative;
    padding: 0 18px;
    margin-bottom: 14px;
    font-size: 20px;
    color: #393939;
    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: #393939;
    }
}
/*大陆版*/
.is-mainland {
    .index {
        background: #0b121f;
    }
    .section-title {
        color: #ebebeb;
        &:before {
            background: transparent;
        }
    }
    .detail-tips {
        color: rgba(#ebebeb, 0.4);
    }
}
</style>
