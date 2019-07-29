<template lang="pug">
    quotes-layout(:title="$t('buy.title')").quotes-buy
        .main(slot="main")
            .content-wrap
                banner-list
                .buy-wrap
                    .title {{$t('buy.buyTitle')}}
                    .content
                        span {{$t('buy.selectTime')}}
                        .selection(@click="showSelectDate = true")
                            span.count {{selectedQuote.months}}
                            span.unit 月
                            i.iconfont.icon-pulldown_icon
                    .content
                        span {{$t('buy.price')}}
                        span {{selectedQuote.amount | thousand-spilt}} HKD
            .buy-btn-wrap
                van-button.buy-btn(
                type="primary"
                size="large"
                @click="buy"
                ) {{$t('buy.buyBtn')}}
                router-link.show-buy-record(to="/buy-record") {{$t('buy.buyRecord')}}
                    img(
                    src="@/assets/img/marketing/quotes/record.svg"
                    )
            pop-selector(
            showToolbar
            :columns="quotesBuyList"
            value-key="months"
            @confirm="setDate"
            @cancel="showSelectDate = false"
            v-if="showSelectDate"
            :confirm-button-text="$t('buy.confirmBtn')"
            :cancel-button-text="$t('buy.cancelBtn')"
            )
            remind-dialog(
            v-model="showRemindBox"
            :title="remindObj.title"
            :tip="remindObj.tip"
            :showCancelButton="remindObj.showCancelButton"
            :blue-cancel="remindObj.blueCancel"
            :cancelButtonText="remindObj.cancel"
            :confirmButtonText="remindObj.confirm"
            @confirm="onConfirm"
            @cancel="onCancel"
            )
                .buy-success(v-if="isSuccess")
                    img(
                    src="@/assets/img/marketing/quotes/success.png"
                    )
                    p.status {{$t('buy.dialog.success.done')}}
                    .type {{$t('buy.dialog.success.type')}}
                    .prop
                        span.item {{$t('buy.dialog.success.time')}}：{{selectedQuote.months}}月
                        span.item {{$t('buy.dialog.success.price')}}：{{selectedQuote.amount}}HKD
                    .remind ({{$t('buy.dialog.success.remind')}})
</template>
<script>
import bannerList from '../../components/banner-list'
import popSelector from '@/components/pop-selector'
import remindDialog from '@/components/remind-dialog'
import { codeMap, buyResultCodeMap } from './map'

