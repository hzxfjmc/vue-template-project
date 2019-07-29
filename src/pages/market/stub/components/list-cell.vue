<template lang="pug">
    .list-cell(:class="{mainland: isMainland}")
        // 无数据展示
        .none(v-if="!history && !hasList && !loading")
            img(:src="none.img")
            .text {{none.text}}

        // 股票列表加载状态
        van-loading(v-if="loading")

        // 有数据列表展示
        .list(v-if="hasList && !loading")
            van-row.title
                // 名称代码
                van-col(span="7") {{i18n.nameCode}}
                // 入选价
                van-col(span="5") {{i18n.beginPrice}}
                // 涨幅
                van-col(span="5") {{i18n.increase}}
                // 止盈/止损
                van-col(span="7") {{i18n.suggest}}/{{i18n.loss}}

            van-row.item(v-for="(item, index) in list" :key="index" @click.native="gotoDetail(item)")
                // 名称代码
                van-col(span="7")
                    .name.overflow-ellipsis {{item.name}}
                    .code {{item.market_code}}
                // 入选价
                van-col(span="5")
                    // 已开盘
                    span.font16(v-if="validBought(item.price)") {{item.price | formatBought}}
                    // 未开盘
                    span(v-else v-html="invalidBoughtTemplate(item.price)")
                // 涨幅
                van-col.font16(span="5")
                    span(:class="getStockColor(item.rise)") {{item.rise | formatPercent}}
                    // 止盈标记
                    span.tag(v-if="item.stopProfit === 1" :class="stopColor") {{i18n.stopProfit}}
                    // 止损标记
                    span.tag(v-if="item.stopProfit === 2" :class="lossColor") {{i18n.lossProfit}}
                // 止盈/止损
                van-col(span="7")
                    .normal {{item.suggest | stopPrice}}
                    .max {{item.loss | stopPrice}}
</template>

<script>
import { Row, Col, Loading } from 'vant'
import mixins from '../mixins'
import dayjs from 'dayjs'

