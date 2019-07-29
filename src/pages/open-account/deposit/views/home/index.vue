<template lang="pug">
    .deposit-container
        yx-step(
        :data="stepData"
        :active="0")
        .gap
        .box-layout
            .item-box.flex-box(@click="redirect('2','1')")
                .item-left
                    h2.title 我要存入港币
                    h3.sub-title 投资港股
                .item-right
                    img(src="/webapp/open-account/open-account/deposit/flag_HK@2x.png",alt="HK")
            .item-box.flex-box(@click="redirect('1','2')" v-if="!usStockTradeClose")
                .item-left
                    h2.title 我要存入美元
                    h3.sub-title 投资美股
                .item-right
                    img(src="/webapp/open-account/open-account/deposit/flag_USA@2x.png",alt="USA")
    </template>
<script>
/**
 * 入金流程-选择币种
 * @ Author LINJAIJUN
 * @ Date 2018/12/27
 */
import { usStockTradeClose } from '@/utils/html-utils'
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
export default {
    methods: {
        redirect(currency, accountType) {
            this.$store.dispatch('deposit/setCurrency', currency)
            this.$store.dispatch('deposit/setAccountType', accountType)
            this.$router.push({
                name: 'choose-method'
            })
            // if (this.verifyType === 0) {
            //     // 线上开户则走绑定银行卡出入金
            //     this.$router.push({
            //         name: 'select-bank'
            //     })
            // } else {
            //     // 非线上开户则走原有大陆入金流程
            //     this.$router.push({
            //         name: 'choose-method'
            //     })
            // }
        },
        async getHKOpenAccountInfo() {
            try {
                this.$loading()
                let { verifyType } = await getHKOpenAccountInfo()
                this.verifyType = verifyType
                this.$close()
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    computed: {
        stepData() {
            return this.$constant.stepData
        }
    },
    data() {
        return {
            usStockTradeClose,
            verifyType: '' // 0-港版线上开户 1-港版门店开户 2-iPad展业开户 3-大陆线上开户
        }
    },
    created() {
        this.getHKOpenAccountInfo()
    }
}
</script>

<style scoped lang="scss">
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.ov-h {
    overflow: hidden;
}
.box-layout {
    padding: 0px 10px;
    .top-title {
        padding-left: 2px;
        font-size: 18px;
        font-weight: 500;
    }
}
.item-box {
    position: relative;
    width: 100%;
    height: 150px;
    border: 1px solid rgba(225, 225, 225, 0.5);
    margin: 20px 0;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 12px;
    img {
        width: 67px;
        height: 43px;
    }
    .title {
        font-size: 18px;
        color: $text-color;
        font-weight: 500;
        line-height: 25px;
    }
    .sub-title {
        font-size: 16px;
        color: $text-color;
        font-weight: 400;
        opacity: 0.5;
    }
}

.item-left {
    padding-left: 24px;
}
.item-right {
    padding-right: 34px;
}
.flex-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