export default {
    components: {
        bannerList,
        popSelector,
        remindDialog
    },
    data: () => ({
        showSelectDate: false,
        showRemindBox: false,
        remindObj: {
            title: '',
            // 提示
            tip: '',
            // 确定按钮文案
            confirm: '',
            // 取消按钮文案
            cancel: '',
            // 取消按钮蓝色
            blueCancel: true,
            // 展示取消按钮
            showCancelButton: true
        },
        // 购买返回的结果代码
        buyResultCode: codeMap.SUCCESS,
        codeMap: codeMap,
        // 行情购买信息
        quotesBuyList: [],
        // 選中的行情信息
        selectedQuote: {}
    }),
    async created() {
        let data = await this.$quotesService.getQuotationPriceInfo()
        this.quotesBuyList = data || []
        this.selectedQuote = this.quotesBuyList[0] || {}
    },
    computed: {
        // 是否购买成功
        isSuccess() {
            return this.buyResultCode === codeMap.SUCCESS
        },
        user() {
            return this.$store.getters.user
        }
    },
    methods: {
        setDate(data) {
            this.selectedQuote = data
            this.showSelectDate = false
        },
        getText(key, insertValue) {
            return this.$t(
                `buy.dialog.${buyResultCodeMap[this.buyResultCode]}.${key}`,
                insertValue
            )
        },
        async buy() {
            // 判断是否开户
            if (!this.user.openedAccount) {
                this.buyResultCode = codeMap.NO_OPEN_ACCOUNT
                this.dealCode()
                return
            }
            // 判断余额是否足够
            try {
                let moneyData = await this.$quotesService.fetchCapitalHsfundaccountinfo(
                    {
                        // 港币
                        moneyType: 2
                    }
                )
                // 可取资金要大于购买金额
                let isEnoughMoney =
                    moneyData.withdrawBalance >= this.selectedQuote.amount
                if (!isEnoughMoney) {
                    this.buyResultCode = codeMap.NO_MONEY
                    this.dealCode()
                    return
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了，请稍后重试')
                return
            }
            await this.$jsBridge.callApp('command_trade_login')
            try {
                await this.$quotesService.userQuotationBuy({
                    quotationPriceId: this.selectedQuote.id
                })
                this.buyResultCode = codeMap.SUCCESS
            } catch (e) {
                // 清算中在这里判断
                if (e.code && e.code === 701010) {
                    this.buyResultCode = codeMap.COUNTING
                } else {
                    this.buyResultCode = codeMap.FAIL
                }
            } finally {
                this.dealCode()
            }
        },
        // 处理错误码
        dealCode() {
            // 购买成功，不显示取消按钮
            // if (this.isSuccess) {
            //     this.remindObj.showCancelButton = false
            // }
            // 取消按钮显示蓝色的状态
            let blueCancelBtnStatus = [
                // codeMap.INVALID_PASSWORD,
                // codeMap.ERROR_PASSWORD,
                codeMap.FAIL,
                codeMap.SUCCESS
            ]
            this.remindObj.blueCancel = blueCancelBtnStatus.includes(
                this.buyResultCode
            )
            this.remindObj.title = this.getText('title')
            this.remindObj.tip = this.getText('tip')
            this.remindObj.confirm = this.getText('confirm')
            this.remindObj.cancel = this.getText('cancel')
            this.showRemindBox = true
        },
        // 聯繫客服
        contact() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://customer_service')
        },
        onConfirm() {
            if (this.buyResultCode === codeMap.NO_OPEN_ACCOUNT) {
                // 去开户
                this.$jsBridge.gotoNativeModule('yxzq_goto://main_trade')
            } else if (this.buyResultCode === codeMap.NO_MONEY) {
                // 存入资金
                this.$jsBridge.gotoNativeModule('yxzq_goto://main_trade')
            } else if (this.buyResultCode === codeMap.SUCCESS) {
                // 查看购买记录
                this.$router.push('/buy-record')
            } else {
                // 联系客服
                this.contact()
            }
        },
        // 预留
        onCancel() {}
    }
}
</script>
<style lang="scss" scoped>
.quotes-buy {
    background-color: #f8f8f8;
    .content-wrap {
        background-color: #fff;
        padding: 14px $global-padding 0;
        .buy-wrap {
            margin-top: 30px;
            color: $hk-text-color;
            .title {
                font-size: 16px;
                padding-left: 6px;
                position: relative;
                &::before {
                    content: '';
                    width: 2px;
                    height: 15px;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: $hk-primary-color;
                }
            }
            .content {
                display: flex;
                justify-content: space-between;
                font-size: 18px;
                height: 70px;
                line-height: 70px;
                .selection {
                    width: 136px;
                    border-bottom: 1px solid rgba(57, 57, 57, 0.0765);
                    text-align: right;
                    .count {
                        font-size: 32px;
                        font-weight: bold;
                        margin-right: 4px;
                    }
                    .unit {
                        font-size: 16px;
                    }
                    i {
                        font-size: 12px;
                        margin-left: 8px;
                        color: #ebebeb;
                        line-height: 70px;
                        float: right;
                    }
                }
            }
        }
    }
    .buy-btn-wrap {
        padding: 0 $global-padding;
        text-align: center;
        .buy-btn {
            margin-top: 40px;
            border-radius: 4px;
            background-color: $hk-primary-color;
        }
        .show-buy-record {
            color: rgba($hk-text-color, 0.4);
            font-size: 14px;
            line-height: 40px;
            img {
                margin-left: 5px;
                vertical-align: middle;
                position: relative;
                bottom: 1px;
            }
        }
    }
    .buy-success {
        img {
            width: 99px;
        }
        .status {
            margin: 20px 0;
            font-size: 20px;
            color: $hk-text-color;
        }
        .type {
            color: $hk-primary-color;
            font-size: 20px;
        }
        .prop {
            margin: 6px 0 4px;
            .item {
                margin-right: 10px;
                color: #000;
            }
        }
        .remind {
            color: $hk-text-color;
            font-size: 12px;
        }
    }
}
</style>
