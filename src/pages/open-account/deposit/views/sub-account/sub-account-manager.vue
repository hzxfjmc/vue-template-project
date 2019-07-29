<template lang="pug">
    .full-height.flex-fixed
        yx-step(
            :data="stepData"
            :active="active")
        .gap
        .scroll-able.flex-fixed-container
            .main-container
                .top-img-box(v-if="showType === 2")
                    img(src="/webapp/open-account/open-account/deposit/doing2@2x.png" )
                .tips-box(v-if="showType === 2") 联系客服开通个人收款账户
                .notice-box
                    .inner
                        p
                            span(v-if="showType === 2")  若您仅持有大陆银行卡，请联系客服开通专属
                            span(v-else) 若您仅持有大陆银行卡，请联系您的专属客户经理开通专属
                            span.link(@click="showTips") 个人收款账户
                            i.iconfont.icon-wenhao.icon-font-style
                            span 即可轻松完成跨境汇款。
                .account-manager-box
                    account-manager(@setShowType="setShowType")
        van-button(
            v-if="showType === 2"
            size="large"
            type="primary"
            @click="gotoCustomerService"
            class="bottom-button"
        ) 联系客服
</template>

<script>
/**
 * 入金流程-申请子账户/专属客户经理
 * @ Author LINJAIJUN
 * @ Date 2019/07/15
 */
import { mapGetters } from 'vuex'
import accountManager from '../../components/account-manager'
import jsBridge from '@/utils/js-bridge.js'
export default {
    name: 'sub-account-manager',
    components: {
        accountManager
    },
    methods: {
        gotoCustomerService() {
            jsBridge.gotoCustomerService()
        },
        showTips() {
            this.$alert({
                message:
                    '个人收款账户是友信证券联合交通银行（香港），以客户个人名义开通的收款账户，您可使用国内银行卡通过柜台、网银和手机银行，跨境汇款至子账户',
                confirmButtonText: '我知道了'
            })
        },
        setShowType(type) {
            this.showType = type
        }
    },
    computed: {
        ...mapGetters({
            user: 'user'
        }),
        stepData() {
            return this.$constant.subAccountStepData
        }
    },
    data() {
        return {
            active: 0,
            showType: '' // 1-有客户经理信息 2-无客户经理信息
        }
    },
    created() {}
}
</script>

<style scoped lang="scss">
.top-img-box {
    padding-top: 20px;
    text-align: center;
    img {
        width: 90px;
        height: 90px;
    }
}
.tips-box {
    font-size: 20px;
    font-weight: 400;
    color: $text-color;
    line-height: 22px;
    text-align: center;
    padding: 15px 0;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.main-container {
    padding: 15px;
}
.notice-box {
    font-size: 14px;
    font-weight: 400;
    color: $text-color7;
    line-height: 20px;
    border: 1px solid $text-link-color12;
    border-radius: 6px;
    background: $text-link-color06;
    .inner {
        padding: 16px;
    }
    .link {
        color: $text-link-color;
    }
}
.account-manager-box {
    margin-top: 40px;
    .sub-title {
        font-weight: 400;
        line-height: 20px;
        color: $text-color6;
        text-align: center;
    }
}
.icon-font-style {
    color: $text-link-color;
}
</style>