// 股票列表
export default {
    name: 'list-cell',
    mixins: [mixins],
    props: {
        // 是否在历史纪录界面展示
        history: Boolean,
        // 股票列表
        list: {
            type: Array,
            default() {
                return []
            }
        },
        // 开盘日期
        date: {
            type: String,
            default: ''
        },
        // 股票列表数据空提示文案
        nullTip: {
            type: String,
            default: ''
        },
        // 股票列表数据加载状态
        loading: {
            type: Boolean,
            default: true
        },
        // 策略名称
        strategyName: {
            type: String,
            default: ''
        },
        // 策略id
        strategyId: {
            type: [String, Number],
            default: ''
        }
    },
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Loading.name]: Loading
    },
    computed: {
        // 是否有列表数据
        hasList() {
            return Boolean(this.list.length)
        },
        // 多语言
        i18n() {
            return this.$t('listCell')
        },
        // 英文
        isEn() {
            return this.$ua.isEn
        },
        // 止盈颜色
        stopColor() {
            return {
                red: this.$ua.isRedRiseGreenDrop,
                green: this.$ua.isGreenRiseRedDrop
            }
        },
        // 止损颜色
        lossColor() {
            return {
                red: this.$ua.isGreenRiseRedDrop,
                green: this.$ua.isRedRiseGreenDrop
            }
        },
        // 大陆版
        isMainland() {
            return this.$ua.isMainland
        },
        // 无股票时显示的内容
        none() {
            return {
                img: require(`../img/none${this.isMainland ? 1 : ''}@2x.png`),
                text: this.nullTip || this.i18n.noStock
            }
        }
    },
    methods: {
        /**
         * 跳转到个股详情页面
         * @param market 股票市场
         * @param market_code 股票代码
         * @param delisting  是否已退市，0未退市，1已退市
         */
        gotoDetail({ market, market_code, delisting }) {
            // 历史记录已退市不可跳详情
            if (this.history && delisting === 1) return

            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://stock_quote?market=${market}&code=${market_code}`
            )

            this.$stockBuriedPoint({
                prop_view_page: this.history ? '历史记录' : '策略详情',
                prop_view_name: '个别股票',
                prop_info_source: this.strategyName,
                prop_stock_id: market_code,
                prop_info_id: this.strategyId
            })
        },
        /**
         * 格式化日期
         * @param date
         * @param format
         * @returns {string}
         */
        formatDate(date, format = 'MM-DD') {
            let result = ''

            try {
                result = date ? dayjs(date).format(format) : ''
            } catch (e) {
                console.log('formatDate:', e)
                result = ''
            }

            return result
        },
        /**
         * 无效入选价展示模板
         * @returns {string}
         */
        invalidBoughtTemplate(price) {
            let template = '--'

            // 1.入选价返回空，date为空， 显示“--”
            // --- 2.入选价返回空，date有值， 显示“x月x日入选价”---
            // 3.入选价有值，显示入选价即可
            if (this.date && price === '') {
                template = `${this.formatDate(this.date, 'MM月DD日')}<br/>${
                    this.i18n.openPrice
                }`
            }

            return template
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../0-style/variate';
.list-cell {
    .none {
        padding-bottom: 100px;
        text-align: center;

        img {
            width: 120px;
            height: 130px;
        }

        .text {
            margin-top: 14px;
            color: #9c9c9c;
        }
    }

    .van-loading {
        background-color: transparent;
        margin: 50px auto;
    }

    .list {
        padding: 20px 18px;

        .van-col:nth-child(2) {
            text-align: center;
        }

        .van-col:nth-child(3),
        .van-col:nth-child(4) {
            text-align: right;
        }

        .title {
            font-size: 12px;
            font-weight: 400;
            color: #b0b0b0;
            line-height: 17px;
        }

        .item {
            position: relative;
            padding: 14px 0;
            border-bottom: 1px solid #f4f4f4;
            cursor: pointer;

            .name {
                font-size: 16px;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
                line-height: 22px;
            }

            .code {
                font-size: 12px;
                font-weight: 400;
                color: #b0b0b0;
                line-height: 15px;
            }

            .van-col {
                height: 42px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }

            .font16 {
                font-size: 16px;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
                line-height: 21px;
            }

            .van-col:nth-child(2) {
                font-size: 14px;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
                line-height: 18px;
            }

            .van-col:nth-child(3) {
                align-items: flex-end;
                .tag {
                    display: inline-block;
                    /*width: 34px;*/
                    height: 18px;
                    padding: 0 3px;
                    line-height: 18px;
                    border-radius: 2px;
                    /*border: 1px solid rgba(250, 115, 115, 1);*/
                    text-align: center;
                    font-size: 12px;
                    font-weight: 400;
                    transform: scale(0.83);
                    /*color: rgba(250, 115, 115, 1);*/

                    &.green {
                        color: $hk-green;
                        border: 1px solid $hk-green;
                    }

                    &.red {
                        color: $hk-red;
                        border: 1px solid $hk-red;
                    }
                }
            }

            .van-col:nth-child(4) {
                font-size: 16px;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
                line-height: 21px;
            }

            .green {
                color: $hk-green;
            }

            .red {
                color: $hk-red;
            }
        }
    }
}

.mainland {
    .list {
        .title {
            color: #58687f;
        }

        .item {
            border-bottom: 0;

            .name {
                color: #ebebeb;
            }

            .code {
                color: rgba(235, 235, 235, 0.4);
            }

            .van-col:nth-child(2),
            .van-col:nth-child(3),
            .font16 {
                color: #ebebeb;
            }

            .van-col:nth-child(3) {
                .tag {
                    &.green {
                        color: $mainland-green;
                        border: 1px solid $mainland-green;
                    }

                    &.red {
                        color: $mainland-red;
                        border: 1px solid $mainland-red;
                    }
                }
            }

            .van-col:nth-child(4) {
                color: #ebebeb;
            }

            .green {
                color: $mainland-green;
            }

            .red {
                color: $mainland-red;
            }
        }
    }
    .none {
        .text {
            color: rgba(159, 176, 202, 1);
        }
    }
}
</style>
