<template lang="pug">
.block__numberkeyboard--wrapper
    .block__out--wrapper.border-bottom(@touchstart.stop="showNumberKeyboard")
        span.label HKD
        span.block__tip--number {{unit}}
        span.number-board(
            v-if="show"
            :class="[amount>0 || amount === '0.'?'number':'word']") {{amount}}
        span.number-board(
            v-else
            :class="[amount>0 || amount === '0.'?'number1':'word1']") {{amount}}
        span.block__all--out(v-if="showAllSellBtn.show") 全部转出
    van-number-keyboard(
        
        :show="show"
        extra-key="."
        delete-button-text="删除"
        close-button-text="完成"
        :show-delete-key = "false"
        @close="close"
        @blur="show = false"
        @hide = "handlerAmount"
        @input="onInput"
        @delete="onDelete"
        )
</template>
<script>
import { mapGetters } from 'vuex'
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
        }
    },
    data() {
        return {
            show: true,
            amount: ''
        }
    },
    created() {
        this.amount = this.placeholder
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
    methods: {
        showNumberKeyboard() {
            if (!this.show) {
                this.show = true
            }
        },
        handlerAmount() {
            console.log(this.amount)
        },
        close() {
            this.show = false
        },
        onInput(val) {
            let re = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/
            if (re.test(this.amount)) return
            if (this.amount === this.placeholder && (val == 0 || val === '.')) {
                return (this.amount = '0.')
            }
            if (this.amount.indexOf('.') > 0 && val === '.') return
            if (
                this.amount >= 0 ||
                this.amount === this.placeholder ||
                this.amount === '0.'
            ) {
                if (this.amount === this.placeholder) this.amount = ''
                this.amount = this.amount.toString() + val.toString()
            }
        },
        onDelete() {
            if (this.amount === this.placeholder) return
            if (this.amount === '0.') return (this.amount = this.placeholder)
            this.amount = this.amount.substr(0, this.amount.length - 1)
            if (this.amount.length === 0 || this.amount === this.placeholder) {
                return (this.amount = this.placeholder)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__out--wrapper {
    margin: 14px 0 0 0;
    padding: 0 0 9px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .block__tip--number {
        left: 60px;
        top: -15px;
        position: absolute;
    }
    .label {
        font-size: 24px;
    }
    .number1 {
        margin: 0 10px;
        // font-size: 14px;
        font-size: 24px;
    }
    .word1 {
        margin: 0 10px;
        font-size: 14px;
        font-size: 16px;
        color: #d1d1d1;
    }
    .number {
        margin: 0 10px;
        font-size: 14px;
        font-size: 24px;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            right: -5px;
            height: 25px;
            top: 3px;
            width: 2px;
            display: inline-block;
            background: #3c78fa;
            animation: flash 1s infinite;
        }
    }
    .word {
        margin: 0 10px;
        font-size: 16px;
        color: #d1d1d1;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            left: 0;
            height: 22px;
            top: 0px;
            display: inline-block;
            width: 2px;
            background: #3c78fa;
            animation: flash 1s infinite;
        }
    }
    .block__all--out {
        font-size: 14px;
        flex: 1;
        color: #2f79ff;
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
