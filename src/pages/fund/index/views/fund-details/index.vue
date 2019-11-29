<template lang="pug">
.fund-details
    .fund-content(slot="main" ref="content")
        fundDetailsHeader(:fundHeaderInfoVO="fundHeaderInfoVO")
        
        fundDetailsEchart(
          @chooseTime = "getSwitchFundNetPrice"
          :step="step"
          :initEchartList="initEchartList")

        HoldfundDetails(
            v-if="holdDetailsShow"
            :initState="holdInitState")

        fundDetailsList(
            :fundCorrelationFileList="fundCorrelationFileList"
            :fundTradeInfoVO = "fundTradeInfoVO"
            :positionStatus = "positionStatus"
            :fondCode = "fondCode"
            :scroll = "scroll"
            :showPositionInfo="showPositionInfo"
            :fundHeaderInfoVO = "fundHeaderInfoVO" 
            :fundOverviewInfoVO="fundOverviewInfoVO") 
    .fund-footer-content(v-if="btnShow")
        van-button(:class="[flag?'fund-check':'fund-no','btn','button-5width','button-left']" @click="toRouter('/fund-redemption')") {{$t('redeem')}}
        van-button(:class="[flag1?'fund-buy':'fund-no','btn','button-5width']" @click="toRouter('/fund-subscribe')") {{$t('append')}}

    .fund-footer-content(@click="handleBuyOrSell" v-else)
        van-button(:class="[flag2?'fund-footer':'fund-no','btn','button-width']") {{$t('buy')}}
    
    
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundNetPrice
} from '@/service/finance-info-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundPositionV2 } from '@/service/finance-server.js'
import { Button, Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge'
import { mapGetters } from 'vuex'

export default {
    i18n: {
        zhCHS: {
            buy: '申购',
            redeem: '赎回',
            append: '追加',
            login: '请登录后进行操作 ',
            loginBtn: '立即登录',
            openAccountBtn: '立即开户',
            openAccount: '您尚未开户，开户成功即可交易'
        },
        zhCHT: {
            buy: '申購',
            redeem: '贖回',
            append: '續投',
            login: '請登陸後進行操作 ',
            loginBtn: '立即登錄',
            openAccountBtn: '立即開戶',
            openAccount: '您尚未開戶，開戶成功即可交易'
        },
        en: {
            buy: 'Subscription',
            redeem: 'Redemption',
            append: 'Incremental',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade'
        }
    },
    // keepalive: true,
    components: {
        fundDetailsHeader,
        fundDetailsEchart,
        HoldfundDetails,
        fundDetailsList,
        Button,
        Dialog
    },
    computed: {
        ...mapGetters(['isLogin', 'openedAccount']),
        showPositionInfo() {
            // 登陆且已开户才展示持仓信息
            return this.isLogin && this.openedAccount
        }
    },
    data() {
        return {
            fundHeaderInfoVO: {
                apy: 0.0,
                netPrice: 0.0
            },
            fundOverviewInfoVO: {},
            fundCorrelationFileList: [],
            fundTradeInfoVO: {},
            initEchartList: [],
            copyinitEchartList: [],
            holdInitState: {
                yesterdayEarnings: null,
                positionShare: null,
                positionMarketValue: null,
                positionEarnings: null,
                inTransitAmount: null
            },
            positionStatus: {
                type: -1
            },
            holdDetailsShow: false,
            btnShow: false,
            btnShow1: false,
            fondCode: '',
            userInfo: null,
            scroll: 0,
            fundRiskType: '',
            flag: true, //赎回
            flag1: true, //追加
            flag2: true, //申购
            step: 0,
            forbidPrompt: ''
        }
    },
    methods: {
        //跳转
        toRouter(routerPath) {
            if (routerPath == '/fund-subscribe') {
                this.handleBuyOrSell()
            } else {
                if (!this.flag) return this.$toast(this.forbidPrompt)
                this.$router.push({
                    path: routerPath,
                    query: {
                        id: this.$route.query.id,
                        currencyType: this.fundTradeInfoVO.currency.type
                    }
                })
            }
        },
        //获取基金详情
        async getFundDetail() {
            try {
                this.fundCorrelationFileList = []
                const res = await getFundDetail({
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: this.$route.query.id
                })
                this.fundHeaderInfoVO = res.fundHeaderInfoVO
                this.fundHeaderInfoVO.isin = res.fundOverviewInfoVO.isin
                this.fondCode = this.fundHeaderInfoVO.fondCode
                let flag = this.fundHeaderInfoVO.apy < 0
                this.fundHeaderInfoVO.apy = (
                    Math.floor(Math.abs(this.fundHeaderInfoVO.apy) * 10000) /
                    100
                ).toFixed(2)
                this.fundHeaderInfoVO.apy = flag
                    ? -this.fundHeaderInfoVO.apy
                    : this.fundHeaderInfoVO.apy
                this.fundHeaderInfoVO.netPrice = transNumToThousandMark(
                    this.fundHeaderInfoVO.netPrice,
                    4
                )
                this.forbidPrompt = res.fundOverviewInfoVO.forbidPrompt
                this.fundHeaderInfoVO.currencyType =
                    res.fundTradeInfoVO.currency.name
                this.fundHeaderInfoVO.initialInvestAmount = transNumToThousandMark(
                    this.fundHeaderInfoVO.initialInvestAmount
                )
                this.fundHeaderInfoVO.belongDay = dayjs(
                    this.fundHeaderInfoVO.belongDay
                ).format('YYYY-MM-DD')
                this.fundOverviewInfoVO = res.fundOverviewInfoVO
                this.fundCorrelationFileList = res.fundCorrelationFileList
                this.fundTradeInfoVO = res.fundTradeInfoVO
                this.fundRiskType = res.fundOverviewInfoVO.fundRiskType
                this.flag =
                    (this.fundOverviewInfoVO.tradeAuth & 2) > 0 ? true : false
                this.flag1 =
                    (this.fundOverviewInfoVO.tradeAuth & 1) > 0 ? true : false
                this.flag2 =
                    (this.fundOverviewInfoVO.tradeAuth & 1) > 0 ? true : false
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundDetail:error:>>>', e)
            }
        },
        //获取持仓数据
        async getFundPositionV2() {
            if (!this.showPositionInfo) return false
            try {
                const res = await getFundPositionV2({
                    fundId: this.$route.query.id
                })
                this.holdInitState = res
                this.positionStatus = res.positionStatus
                this.btnShow1 = false
                this.btnShow = false
                if (
                    this.positionStatus.type === 1 &&
                    this.holdInitState.availableShare > 0
                ) {
                    this.btnShow = true
                } else {
                    this.btnShow1 = true
                }
                if (
                    this.positionStatus.type != 0 &&
                    this.positionStatus.type != -1
                ) {
                    this.holdDetailsShow = true
                } else {
                    this.holdDetailsShow = false
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundPositionV2:error:>>>', e)
            }
        },
        getSwitchFundNetPrice(time) {
            this.initEchartList = []
            let count = Math.ceil(this.copyinitEchartList.length / 22)
            switch (time) {
                case 1:
                    this.step = 0
                    this.initEchartList = this.copyinitEchartList.slice(0, 22)
                    break
                case 2:
                    this.step = 1
                    this.initEchartList = this.copyinitEchartList.slice(0, 66)
                    break
                case 3:
                    this.step = 2
                    this.initEchartList = this.copyinitEchartList.slice(0, 132)
                    break
                case 4:
                    this.step = 3
                    this.initEchartList = this.copyinitEchartList.slice(0, 245)
                    break
                case 5:
                    this.step = 4
                    this.initEchartList = []
                    for (let i = 0; i < count; i++) {
                        this.initEchartList.push(this.copyinitEchartList[i * 5])
                    }
                    break
                case 6:
                    this.step = 5
                    this.initEchartList = []
                    for (let i = 0; i < count; i++) {
                        this.initEchartList.push(
                            this.copyinitEchartList[i * 22]
                        )
                    }
                    this.initEchartList = this.copyinitEchartList
                    break
                default:
                    this.step = 6
                    break
            }
        },
        //echart图的数据获取
        async getFundNetPrice(time) {
            try {
                const res = await getFundNetPrice({
                    fundId: this.$route.query.id,
                    fundNetPriceDateType: time || 5
                })
                this.copyinitEchartList = res
                this.initEchartList = res
                if (
                    this.initEchartList.length > 0 &&
                    this.initEchartList.length <= 22
                ) {
                    this.step = 0
                } else if (
                    this.initEchartList.length > 22 &&
                    this.initEchartList.length <= 66
                ) {
                    this.step = 1
                } else if (
                    this.initEchartList.length > 66 &&
                    this.initEchartList.length <= 132
                ) {
                    this.step = 2
                } else if (
                    this.initEchartList.length > 132 &&
                    this.initEchartList.length <= 245
                ) {
                    this.step = 3
                } else {
                    this.step = 5
                }
                this.initEchartList = this.initEchartList.slice(0, 22)
                this.initEchartList.map(item => {
                    item.netPrice = Number(item.netPrice)
                })
            } catch (e) {
                console.log('getFundNetPrice:error:>>>', e)
            }
        },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userInfo = res
            } catch (e) {
                console.log('getCurrentUser:error:>>>', e)
            }
        },
        //用户是否能申购或者是否需要测评
        async handleBuyOrSell() {
            if (!this.flag2) return this.$toast(this.forbidPrompt)
            // 未登录或未开户
            if (!this.userInfo) {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn')
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (!this.userInfo.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: this.$t('openAccount'),
                    confirmButtonText: this.$t('openAccountBtn')
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            if (
                !this.userInfo.assessResult ||
                new Date().getTime() >
                    new Date(this.userInfo.validTime).getTime()
            ) {
                return this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        id: this.$route.query.id,
                        extendStatusBit: this.userInfo.extendStatusBit,
                        fundRiskType: this.fundRiskType,
                        currencyType: this.fundTradeInfoVO.currency.type
                    }
                })
            } else {
                if (
                    this.userInfo.assessResult <
                    this.fundHeaderInfoVO.fundRiskType
                ) {
                    return this.$router.push({
                        path: '/risk-appropriate-result',
                        query: {
                            id: this.$route.query.id
                        }
                    })
                }
                let data = {
                    query: {
                        id: this.$route.query.id,
                        assessResult: this.userInfo.assessResult,
                        currencyType: this.fundTradeInfoVO.currency.type,
                        fundCode: this.fundCode
                    }
                }
                data.path =
                    // eslint-disable-next-line no-constant-condition
                    (this.userInfo.extendStatusBit & 16) > 0
                        ? '/fund-subscribe'
                        : '/open-permissions'
                this.$router.push(data)
            }
        }
    },
    mounted() {
        this.getCurrentUser()
        this.getFundNetPrice()
        this.getFundDetail()
        this.getFundPositionV2()
    }
}
</script>
<style lang="scss" scoped>
.fund-details {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
    .fund-content {
        overflow: hidden;
        overflow-y: auto;
        flex-direction: column;
    }
    .button-width {
        width: 100%;
    }
    .fund-footer {
        background: $primary-color;
    }
    .btn {
        height: 50px;
        color: #fff;
        text-align: center;
        line-height: 50px;
        font-size: 0.32rem;
        border-radius: 0;
        border: none;
    }

    .fund-check,
    .fund-buy {
        width: 50%;
    }
    .fund-check {
        background: $primary-color;
    }
    .fund-buy {
        background: rgb(255, 191, 50);
    }
    .fund-no {
        background: rgba(25, 25, 25, 0.2);
    }
    .button-5width {
        width: 50%;
    }
    .button-left {
        border-right: 1px solid #e1e1e1;
    }
    .van-button {
        border-radius: 0 !important;
    }
}
.fund-footer-content {
    width: 100%;
}
</style>
