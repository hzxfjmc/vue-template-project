<template lang="pug">
    .stub-detail(:class="{ mainland: isMainland }" v-show="!loadingDetail")
        // 数据加载失败显示
        no-data(v-if="loadError" text="")

        // 策略介绍
        van-panel(v-if="!loadError" @click.native="goto()")
            .header(slot="header")
                van-row(type="flex" justify="space-between")
                    van-col.title(:span="$ua.isEn ? 8 : 12") {{name}}
                    van-col.cycle(:span="$ua.isEn ? 16 : 12") {{i18n.period(period)}}
            .tag
                van-tag(v-for="(item, index) in label" :key="index" plain color="#fff") {{item}}
            .desc(:class="{ arrow: introductionUrl }") {{desc}}

        // 策略评测
        .evaluate(v-if="!loadError")
            header-cell(:title="i18n.evaluate")
                img.icon.right(:src="evaluateIcon" @click="seeEvaluateDescribe")
            van-row.detail(gutter="10")
                van-col(span="8")
                    .title {{i18n.averageIncrease}}
                    .value(:class="getStockColor(averageIncrease)") {{averageIncrease | formatPercent}}
                van-col(span="8")
                    .title {{i18n.annual}}
                    .value(:class="getStockColor(annual)") {{annual | formatPercent}}
                van-col(span="8")
                    .title {{i18n.winRate}}
                    .value(:class="getStockColor(winRate)") {{winRate | formatPercentPositive}}

        // 拆分条
        .recommend-slit

        // 最新推荐
        .recommend(v-if="!loadError")
            header-cell(:title="i18n.recommend")
                span.right(@click="gotoHistory()")
                    | {{i18n.history}}
                    img(:src="recommendIcon")

            .content.relative
                // 锁
                .lock.child-hv-center(
                    v-if="!hasAuth"
                    :style="{ 'background-image': `url(${lock.bg})` }"
                    @click="unlock()"
                )
                    img(:src="lock.img")
                    .text {{i18n.unlock}}

                // 推荐列表
                list-cell(
                    v-else
                    :list="stockList"
                    :loading="false"
                    :date="recommendDate"
                    :null-tip="nullTip"
                    :strategy-id="$route.params.id"
                    :strategy-name="name"
                )

            .desc(v-if="hasAuth") {{i18n.getDescribe(formatThreshold(threshold))}}

            // 风险提示
            .tip {{i18n.tip}}

        // 策略评测说明对话框
        van-dialog(
            v-if="!loadError"
            v-model="showEvaluateDesc"
            :close-on-click-overlay="true"
            :confirmButtonText="i18n.confirm"
        )
            p(v-for="(item, index) in i18n.evaluate_desc" :key="index") {{index + 1}}、{{item}}
</template>

<script>
import { Panel, Row, Col, Tag, Icon, NavBar, Toast } from 'vant'
import HeaderCell from '../components/header-cell'
import ListCell from '../components/list-cell'
import mixins from '../mixins'
import stockAuthMixins from '@market-mixins/stock-auth'
import stockPollMixins from '@market-mixins/stock-poll'
import NoData from '@market-components/no-data'
import { getStubDetail, strategySubscribe } from '@market-service/market'
import { throttle } from '@market-utils'

