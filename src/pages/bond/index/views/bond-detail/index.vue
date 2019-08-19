<template lang="pug">
    .bond-detail-wrapper
        detail-header(
            :bondEditableInfo="bondEditableInfo"
            :bondUneditableInfo="bondUneditableInfo",
            :currentPrice="currentPrice"
        )
        van-panel(title="购买流程")
            purchasing-process(:bondUneditableInfo="bondUneditableInfo")
        van-panel(title="债券价格" style="position:relative")
            BondPrice(:chartData="prices" :currentPrice="currentPrice")
        van-panel(title="债券资料")
            BondInfo(
                :bondEditableInfo="bondEditableInfo"
                :bondUneditableInfo="bondUneditableInfo"
            )
        van-panel(title="交易规则")
            TransactionRules
        .faq
            a(href="/webapp/market/generator.html?key=bond01" title="债券常见问题") 债券常见问题
        .operate-btn-box
            div(@click="handleBuyOrSell('buy')") 买入
            div(@click="handleBuyOrSell('sell')") 卖出

</template>
<script>
import { getBondDetail } from '@/service/finance-info-server.js'
import jsBridge from '@/utils/js-bridge'
import { Panel } from 'vant'
import DetailHeader from './components/detail-header/index.vue'
import PurchasingProcess from './components/purchasing-process/index.vue'
import BondPrice from './components/bond-price/index.vue'
import BondInfo from './components/bond-info/index.vue'
import TransactionRules from './components/transaction-rules/index.vue'
import { mapState } from 'vuex'
export default {
    name: 'BondList',
    components: {
        [Panel.name]: Panel,
        DetailHeader,
        PurchasingProcess,
        BondPrice,
        BondInfo,
        TransactionRules
    },
    async created() {
        this.id = this.$route.query.id - 0
        try {
            let {
                bondEditableInfo,
                bondUneditableInfo,
                currentPrice,
                prices
            } = await getBondDetail(this.id)

            this.bondEditableInfo = bondEditableInfo || {}
            this.bondUneditableInfo = bondUneditableInfo || {}
            this.currentPrice = currentPrice || {}
            this.prices = prices || []
            this.bondName =
                (this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.name) ||
                '--'
            console.log(
                'getBondDetail:data:>>> ',
                bondEditableInfo,
                bondUneditableInfo,
                currentPrice,
                prices
            )
        } catch (e) {
            console.log('getBondDetail:error:>>>', e)
        }
    },
    data() {
        return {
            bondEditableInfo: {},
            bondUneditableInfo: {},
            currentPrice: {},
            prices: [],
            id: 0,
            bondName: ''
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        async handleBuyOrSell(type) {
            // 未登录或未开户
            if (!this.user) {
                await this.$dialog.alert({
                    message: '用户信息丢失，请登陆'
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (!this.user.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: '未开户，请先去开户'
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            // // 买入还是卖出
            let direction = type === 'buy' ? 1 : 2

            // 第一次进来跳转到风险测评流程
            if (!localStorage.isFirstEnter) {
                localStorage.isFirstEnter = 1
                this.$router.push({
                    path: '/risk-warning',
                    query: {
                        id: this.id,
                        bondName: this.bondName,
                        direction
                    }
                })
                return
            }
            this.$router.push({
                path: '/risk-assessment-result',
                query: {
                    id: this.id,
                    bondName: this.bondName,
                    direction
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.bond-detail-wrapper {
    padding: 10px 10px 48px;
    color: #393939;
    // 常见问题
    .faq {
        text-align: center;
        margin: 10px auto 12px;
        a {
            color: #2f79ff;
            font-size: 0.24rem;
            line-height: 17px;
        }
    }
    // 买入卖出按钮
    .operate-btn-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 48px;
        display: flex;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 100%;
            background-color: #497aff;
            color: #fff;
            font-size: 0.32rem;
            &:last-child {
                background-color: #ffbf32;
            }
        }
    }
}
// 微调 vant panel 样式
.van-panel {
    margin-top: 10px;
    border-radius: 4px;
    .van-panel__header {
        padding: 14px 12px;
        font-size: 0.28rem;
        line-height: 20px;
        &:after {
            display: none;
        }
    }
    .van-cell__title {
        color: #393939;
        font-size: 0.28rem;
        line-height: 20px;
    }
}
</style>
