<template lang="pug">
.block__element-wrapper
    .block__out--header
        p.title 转入金额
        NumberKeyboard(
            placeholder="10000.00港币起"
            @handlerAmount="handlerAmount"
        )
        p.desc 预计02-05开始收益
       

    .block__out--title.common-flex-space-between.common-marge-top
        p.title 转出方式
        .tips 
            p.tips--top uSMART证券账户
            p.tips--bottom 可用余额：单笔{{Number(this.accountInfo.withdrawBalance).toFixed(2)}}港币
    van-button.btn(:disabled="disabled") 转入

</template>
<script>
import NumberKeyboard from './number-keyboard'
import { getBaoCapitalTrade } from '@/service/finance-server.js'
import { generateUUID } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
export default {
    components: {
        NumberKeyboard
    },
    computed: {
        disabled() {
            return this.amount == 0
        }
    },
    data() {
        return {
            amount: '',
            chargeType: 1,
            accountInfo: {}
        }
    },
    created() {
        this.handleHsAccountInfo()
    },
    methods: {
        handlerAmount(amount) {
            this.amount = amount
        },
        // 获取用户恒生资金账户信息
        async handleHsAccountInfo() {
            try {
                let data = await hsAccountInfo(1)
                this.accountInfo = data || {}
            } catch (error) {
                this.$toast(error.msg)
                console.log('hsAccountInfo:error:>>>', error)
            }
        },
        async getBaoCapitalTrade() {
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                if (!data && !data.token) {
                    this.getBaoCapitalTrade()
                    return
                }
                await getBaoCapitalTrade({
                    amount: this.amount,
                    chargeType: this.chargeType,
                    fundId: this.$route.query.id,
                    recordType: 1,
                    requestId: generateUUID(),
                    tradeToken: data.token
                })
            } catch (error) {
                if (error.desc.errorMessage)
                    return this.$toast(error.desc.errorMessage)
                if (error.msg) return this.$toast(error.msg)
                console.log('申购页面-tradeErrorMsg :', error)
            }
        }
        //转入
    }
}
</script>
<style lang="scss" scoped>
.btn {
    background: #0d50d8;
    color: #fff;
    width: 343px;
    height: 48px;
    font-size: 16px;
    margin: 20px 16px;
    border-radius: 6px;
}
.title {
    font-size: 16px;
}
.block__out--header {
    padding: 20px 12px 0 12px;
    background: #fff;
    .desc {
        font-size: 12px;
        padding: 9px 0;
        color: $text-color6;
    }
}
.block__out--title {
    background: #fff;
    padding: 15px 12px 14px 12px;
    .tips {
        text-align: right;
        .tips--top {
            font-size: 16px;
            color: $text-color;
        }
        .tips--bottom {
            color: $text-color6;
            font-size: 12px;
            padding: 6px 0 0 0;
        }
    }
}
</style>