export default {
    name: 'detail',
    components: {
        [Panel.name]: Panel,
        [Row.name]: Row,
        [Col.name]: Col,
        [Tag.name]: Tag,
        [Icon.name]: Icon,
        [NavBar.name]: NavBar,
        'header-cell': HeaderCell,
        'list-cell': ListCell,
        NoData
    },
    mixins: [mixins, stockAuthMixins, stockPollMixins],
    data() {
        return {
            loadError: false, // 页面数据加载出错
            loadingDetail: true, // 正在加载详情

            showEvaluateDesc: false, // 控制策略评测对话框

            name: '', // 策略名称
            label: [], // 策略标签
            desc: '', // 策略说明
            period: 0, // 最有持股周期
            introductionUrl: '', // 介绍页地址

            averageMaxIncrease: 0, // 平均最高涨幅
            averageIncrease: 0, // 平均涨幅
            annual: 0, // 年化
            winRate: 0, // 胜率

            threshold: 0, // 高开阀值

            stockList: [], // 最新推荐列表
            recommendDate: '', // 推荐时间
            nullTip: '', // 没有股票时提示

            subscribe: {
                status: 0, // 是否已订阅该策略 0-未订阅 1-已订阅
                tips: '', // 点击订阅按钮提示信息
                cancelTips: '' // 点击取消订阅按钮提示信息
            } // 订阅相关
        }
    },
    computed: {
        // 多語言
        i18n() {
            return this.$t('detail')
        },
        // 是否是大陆版
        isMainland() {
            return this.$ua.isMainland
        },
        // 策略评测icon
        evaluateIcon() {
            return require(`../img/about${
                this.isMainland ? '-mainland' : ''
            }@2x.png`)
        },
        // 最新推荐icon
        recommendIcon() {
            return require(`../../0-images/arrow-0${
                this.isMainland ? 2 : 4
            }.png`)
        },
        // 锁相关图
        lock() {
            return {
                bg: require(`../img/blur-${
                    this.isMainland ? 'mainland' : 'hk'
                }.png`),
                img: require(`../img/lock${this.isMainland ? '1' : ''}@2x.png`)
            }
        }
    },
    activated() {
        this.$html.setTitle(this.$t('detail.title'))
        this.getStockDetail()
    },
    deactivated() {
        this.clearTitleBar()
    },
    destroyed() {
        this.clearTitleBar()
    },
    methods: {
        /**
         * 跳转到历史记录页面
         */
        gotoHistory() {
            const { id, version } = this.$route.params
            this.$router.push(`/history/${id}/${version}/${this.name}`)

            this.$stockBuriedPoint({
                prop_view_page: '策略详情',
                prop_view_name: '历史记录',
                prop_info_source: this.name,
                prop_stock_id: '',
                prop_info_id: this.$route.params.id
            })
        },
        /**
         * 获取短线策略详情
         * @returns {Promise<void>}
         */
        async getStockDetail() {
            try {
                const { id, version } = this.$route.params
                const user_auth = await this.getUserAuth()
                this.loadError = false
                const data = await getStubDetail({
                    strategy_id: +id,
                    strategy_version: +version,
                    user_auth
                })
                this.loadingDetail = false

                // this.name =
                //     data.strategy_name && data.strategy_name.length > 8
                //         ? data.strategy_name.slice(0, 8)
                //         : data.strategy_name
                this.name = data.strategy_name
                this.label = data.strategy_tags
                    ? data.strategy_tags.split(',')
                    : []
                this.desc = data.strategy_instruction
                this.period = data.hold_days || 0
                this.introductionUrl = data.introduction_url

                // this.averageMaxIncrease = data.average_hincr_rate
                this.averageIncrease = data.average_incr_rate // 平均涨幅
                this.annual = data.average_incrav_rate // 平均涨幅年化
                this.winRate = data.win_rate // 胜率

                this.threshold = data.high_threshold

                let hasHk = false // 有港股
                // 最新推荐股票列表数据
                this.stockList = (data.stocks || []).map(item => {
                    const market = item.secu_code.slice(0, 2)
                    const market_code = item.secu_code.slice(2)
                    if (!hasHk && market === 'hk') hasHk = true
                    return {
                        delisting: +item.delisting, // 是否已退市，0未退市，1已退市
                        name: item.secu_name, // 股票名称
                        code: item.secu_code, // 股票代码
                        market,
                        market_code,
                        price: item.sel_price, // 入选价
                        suggest: item.stop_profit_price, // 止盈
                        loss: item.stop_loss_price, // 止损
                        rise: item.inc_rate, // 涨幅
                        riseMax: item.hinc_rate, // 最高涨幅
                        stopProfit: +item.stop_status // 止盈状态：0既不止盈也不止损；1止盈；2止损
                    }
                })
                this.recommendDate = data.recommend_date // 推荐时间
                this.nullTip = data.norecommend_tips // 没有股票时的提示

                // 权限相关
                if (data.auth) this.authAdapter(data.auth)

                this.subscribe.status = data.subscribe.status // 是否已订阅 0-未订阅  1-已订阅
                this.subscribe.tips = data.subscribe.success_tips
                this.subscribe.cancelTips = data.subscribe.cancel_tips

                this.setTitleBar()

                // 定时更新(有股票并且没有港股)
                this.timeoutPollStock(this.getStockDetail, hasHk)

                return data
                // eslint-disable-next-line no-empty
            } catch (e) {
                this.loadingDetail = false
                this.loadError = true
                console.log('获取短线股王详情失败：', e)
            }
        },
        /**
         * 訂閱處理回調
         */
        async subscribeHandler() {
            const { status } = this.subscribe // 0-未订阅 1-已订阅

            try {
                const { id, version } = this.$route.params
                const user_auth = await this.getUserAuth()

                await strategySubscribe({
                    strategy_id: +id,
                    strategy_version: +version,
                    subscribe: +!+status,
                    user_auth
                })

                this.subscribe.status = +!+status
                Toast(
                    this.subscribe.status
                        ? this.subscribe.tips
                        : this.subscribe.cancelTips
                )
                this.setTitleBar()

                this.$stockBuriedPoint({
                    prop_view_page: '策略详情',
                    prop_view_name: +status ? '已订阅' : '订阅',
                    prop_info_source: this.name,
                    prop_stock_id: '',
                    prop_info_id: this.$route.params.id
                })
                // eslint-disable-next-line no-empty
            } catch (e) {
                Toast(e && e.msg ? e.msg : '訂閱操作失敗')
            }
        },
        /**
         * 设置头部订阅按钮
         */
        setTitleBar() {
            try {
                if (!this.$jsBridge.isYouxinApp) return
                this.$jsBridge.registerFn(
                    'strategySubscribeHandler',
                    throttle(() => {
                        if (!this.hasAuth) {
                            this.unlock()
                        } else {
                            this.subscribeAuth(() => {
                                this.subscribeHandler()
                            })
                        }
                    }, 1000)
                )

                this.$jsBridge.callApp('command_set_titlebar_button', {
                    type: 'text',
                    position: 2,
                    text: +this.subscribe.status
                        ? this.i18n.sub_text_cancel
                        : `+${this.i18n.sub_text}`,
                    clickCallback: 'strategySubscribeHandler'
                })
            } catch (e) {
                console.log('setTitleBar:请在客户端中打开')
            }
        },
        /**
         * 打开介绍页面
         */
        goto() {
            if (this.introductionUrl && this.$jsBridge.isYouxinApp) {
                this.$jsBridge.gotoNewWebview(this.introductionUrl)
            } else if (this.introductionUrl) {
                window.open(this.introductionUrl)
            }
        },
        /**
         * 清除头部右侧按钮
         */
        clearTitleBar() {
            if (!this.$jsBridge.isYouxinApp) return

            this.$jsBridge.unregisterFn('strategySubscribeHandler')
            this.$jsBridge.callApp('command_set_titlebar_button', {
                type: 'hide',
                position: 2,
                text: '',
                clickCallback: ''
            })
        },
        /**
         * 查看策略评测想起
         */
        seeEvaluateDescribe() {
            this.showEvaluateDesc = true

            this.$stockBuriedPoint({
                prop_view_page: '策略详情',
                prop_view_name: '符号',
                prop_info_source: this.name,
                prop_stock_id: '',
                prop_info_id: this.$route.params.id
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../0-style/variate';
.stub-detail {
    min-height: 100%;
    padding: 14px 0 61px;
    background-color: white;

    .van-panel {
        margin: 0 18px;
        padding: 16px 14px 20px;
        background: #6e9dff;
        box-shadow: 0 3px 6px 0 rgba(156, 187, 229, 0.5);
        border-radius: 10px;
        color: rgba(255, 255, 255, 1);

        .header {
            margin-bottom: 6px;

            .title {
                font-size: 18px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
            }

            .cycle {
                font-size: 14px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                text-align: right;
            }
        }

        .tag {
            margin-bottom: 18px;

            .van-tag {
                font-size: 12px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                margin-right: 6px;
            }
        }

        .desc {
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 17px;

            &.arrow {
                position: relative;
                padding-right: 20px;
                &:after {
                    content: '';
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    background-image: url(../../0-images/arrow-05.png);
                    background-size: 15px;
                    background-repeat: no-repeat;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    margin-top: 1px;
                }
            }
        }
    }

    .evaluate {
        margin-top: 20px;

        .header-cell {
            margin-bottom: 14px;

            .icon {
                width: 15px;
                height: 15px;
            }
        }

        .detail {
            margin-right: 18px !important;
            margin-left: 18px !important;

            .van-col:nth-child(2) {
                text-align: center;
            }

            .van-col:nth-child(3) {
                text-align: right;
            }

            .title {
                margin-bottom: 5px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
                line-height: 17px;
            }

            .value {
                font-size: 18px;
                font-weight: 500;
                color: rgba(57, 57, 57, 1);
                line-height: 23px;

                &.green {
                    color: $hk-green;
                }

                &.red {
                    color: $hk-red;
                }
            }
        }
    }

    .recommend-slit {
        height: 20px;
    }

    .recommend {
        margin-top: 2px;

        .header-cell {
            .right {
                padding-right: 16px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(57, 57, 57, 0.6);

                img {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -3px;
                    width: 10px;
                    height: 6px;
                    transform: rotate(-90deg);
                }
            }
        }

        .lock {
            height: 235px;
            background-size: 367px;
            background-position: center;
            z-index: 1;
            text-align: center;
            cursor: pointer;

            img {
                width: 24px;
                height: 29px;
            }

            .text {
                margin-top: 8px;
                color: rgba(57, 57, 57, 1);
            }
        }

        .desc {
            margin: 0 18px 3px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 17px;
        }

        .tip {
            margin: 0 18px;
            font-size: 12px;
            font-weight: 400;
            color: #b0b0b0;
            line-height: 17px;
        }
    }

    .van-dialog {
        /deep/ .van-dialog__content {
            padding: 20px;
        }

        p {
            margin: 14px 0;
            font-size: 14px;
            font-weight: 400;
            color: #393939;
        }
    }
}

/*大陆版*/
.mainland {
    background: #0b121f;

    .van-panel {
        margin: 0 12px;
        box-shadow: none;
        background: #2f79ff;

        .desc {
            color: rgba(255, 255, 255, 0.6);
        }
    }

    /deep/ .van-hairline--top-bottom:after {
        border-width: 0;
    }

    /deep/ .van-hairline--surround::after {
        border-color: rgba(255, 255, 255, 0.2);
    }

    .evaluate {
        .detail {
            margin-right: 12px !important;
            margin-left: 12px !important;

            .van-col {
                padding-left: 0 !important;
                padding-right: 0 !important;
            }

            .title {
                color: #9fb0ca;
                font-size: 12px;
            }

            .value {
                color: #e72653;

                &.green {
                    color: $mainland-green;
                }

                &.red {
                    color: $mainland-red;
                }
            }
        }
    }

    .recommend-slit {
        height: 10px;
        margin-top: 10px;
        background-color: #0a0f19;
    }

    .recommend {
        .header-cell {
            .right {
                color: #9fb0ca;
                font-size: 12px;
            }
        }

        .desc {
            color: rgba(235, 235, 235, 0.8);
        }

        .tip {
            color: rgba(235, 235, 235, 0.39);
        }

        .lock {
            .text {
                color: rgba(235, 235, 235, 1);
            }
        }
    }
}
</style>
