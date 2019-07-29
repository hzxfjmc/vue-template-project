<template lang="pug">
    .edit
        .main
            edit-card(:data="data")
            edit-form(:data="data" :curr-item="currItem" :plan-list="planList")
            .kindly
                .kindly__content(v-html="kindly")
        .button(:class="{disable: disable}" @click="submit") {{ $t('edit.confirm') }}
        // 用于设置titlebar
        img(
            v-if="isYouxinApp"
            v-show="false"
            src="../../0-images/icon-03.png"
            ref="titlebarIcon"
            @load="setTitlebarIcon"
        )
</template>

<script>
import EditCard from '../components/edit-card'
import EditForm from '../components/edit-form'
import JSBridge from '@/utils/js-bridge'
import { Toast } from 'vant'
import config from '../../0-config'
import {
    getMonthlyStockDetail,
    createMonthlyStock,
    updateMonthlyStock
} from '../../0-service/market'
export default {
    name: 'edit',
    components: {
        EditCard,
        EditForm
    },
    data() {
        return {
            isYouxinApp: JSBridge.isYouxinApp,
            planList: [],
            kindly: '',
            originData: {
                planCode: null,
                ygMoney: null,
                autoExchange: 1
            },
            data: {
                stockName: '',
                stockCode: '',
                agree: true,
                autoExchange: 1, // 1-未选中，0-选中
                leastMoney: '',
                planCode: '',
                errMoneyTips: ''
            },
            currItem: {
                deductMoneyDay: '',
                dealDay: null,
                deductDealDay: '',
                moneyType: null,
                leastMoney: null,
                leastIncMoney: null,
                name: null,
                subname: this.$t('edit.postpone')
            }
        }
    },
    computed: {
        disable() {
            return !this.data.agree || !this.data.leastMoney
        }
    },
    mounted() {
        this.init()
    },
    destroyed() {
        this.hideTitlebarIcon()
    },
    methods: {
        // 初始化
        async init() {
            try {
                const data = await getMonthlyStockDetail({
                    stockCode: this.$route.params.stockCode,
                    exchangeType: this.$route.params.exchangeType,
                    planId: this.$route.params.planId || null
                })
                this.kindly = data.warmPrompt.replace(/\n/g, '<br>')
                this.planList = data.ygStockMessageResponses
                this.data.stockName = data.stockName
                this.data.stockCode = data.stockCode
                if (data.ygStockMessageResponses.length === 0) {
                    Toast(this.$t('edit.systemError'))
                    return
                }
                const item = this.$route.params.planId
                    ? data
                    : data.ygStockMessageResponses[0]
                this.currItem.deductMoneyDay = item.deductMoneyDay
                this.currItem.dealDay = item.dealDay
                this.currItem.deductDealDay = item.deductDealDay
                this.currItem.moneyType = item.moneyType
                this.currItem.leastMoney = item.leastMoney
                this.currItem.leastIncMoney = item.leastIncMoney
                this.currItem.name = this.$t('edit.daysPerMonth', item.dealDay)
                this.data.leastMoney = item.ygMoney || ''
                this.data.planCode = item.planCode
                this.data.autoExchange = item.autoExchange === 0 ? 0 : 1
                // 验证是否修改过的数据
                this.originData.planCode = this.data.planCode
                this.originData.ygMoney = this.data.leastMoney
                this.originData.autoExchange = this.data.autoExchange
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        // 隐藏titlebar icon
        hideTitlebarIcon() {
            if (this.isYouxinApp) {
                JSBridge.callApp('command_set_titlebar_button', {
                    position: 2,
                    type: 'hide'
                })
            }
        },
        // 设置titlebar
        setTitlebarIcon() {
            window.GOTO_WIKI = () => {
                this.hideTitlebarIcon()
                location.href =
                    location.origin + '/webapp/market/generator.html?key=XY0061'
            }
            const base64 = this.$refs.titlebarIcon.src.replace(
                /^data:image\/(png|ico|jpe|jpeg|gif);base64,/,
                ''
            )
            JSBridge.callApp('command_set_titlebar_button', {
                position: 2,
                type: 'custom_icon',
                custom_icon: base64,
                clickCallback: 'GOTO_WIKI'
            })
        },
        async doSubmit() {
            try {
                const planId = this.$route.params.planId
                if (planId) {
                    // 修改月供計劃
                    await updateMonthlyStock({
                        planId,
                        planCode: this.data.planCode,
                        autoExchange: this.data.autoExchange,
                        ygMoney: this.data.leastMoney
                    })
                    this.$router.replace('/detail/' + planId)
                } else {
                    // 創建月供計劃
                    await createMonthlyStock({
                        planCode: this.data.planCode,
                        autoExchange: this.data.autoExchange,
                        ygMoney: this.data.leastMoney
                    })
                    this.$router.replace('/mine')
                }
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        async submit() {
            if (this.disable) {
                return
            }
            if (this.data.errMoneyTips) {
                Toast(this.data.errMoneyTips)
                return
            }
            // 未修改过提示
            if (this.$route.params.planId) {
                if (
                    this.originData.planCode === this.data.planCode &&
                    this.originData.ygMoney === this.data.leastMoney &&
                    this.originData.autoExchange === this.data.autoExchange
                ) {
                    Toast(this.$t('edit.noUpdate'))
                    return
                }
            }
            // 本地调试 则直接提交数据
            if (config.env === 'localhost') {
                this.doSubmit()
                return
            }
            if (!JSBridge.isYouxinApp) {
                Toast(this.$t('edit.noticeGoToApp'))
                return
            }
            const user = await JSBridge.callApp('get_user_info')
            // 未登錄
            if (!user.userToken) {
                JSBridge.callApp('command_user_login')
                return
            }
            // 未開戶,跳轉開戶引導頁
            if (!user.openedAccount) {
                this.hideTitlebarIcon()
                location.href =
                    location.origin + '/webapp/open-account-hk/apply.html#/'
                return
            }
            try {
                // 驗證交易密碼
                if (!(await this.$tradeLogin())) {
                    return
                }
                this.doSubmit()
            } catch (e) {
                Toast(this.$t('edit.passwordError'))
            }
        }
    }
}
</script>

<style lang="less" scoped>
.edit {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
}
.main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.kindly {
    margin: 40px 18px;
    color: rgba(#393939, 0.4);
}
.kindly__title {
    font-size: 16px;
}
.kindly__content {
    font-size: 12px;
    margin-bottom: 10px;
}
.button {
    font-size: 16px;
    line-height: 48px;
    height: 48px;
    text-align: center;
    color: #fff;
    background: #0055ff;
    &:active {
        background: rgba(#0055ff, 0.8);
    }
    &.disable {
        background: #c4c4c4;
    }
}
</style>
