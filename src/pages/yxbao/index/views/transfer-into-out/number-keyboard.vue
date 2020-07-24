<template lang="pug">
.block__numberkeyboard--wrapper
    .block__out--wrapper.border-bottom
        .block__all--out-left(
            @click="showNumberKeyboard")
            span.label {{currencyType === 1 ? 'USD':'HKD'}}
            span.block__tip--number {{unit}}
            div.number-board(
                v-if="show"
                :class="[amount>0 || amount === '0.' || amount === '0.0' ?'number':'word']") {{amount}}
            div.number-board(
                v-else
                :class="[amount>0 || amount === '0.' || amount === '0.0'?'number1':'word1']") {{amount}}
        span.block__all--out(
            @click="allSell"
            v-if="showAllSellBtn.show") {{showAllSellBtn.desc ==='allIn' ?$t('allIn') : $t('allOut')}}
    van-number-keyboard(
        theme="custom"
        :show="show"
        extra-key="."
        :safe-area-inset-bottom = "true"
        :close-button-text="$t('ok')"
        :show-delete-key = "false"
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
        placeholder: {
            type: String,
            default: '请输入'
        },
        withdrawBalance: {
            type: String,
            default: ''
        },
        openTips: {
            type: Boolean,
            default: false
        },
        currencyType: {
            type: Number,
            default: 0
        }
    },
    i18n: {
        zhCHS: {
            allOut: '全部转出',
            allIn: '全部转入',
            iknow: '我知道了',
            confirm: '立即入金',
            subscribemsg: '您的可用余额不足\n您可以选择入金后进行申购',
            ok: '完成'
        },
        zhCHT: {
            all: '全部轉出',
            allIn: '全部轉入',
            iknow: '我知道了',
            confirm: '立即存款',
            subscribemsg: '您的可用餘額不足\n您可以选择存款後進行申購',
            ok: '完成'
        },
        en: {
            allOut: 'ALL',
            allIn: 'ALL',
            iknow: 'I Get It',
            confirm: 'Deposit Now',
            subscribemsg:
                'Sorry，Your account number is not enough\nYou can subscribe the fund after you deposit',
            ok: 'ok'
        }
    },
    watch: {
        placeholder() {
            this.amount = this.placeholder
        }
    },
    data() {
        return {
            show: false,
            amount: ''
        }
    },
    computed: {
        ...mapGetters(['lang']),
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
        this.amount = this.placeholder
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
            this.amount = this.showAllSellBtn.maxAmount
            this.$emit('handlerAmount', this.amount)
            this.show = false
        },
        handlerAmount() {
            this.$emit('handlerAmount', this.amount)
        },
        close() {
            this.show = false
        },
        //输入
        onInput(val) {
            let re = /^\d{0,9}(\.\d{0,2})?$/
            if (this.amount === '0.0' && val === 0) return
            if (this.amount === this.placeholder && (val == 0 || val === '.')) {
                return (this.amount = '0.')
            }
            if (this.amount.indexOf('.') > 0 && val === '.') return
            if (
                this.amount >= 0 ||
                this.amount === this.placeholder ||
                this.amount === '0.' ||
                this.amount === '0.0'
            ) {
                if (this.amount === this.placeholder) this.amount = ''
                if (re.test(Number(this.amount.toString() + val.toString()))) {
                    this.amount = this.amount.toString() + val.toString()
                }
            }
            this.$emit('handlerAmount', this.amount)
        },
        //删除
        onDelete() {
            if (this.amount === this.placeholder) return
            if (this.amount === '0.') return (this.amount = this.placeholder)
            this.amount = this.amount.substr(0, this.amount.length - 1)
            this.$emit('handlerAmount', this.amount)
            if (this.amount.length === 0 || this.amount === this.placeholder) {
                return (this.amount = this.placeholder)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__out--wrapper {
    margin: 16px 0 0 0;
    padding: 0 0 9px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .block__all--out-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        min-width: 70%;
    }
    .block__tip--number {
        left: 70px;
        top: -13px;
        font-size: 12px;
        position: absolute;
        color: $text-color6;
    }
    .label {
        font-size: 24px;
    }
    .number1 {
        margin: 0 10px 0 20px;
        font-family: 'yxFontDINPro-Medium';
        font-size: 24px;
        line-height: 14px;
    }
    // .number-board {
    //     width: 200px;
    // }
    .word1 {
        margin: 0 10px 0 20px;
        font-size: 16px;
        color: #d1d1d1;
        display: block;
    }
    .number {
        font-family: 'yxFontDINPro-Medium';
        margin: -4px 10px 0 20px;
        // font-size: 14px;
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
        margin: 0px 10px 0 20px;
        font-size: 16px;
        height: 20px;
        color: #d1d1d1;
        line-height: 20px;
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
            animation: flash 0.8s infinite;
        }
    }
    .block__all--out {
        font-size: 14px;
        position: absolute;
        right: 0;
        width: 80px;
        display: inline-block;
        color: #2f79ff;
        text-align: right;
    }
}
@keyframes flash {
    from {
        opacity: 1;
    }
    // 50% {
    //     opacity: 0.5;
    // }
    to {
        opacity: 0;
    }
}
</style>
