<template lang="pug">
    .edit-form
        // 月供金额
        .field
            .field__label {{ $t('common.monthlyMoney') }}
            .field__label-wrap
                input.field__input(
                    v-model="data.leastMoney"
                    type="tel"
                    :placeholder="placeholder"
                    maxlength="8"
                    @input="formatMoneyNumberByComma"
                    @blur="validateMoneyNumber"
                )
                span {{ moneyUnit }}
        // 是否自动换汇
        .field-supply
            p(@click="data.autoExchange = data.autoExchange === 1 ? 0 : 1")
                img.icon(src="../images/monthly-02b.png" v-if="data.autoExchange === 0")
                img.icon(src="../images/monthly-02.png" v-else)
                | {{ $t('edit.notEnough') }}
            img.flag(src="../images/monthly-01.png" @click="showTranser = true")
        // 扣款日
        .field
            .field__label {{ $t('edit.withholdDay') }}
            .field__select(v-if="currItem" @click="showActionHandler" :class="{'has-more': list.length > 1}")
                | {{ currItem.name }}
                span ({{ currItem.subname }})
        // 交易日
        template(v-if="currItem")
            .trade-date__title
                span {{ $t('edit.tradeDay') }}
                span {{ $t('edit.closeTo') }}
            trade-date(:deduct-money-day="currItem.deductMoneyDay" :deduct-deal-day="currItem.deductDealDay")
        // 协议
        .agreement
            p(@click="data.agree = !data.agree")
                img.icon(src="../images/monthly-02b.png" v-if="data.agree")
                img.icon(src="../images/monthly-02.png" v-else)
                | {{ $t('edit.agree') }}
            a(href="javascript:" @click="gotoAgreement") {{ $t('edit.agreement') }}

        // 彈出框
        edit-form-actionsheet(
            v-model="showAction"
            :list="list"
            :title="$t('edit.withholdDay')"
            @select="actionHandler"
        )

        // 换汇提示
        van-dialog(v-model="showTranser" :title="$t('common.autoSwap')" :confirm-button-text="$t('edit.confirm')")
            .transfer
                p.main-text {{ $t('edit.autoSwap_2') }}
                p.sub-text {{ $t('edit.autoSwap_3') }}
</template>

<script>
import EditFormActionsheet from './edit-form-actionsheet'
import TradeDate from './trade-date'
import JSBridge from '@/utils/js-bridge'
export default {
    name: 'edit-form',
    components: {
        EditFormActionsheet,
        TradeDate
    },
    data() {
        return {
            showTranser: false,
            showAction: false
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        currItem: {
            type: Object
        },
        planList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        list() {
            return this.planList.map(item => {
                item.name = this.$t('edit.daysPerMonth', item.dealDay)
                item.subname = this.$t('edit.postpone')
                return item
            })
        },
        moneyUnit() {
            if (this.currItem) {
                const map = new Map([
                    [0, this.$t('other.yuan')],
                    [1, this.$t('other.dollar')],
                    [2, this.$t('common.hkDollar')]
                ])
                return map.get(this.currItem.moneyType) || ''
            } else {
                return ''
            }
        },
        placeholder() {
            const start = this.currItem.leastMoney + this.moneyUnit
            const step = this.currItem.leastIncMoney + this.moneyUnit
            if (!this.currItem) {
                return ''
            }
            return this.$t('edit.placehold', start, step)
        }
    },
    methods: {
        gotoAgreement() {
            const url =
                location.origin + '/webapp/market/generator.html?key=AGR0111'
            if (JSBridge.isYouxinApp) {
                JSBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        // 格式化輸入數字
        formatMoneyNumberByComma() {
            const reg = /^[0-9]&/
            if (!reg.test(this.data.leastMoney)) {
                this.data.leastMoney = this.data.leastMoney.replace(
                    /[^0-9]/,
                    ''
                )
            }
            if (/^0/.test(this.money)) {
                this.data.leastMoney = this.data.leastMoney.replace(/^0/, '')
            }
        },
        // 校驗輸入數字
        validateMoneyNumber() {
            window.scrollTo(0, 0)
            if (!this.data.leastMoney) {
                return
            }
            // 提示信息
            const msg = this.$t('common.monthlyMoney') + this.placeholder
            // 驗證最少金額
            const money = parseInt(this.data.leastMoney)
            if (money < this.currItem.leastMoney) {
                this.data.errMoneyTips = msg
                return
            }
            // 驗證遞增金額
            const isRightInc =
                (money - this.currItem.leastMoney) %
                    this.currItem.leastIncMoney ===
                0
            if (!isRightInc) {
                this.data.errMoneyTips = msg
                return
            }
            this.data.errMoneyTips = ''
        },
        // 選擇action列表
        actionHandler(item) {
            this.currItem.deductMoneyDay = item.deductMoneyDay
            this.currItem.dealDay = item.dealDay
            this.currItem.deductDealDay = item.deductDealDay
            this.currItem.moneyType = item.moneyType
            this.currItem.leastMoney = item.leastMoney
            this.currItem.leastIncMoney = item.leastIncMoney
            this.currItem.name = this.$t('edit.daysPerMonth', item.dealDay)
            this.data.planCode = item.planCode
            this.showAction = false
            this.validateMoneyNumber()
        },
        showActionHandler() {
            if (this.list.length > 1) {
                this.showAction = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.transfer {
    padding: 0 24px 16px;
    color: #393939;
    .main-text {
        margin: 10px 0;
    }
    .sub-text {
        opacity: 0.4;
    }
}
.edit-form {
    margin: 0 18px;
}
.field {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 8px;
    border-bottom: 1px solid #efefef;
    font-size: 16px;
    line-height: 36px;
    margin-top: 40px;
}
.field__input {
    font-size: 30px;
    width: 210px;
    border: none;
    outline: none;
    text-align: right;
    background: transparent;
    margin: 0 10px 0 0;
    padding: 0;
    &::-webkit-input-placeholder {
        font-size: 14px;
        line-height: 3.8em;
    }
}
.field-supply {
    font-size: 12px;
    text-align: right;
    color: rgba(#393939, 0.6);
    margin-top: 8px;
    p {
        display: inline-block;
    }
}
.icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    position: relative;
    top: 1px;
}
.flag {
    width: 16px;
    height: 16px;
    line-height: 16px;
    margin-left: 4px;
    position: relative;
    top: 1px;
}
.field__select {
    position: relative;
    padding-right: 22px;
    &.has-more {
        span {
            font-size: 12px;
            margin-left: 2px;
        }
        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            border-width: 7px 7px 0;
            border-style: solid;
            border-color: #c4c4c4 transparent transparent;
        }
    }
}
.trade-date__title {
    display: flex;
    justify-content: space-between;
    margin: 30px 0 8px;
}
.agreement {
    margin-top: 20px;
    color: rgba(#393939, 0.6);
    line-height: 16px;
    p {
        display: inline-block;
    }
    a {
        color: #0055ff;
    }
}
/* 英文版*/
.is-en-lang {
    .field {
        display: block;
        &__label-wrap {
            span {
                text-align: right;
            }
        }
        &__input {
            width: 285px;
            text-align: left;
        }
        &-supply {
            position: relative;
            text-align: left;
            p {
                padding: 0 20px;
                img {
                    position: absolute;
                    left: 0;
                }
            }
            > img {
                position: absolute;
                right: 0;
            }
        }
        &__select {
            line-height: 24px;
            span {
                display: block;
            }
        }
    }
    .agreement {
        p {
            display: block;
        }
        a {
            margin-left: 24px;
        }
    }
}
</style>
