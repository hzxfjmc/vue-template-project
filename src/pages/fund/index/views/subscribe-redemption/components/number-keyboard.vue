<template lang="pug">
.block__numberkeyboard--wrapper
    .block__out--wrapper(
        :class="{ redemption: !currency }"
        @click="showNumberKeyboard")
        span.label(v-if="currency") {{currency == 1 ? 'US$': 'HK$'}}
        span.block__tip--number(v-if="!isRedemption") {{unit}}
        template(v-if="!amount")
            div.number-board(:class="show ? 'word': 'word1'") {{placeholder}}
        template(v-else)
            div.number-board(
                v-if="show"
                :class="[+amount>=0 || amount === '0.' || amount === '0.0' ?'number':'word']") {{amount}}
            div.number-board(
                v-else
                :class="[+amount>=0 || amount === '0.' || amount === '0.0'?'number1':'word1']") {{amount}}
            span.block__all--out.iconfont.icon-close(
                @click="allSell"
                v-if="amount != placeholder")
    .block__footter-num
        van-number-keyboard(
            theme="custom"
            :show="show"
            extra-key="."
            :close-button-text="$t('ok')"
            :show-delete-key = "false"
            :safe-area-inset-bottom = "true"
            @close="close"
            @blur="show = false"
            @hide = "handlerAmount"
            @input="onInput"
            @delete="onDelete"
            )
            div(slot="delete")
                span.iconfont.icon-delet
