<template lang="pug">
.fund-details
    .fund-content(slot="main" ref="content")
        fundDetailsHeader(:fundHeaderInfoVO="fundHeaderInfoVO")
        
        fundDetailsEchart(
          @chooseTime = "getFundApyPointV1"
          :step="step"
          :fundHeaderInfoVO="fundHeaderInfoVO"
          :initEchartList="initEchartList")

        HoldfundDetails(
            v-if="holdDetailsShow"
            :initState="holdInitState")

        FightFund
        
        fundDetailsList(
            :fundCorrelationFileList="fundCorrelationFileList"
            :fundTradeInfoVO = "fundTradeInfoVO"
            :positionStatus = "positionStatus"
            :fundCode = "fundCode"
            :scroll = "scroll"
            :showPositionInfo="showPositionInfo"
            :fundHeaderInfoVO = "fundHeaderInfoVO" 
            :fundOverviewInfoVO="fundOverviewInfoVO") 
    .fund-footer-content(v-if="btnShow && isGrayAuthority")
        van-button(:class="[flag?'fund-check':'fund-no','btn','button-5width','button-left']" @click="toRouter('/fund-redemption')") {{$t('redeem')}}
        van-button(:class="[flag1?'fund-buy':'fund-no','btn','button-5width']" @click="toRouter('/fund-subscribe')") {{$t('append')}}

    .fund-footer-content(v-if="!btnShow && isGrayAuthority && !userInfo.orgEmailLoginFlag")
        .block__list--header
            .block__footer-avat
                img 
            .block__footer--content
                span 剩余
                .vant-count-down
                    CountDown( 
                        millisecond
                        :time="time"
                        format="HH:mm:ss:SSS")
                span 还差1人
            .block__footer-right
                van-button(
                    :disabled="disabled") 参与拼团
        .block__button--list
            van-button(
                class="fund-footer btn button-width"
                @click="handleBuyOrSell" 
                :disabled="disabled") {{$t('buy')}}
            .block__fight--btn.btn
                span 发起拼团申购
                em 最多省100$
    
    
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import FightFund from './components/fight-fund.vue'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundApyPointV1
} from '@/service/finance-info-server.js'
// import { getGroupAction, getGroupOrder } from '@/service/zt-group-apiserver.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundPositionV2 } from '@/service/finance-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import { Button, Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge'
// import { enablePullRefresh } from '@/utils/js-bridge.js'
import { browseFundDetails, clickFundDetails } from '@/utils/burying-point'
import { mapGetters } from 'vuex'
import { debounce } from '@/utils/tools.js'
import { CountDown } from 'vant-fork'
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
            buy: 'Subscribe',
            redeem: 'Redemption',
            append: 'Incremental',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade'
        }
    },
    keepalive: true,
    components: {
        fundDetailsHeader,
        fundDetailsEchart,
        HoldfundDetails,
        fundDetailsList,
        Button,
        Dialog,
        FightFund,
        CountDown
    },
    computed: {
        ...mapGetters(['isLogin', 'openedAccount']),
        showPositionInfo() {
            // 登陆且已开户才展示持仓信息
            return this.isLogin && this.openedAccount
        },
        disabled() {
            if (!this.isLogin) {
                return false
            }
            if (this.isLogin && this.userInfo.grayStatusBit) {
                return false
            }
            if (this.fundOverviewInfoVO.tradeAuth) {
                return false
            }
            return true
        },
        isGrayAuthority() {
            // 未登录或者登录后灰度名单下特定的基金才展示申购/赎回按钮 grayStatusBit 8（1000） 代表在白名单内
            if (!this.isLogin) {
                return true
            } else {
                if (this.fundHeaderInfoVO.isin === 'HK0000478930') {
                    return (
                        this.userInfo &&
                        (this.userInfo.grayStatusBit & (1 << 3)) === 8
                    )
                }
                return true
            }
        }
    },
    data() {
        return {
            time: 30 * 60 * 60 * 1000,
            fundHeaderInfoVO: {
                apy: 0.0,
                netPrice: 0.0
            },
            id: '',
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
            fundCode: '',
            userInfo: {},
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
        //查询团购单的订单
        // async getGroupOrder() {
        //     try {
        //         const res = await getGroupOrder({
        //             group_id: '0'
        //         })
        //     } catch (e) {
        //         console.log('getGroupOrder:error:>>>', e)
        //     }
        // },
        // //查询业务团购活动
        // async getGroupAction() {
        //     try {
        //         const res = await getGroupAction({
        //             biz_id: this.id,
        //             biz_type: 0,
        //             action_status: 2
        //         })
        //     } catch (e) {
        //         console.log('getGroupAction:error:>>>', e)
        //     }
        // },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userInfo = res
            } catch (e) {
                this.$toast(e.msg)
                console.log('getCurrentUser:error:>>>', e)
            }
        },
        //跳转
        toRouter(routerPath) {
            if (routerPath == '/fund-subscribe') {
                this.handleBuyOrSell()
            } else {
                if (!this.flag) return this.$toast(this.forbidPrompt)
                this.$router.push({
                    path: routerPath,
                    query: {
                        id: this.$route.query.id || this.id,
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
                    fundId: this.$route.query.id || this.id,
                    isin: this.$route.query.isin
                })
                this.fundHeaderInfoVO = res.fundHeaderInfoVO
                this.fundHeaderInfoVO.dividendType =
                    res.fundTradeInfoVO.dividendType.name
                this.id = res.fundHeaderInfoVO.fundId
                this.fundHeaderInfoVO.isin = res.fundOverviewInfoVO.isin
                this.fundCode = this.fundHeaderInfoVO.fundCode
                let flag = this.fundHeaderInfoVO.apy < 0
                this.fundHeaderInfoVO.apy =
                    this.fundHeaderInfoVO.assetType === 4
                        ? (
                              Math.floor(
                                  Math.abs(this.fundHeaderInfoVO.apy) * 1000000
                              ) / 10000
                          ).toFixed(4)
                        : (
                              Math.floor(
                                  Math.abs(this.fundHeaderInfoVO.apy) * 10000
                              ) / 100
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
                this.getFundApyPointV1()
                this.getFundPositionV2()
                //赎回按钮是否置灰
                this.flag =
                    (this.fundOverviewInfoVO.tradeAuth & 2) > 0 ? true : false
                //追加按钮是否置灰
                this.flag1 =
                    (this.fundOverviewInfoVO.tradeAuth & 1) > 0 ? true : false
                //申购按钮是否置灰
                this.flag2 =
                    (this.fundOverviewInfoVO.tradeAuth & 1) > 0 ? true : false
                browseFundDetails(
                    'fund_detail',
                    res.fundHeaderInfoVO.fundId,
                    res.fundHeaderInfoVO.fundName
                )
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
                    fundId: this.id
                })
                this.holdInitState = res
                this.positionStatus = res.positionStatus
                this.btnShow1 = false //申购按钮显示
                this.btnShow = false //追加赎回按钮显示
                if (
                    this.positionStatus.type === 1 &&
                    this.holdInitState.availableShare > 0
                ) {
                    this.btnShow = true
                } else {
                    this.btnShow1 = true
                }
                //持仓显示
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
        //echart图的数据获取
        async getFundApyPointV1(time) {
            try {
                const res = await getFundApyPointV1({
                    fundId: this.id,
                    apyType: time || 1
                })
                this.copyinitEchartList = res
                this.initEchartList = res
                this.initEchartList.map(item => {
                    item.pointData = Number(item.pointData * 100)
                })
                let month = {
                    1: '1个月',
                    2: '3个月',
                    3: '6个月',
                    4: '1年'
                }
                if (time <= 4) {
                    clickFundDetails(
                        'fund_detail',
                        month[time],
                        this.fundHeaderInfoVO.fundId,
                        this.fundHeaderInfoVO.fundName
                    )
                }
            } catch (e) {
                console.log('getFundApyPointV1:error:>>>', e)
            }
        },
        //用户是否能申购或者是否需要测评
        async handleBuyOrSell() {
            clickFundDetails(
                'fund_detail',
                '申购',
                this.fundHeaderInfoVO.fundId,
                this.fundHeaderInfoVO.fundName
            )
            if (!this.flag2) return this.$toast(this.forbidPrompt)
            // 未登录或未开户
            if (!this.isLogin) {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn')
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (!this.openedAccount) {
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
                        id: this.$route.query.id || this.id,
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
                            id: this.$route.query.id || this.id
                        }
                    })
                }
                let data = {
                    query: {
                        id: this.$route.query.id || this.id,
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
        },
        async appVisibleHandle(data) {
            let re = data
            if (typeof data === 'string') {
                re = JSON.parse(data)
            }
            if (re.data.status !== 'visible') {
                return
            }
            await this.$store.dispatch('initAction')
        }
    },
    async created() {
        // enablePullRefresh(true)
        await this.getFundDetail()
        // this.getGroupAction()
        // this.getGroupOrder()
        if (this.isLogin) {
            this.getCurrentUser()
        }
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.appVisibleHandle, 100)
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
        width: 50%;
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
    .block__fight--btn {
        width: 50%;
        height: 48px;
        background: #ea3d3d;
        display: flex;
        flex-direction: column;
        span {
            line-height: 30px;
            font-size: 16px;
            font-weight: 500;
        }
        em {
            font-size: 12px;
            line-height: 10px;
            font-style: normal;
        }
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
    .block__list--header {
        width: 100%;
        height: 60px;
        padding: 0 12px;
        background: rgba(234, 61, 61, 0.05);
        display: flex;
        flex-direction: row;
        align-items: center;
        .block__footer--content {
            width: 60%;

            line-height: 22px;
            display: flex;
            flex-direction: row;
            .van-count-down {
                font-size: 16px;
                color: rgba(234, 61, 61, 1);
                line-height: 24px;
            }
        }
        .block__footer-avat {
            margin: 0 10px 0 0;
            img {
                width: 40px;
                height: 40px;
            }
        }
        .block__footer-right {
            width: 100px;
            height: 36px;
            .van-button {
                height: 36px !important;
                line-height: 36px;
                color: #fff;
                background: #ea3d3d;
                width: 100%;
            }
        }
    }
}
.block__button--list {
    display: flex;
    flex-direction: row;
}
</style>
