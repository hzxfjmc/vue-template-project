<template lang="pug">
yx-container.my-commission
    van-tabs.commission-top(
        v-model="exchangeType"
        slot="top"
        :line-width='28'
    )
        van-tab(:title="$t(`hkTabText`)")
        van-tab(:title="$t(`usTabText`)" v-if="!usStockTradeClose")
    .commission-main(slot="main" v-show="exchangeType === 0")
        .current-plan()
            .current-plan__title {{$t(`curPlanTitle`)}}
            yx-plan(
                :current="true"
                :package="packageView.curUserPackageViewVO"
                :attribution="appAttributionFlag"
                :planLangFlag="enLangFlag"
                @change-plan="init"
            )
        .other-plan
            .other-plan__title {{$t(`otherPlanTitle`)}}
            yx-plan(
                v-for="p in packageView.userPackageViewVOList"
                :package="p"
                :currentSelectCode="currentSelectCode"
                :key="p.packageCode"
                :attribution="appAttributionFlag"
                :planLangFlag="enLangFlag"
                @change-plan="init"
            )
        yx-rule-hk(v-if="appAttributionFlag")
        yx-rule-h-hk(v-else)
    .commission-main(v-show="exchangeType === 1" slot="main")
        .current-plan()
            .current-plan__title {{$t(`curPlanTitle`)}}
            yx-plan(
                :current="true"
                :package="usCurUserPackageViewVO"
                :attribution="appAttributionFlag"
                :planLangFlag="enLangFlag"
            )
        yx-rule-us(v-if="appAttributionFlag")
        yx-rule-h-us(v-else)
</template>

<script>
import { Tab, Tabs } from 'vant'
import YxPlan from './plan.vue'
import YxRuleUs from './rule-us.vue'
import YxRuleHk from './rule-hk.vue'
import YxRuleHUs from './rule-h-us.vue'
import YxRuleHHk from './rule-h-hk.vue'
import { setTitle, usStockTradeClose } from '@/utils/html-utils.js'
import {
    userPackageView,
    userPackageHomeSwitchTip
} from '@/service/product-server.js'
export default {
    i18n: {
        zhCHT: {
            usTabText: `美股交易收費`,
            hkTabText: `港股交易收費`,
            curPlanTitle: `目前交易收費計劃`,
            otherPlanTitle: `其他交易收費計劃`,
            tipText: key =>
                `溫馨提示：您已選擇切換至${key}，下個交易日開始生效`,
            t2222: '免佣計劃',
            t4444: '階梯計劃',
            t6666: '免佣免平台費計劃',
            t7777: '一世免佣計劃',
            t5555: '一世免平台費計劃'
        },
        zhCHS: {
            usTabText: `美股佣金`,
            hkTabText: `港股佣金`,
            curPlanTitle: `当前佣金计划`,
            otherPlanTitle: `其他佣金计划`,
            tipText: key => `温馨提示：您已经选择切换至${key}，将在下一天生效`,
            t2222: '免佣计划',
            t4444: '阶梯计划',
            t6666: '免佣免平台费计划',
            t7777: '一世免佣计划',
            t5555: '一世免平台费计划'
        },
        en: {
            usTabText: `US Stock`,
            hkTabText: `HK Stock`,
            curPlanTitle: `Current Plan`,
            otherPlanTitle: `Other Plans`,
            tipText: key =>
                `Reminder: You've switched to ${key}, changes will be effective by the next transaction day`,
            t2222: '免佣计划',
            t4444: '阶梯计划',
            t6666: '$0 Commission and $0 Platform fee plan',
            t7777: 'Lifetime $0 commission plan',
            t5555: 'Lifetime $0 platform fee plan'
        }
    },
    name: 'home',
    data() {
        return {
            exchangeType: 0,
            packageView: {
                curUserPackageViewVO: {},
                userPackageViewVOList: []
            },
            currentSelectCode: '',
            enLangFlag: false,
            usStockTradeClose: usStockTradeClose
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        YxPlan,
        YxRuleUs,
        YxRuleHk,
        YxRuleHUs,
        YxRuleHHk
    },
    created() {
        //英文和繁体下添加类名
        this.enLangFlag =
            this.$i18n.lang === 'en' || this.$i18n.lang === 'zhCHT'
        this.init(true)
    },
    computed: {
        usCurUserPackageViewVO() {
            return {
                packageCode:
                    this.packageView.attribution === 1 ? '0000' : '1111'
            }
        },
        appAttributionFlag() {
            return this.packageView.attribution === 1
        }
    },
    methods: {
        async init(initflag) {
            try {
                initflag && this.$loading()
                // await userPackageView()
                this.packageView = await userPackageView()
                let code = await userPackageHomeSwitchTip()
                this.currentSelectCode = code
                //如果是大陆版 设置语言为简体
                if (this.packageView.attribution === 1) {
                    this.$i18n.setLang('zhCHS')
                    setTitle('我的佣金')
                }
                code &&
                    this.$bus.$emit(
                        'add-tip',
                        this.$t(`tipText`, this.$t('t' + code))
                    )
                initflag && this.$close()
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss">
.my-commission {
    .van-tabs--line .van-tabs__wrap {
        height: 40px;
    }
    .van-tabs__line {
        background-color: $hk-primary-color;
    }
    .van-tab--active {
        font-weight: normal;
        .van-ellipsis {
            color: $hk-primary-color;
        }
    }

    .van-ellipsis {
        color: $hk-text-color;
        font-family: PingFangSC-Medium;
        font-size: 16px;
    }
}
</style>

<style lang="scss" scoped>
.my-commission {
    .commission-main {
        padding: $global-padding;
        .current-plan {
            .current-plan__title {
                font-size: 20px;
                font-family: PingFangHK-Medium;
                padding: 4px 0 0;
            }
        }
        .other-plan {
            font-size: 16px;
            line-height: 22px;
            padding-top: 30px;
        }
    }
}
</style>
<style lang="scss">
.my-commission .commission-rule {
    margin-top: 20px;
    .rule__title {
        font-size: 16px;
    }
    .rule__content {
        color: $text-color;
        font-weight: 400;
        font-family: PingFangHK-Regular;
        line-height: 20px;
        p {
            line-height: 22px;
            margin-bottom: 4px;
            // margin-top: 8px;
        }
        .rule__content-h {
            margin: 20px 0 6px 0;
            font-family: PingFangSC-Medium;
            font-weight: 700;
        }
        .rule__content-h:first-child {
            margin-top: 8px;
        }
        .rule__line {
            color: $text-color;
            span {
                font-size: 14px;
                font-family: PingFangSC-Medium;
                font-weight: 700;
            }
        }
        .plan_name {
            margin: 12px 0;
        }
        .text-align-center {
            text-align: center;
        }
    }
}
</style>