</template>
<script>
import { mapGetters } from 'vuex'
import { jumpUrl } from '@/utils/tools.js'
export default {
    props: {
        showAllSellBtn: {
            type: Object,
            default: () => {
                return { show: false, desc: '' }
            }
        },
        deletIcon: {
            type: Boolean,
            default: true
        },
        currency: {
            type: Number,
            default: null
        },
        placeholder: {
            type: String
        },
        withdrawBalance: {
            type: String,
            default: ''
        },
        openTips: {
            type: Boolean,
            default: false
        },
        value: {},
        digit: {
            type: Number,
            default: 2
        },
        isRedemption: {
            type: Boolean,
            default: false
        }
    },
    i18n: {
        zhCHS: {
            all: '全部转出',
            iknow: '我知道了',
            confirm: '立即入金',
            ok: '完成',
            subscribemsg: '您的可用余额不足\n您可以选择入金后进行申购'
        },
        zhCHT: {
            all: '全部轉出',
            iknow: '我知道了',
            confirm: '立即存款',
            ok: '完成',
            subscribemsg: '您的可用餘額不足\n您可以选择存款後進行申購'
        },
        en: {
            all: 'ALL',
            iknow: 'I Get It',
            confirm: 'Deposit Now',
            ok: 'ok',
            subscribemsg:
                'Sorry，Your account number is not enough\nYou can subscribe the fund after you deposit'
        }
    },
    watch: {
        placeholder() {
            this.amount = this.$route.query.fixedPlanAmount
                ? this.$route.query.fixedPlanAmount
                : ''
        }
        // show(v) {
        //     this.$emit('onShow', v)
        // }
    },
    data() {
        return {
            show: false
            // amount: ''
        }
    },
    computed: {
        amount: {
            get() {
                return this.value
            },
            set(v) {
                this.$emit('input', v)
            }
        },
        ...mapGetters(['lang']),
        isPhoneX() {
            return (
                /iphone/gi.test(window.navigator.userAgent) &&
                window.screen.height >= 812
            )
        },
        unit() {
            let obj = {
                en: {
                    5: 'Ten Thousand',
                    6: 'Hundred Thousand',
                    7: 'Million',
                    8: 'Ten Million',
                    9: 'Hundred Million'
                },
                zhCHT: {
                    5: '萬',
                    6: '十萬',
                    7: '百萬',
                    8: '千萬',
                    9: '億'
                },
                zhCHS: {
                    5: '万',
                    6: '十万',
                    7: '百万',
                    8: '千万',
                    9: '亿'
                }
            }
            if (this.amount === this.placeholder) {
                return ''
            }
            if (this.amount.indexOf('.') > 0) {
                return obj[this.lang][this.amount.split('.')[0].length]
            } else {
                return obj[this.lang][this.amount.length]
            }
        }
    },
    created() {
        // console.log(this.$route.query.fixedPlanAmount)
        this.amount = this.$route.query.fixedPlanAmount
            ? this.$route.query.fixedPlanAmount
            : ''
    },
    methods: {
        //跳转入金
        focusEvent() {
            if (this.withdrawBalance <= 0 && this.placeholder) {
                this.$dialog
                    .confirm({
                        message: this.$t('subscribemsg'),
                        confirmButtonText: this.$t('confirm'),
                        closeOnClickOverlay: true,
                        cancelButtonText: this.$t('iknow')
                    })
                    .then(() => {
                        jumpUrl(
                            3,
                            `${window.location.origin}/webapp/open-account/deposit.html#/`
                        )
                    })
                    .catch(() => {
                        // on cancel
                    })

                return
            }
        },
        async showNumberKeyboard() {
            if (this.openTips) {
                await this.focusEvent()
            }
            if (this.withdrawBalance <= 0 && this.openTips) return
            if (!this.show) {
                this.show = true
            }
        },
        //全部卖出
        allSell() {
            this.amount = ''
            // this.amount = this.placeholder
            // this.$emit('handlerAmount', this.amount)
        },
        handlerAmount() {
            // this.$emit('handlerAmount', this.amount)
        },
        close() {
            this.show = false
        },
        //输入
        onInput(val) {
            console.log('onInput', this.amount, val)
            let amount = String(this.amount)
            let re
            if (this.digit > 0) {
                re = new RegExp(`^\\d{1,9}(\\.\\d{0,` + this.digit + `})?$`)
                if (!re.test(amount + val)) {
                    return
                }
            } else {
                re = /^\d{1,9}$/
                if (val === '.') {
                    return
                }
            }
            let noDeal = false
            if (amount === this.placeholder && (val == 0 || val === '.')) {
                amount = '0.'
            } else if (amount.indexOf('.') > 0 && val === '.') {
                noDeal = true
            } else if (
                +amount >= 0 ||
                amount === this.placeholder ||
                amount === '0.'
            ) {
                if (amount === this.placeholder) amount = ''
                if (re.test(Number(amount.toString() + val.toString()))) {
                    amount = amount.toString() + val.toString()
                }
            }
            console.log('inputEnd', amount)
            !noDeal && (this.amount = amount)
            this.$emit('clickBoard')
            // this.$emit('handlerAmount', this.amount)
        },
        //删除
        onDelete() {
            if (this.amount === '') return
            if (this.amount === '0.') return (this.amount = '')
            this.amount = this.amount.substr(0, this.amount.length - 1)
            // this.$emit('handlerAmount', this.amount)
            if (this.amount.length === 0 || this.amount === this.placeholder) {
                return (this.amount = '')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__footter-num {
    position: fixed;
    z-index: 9999999999999;
    .fix-bottom {
        bottom: 30px;
    }
}
.block__out--wrapper {
    margin: 14px 0 0 0;
    padding: 0 0 12px 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    position: relative;
    min-height: 26px;
    .block__tip--number {
        left: 70px;
        top: -18px;
        font-size: 12px;
        position: absolute;
    }
    &.redemption {
        .block__tip--number {
            left: 22px;
        }
    }
    .label {
        font-size: 24px;
        min-width: 52px;
    }
    .number1 {
        margin: 0 10px 0 20px;
        font-family: 'yxFontDINPro-Medium';
        font-size: 24px;
    }
    .word1 {
        margin: 0 10px 0 20px;
        font-size: 14px;
        color: #d1d1d1;
        display: block;
    }
    .number {
        font-family: 'yxFontDINPro-Medium';
        margin: 0 10px 0 20px;
        font-size: 14px;
        font-size: 24px;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            right: -5px;
            height: 25px;
            top: 5px;
            width: 2px;
            display: inline-block;
            background: #3c78fa;
            animation: flash 1s infinite;
        }
    }
    .word {
        margin: 0 10px 0 20px;
        font-size: 14px;
        height: 20px;
        color: #d1d1d1;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            left: 0;
            height: 22px;
            top: -2px;
            display: inline-block;
            width: 2px;
            background: #3c78fa;
            animation: flash 1s infinite;
        }
    }
    .block__all--out {
        font-size: 14px;
        position: absolute;
        right: 0;
        width: 80px;
        display: inline-block;
        color: rgba(25, 25, 25, 0.65);
        text-align: right;
    }
}
@keyframes flash {
    from {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    to {
        opacity: 0.1;
    }
}
</style>
