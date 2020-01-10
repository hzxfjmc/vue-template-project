<template lang="pug">
.fund-details
    .fund-content(slot="main" ref="content")
        fundDetailsHeader(
            :price="price"
            :fundHeaderInfoVO="fundHeaderInfoVO")
        
        fundDetailsEchart(
          @chooseTime = "getFundApyPointV1"
          :step="step"
          :timeList="timeList"
          :tabObj="tabObj"
          :historyList="historyList"
          :fundHeaderInfoVO="fundHeaderInfoVO"
          :initEchartList="initEchartList")

        HoldfundDetails(
            v-if="holdDetailsShow"
            :initState="holdInitState")
        .block__fundheader--tips(@click="toRouterGenerator('/order-record')")
            em.iconfont.icon-iconEBshoucang
            span.title {{$t('trade')}}
            .block__list--right
                em.iconfont.icon-iconEBgengduoCopy
        fundSurvey(:fundOverviewInfoVO="fundOverviewInfoVO")
        fundTradingRules(:fundTradeInfoVO="fundTradeInfoVO")
        .block__fundheader--tips(@click="toRouterGenerator('/generator')")
            em.iconfont.icon-iconEBshoucang2
            span.title {{$t('risk')}}
            .block__list--right
                em.iconfont.icon-iconEBgengduoCopy
        fundCardList(
            v-if="recommendList.length != 0"
            :recommendList="recommendList")

        .fund___list--p
            p {{$t('msg')}}
    .fund-footer-content(v-if="btnShow && isGrayAuthority")
        van-button(:class="[flag?'fund-check':'fund-no','btn','button-5width','button-left']" @click="toRouter('/fund-redemption')") {{$t('redeem')}}
        van-button(:class="[flag1?'fund-buy':'fund-no','btn','button-5width']" @click="toRouter('/fund-subscribe')") {{$t('append')}}

    .fund-footer-content(v-if="!btnShow && isGrayAuthority && !userInfo.orgEmailLoginFlag")
        van-button(
            class="fund-footer btn button-width"
            @click="handleBuyOrSell" 
            :disabled="disabled") {{$t('buy')}}
    
   
    
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import fundSurvey from './components/fund-survey'
import fundTradingRules from './components/fund-trading-rules'
import fundCardList from './components/fund-card-list'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundPerformanceHistory,
    getFundApyPointV1,
    getFundNetPriceHistoryV1,
    getFundRecommendList
} from '@/service/finance-info-server.js'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { getFundPositionV2 } from '@/service/finance-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import { Button, Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge'
// import { enablePullRefresh } from '@/utils/js-bridge.js'
import { browseFundDetails, clickFundDetails } from '@/utils/burying-point'
import { mapGetters } from 'vuex'
import { debounce } from '@/utils/tools.js'
export default {
    i18n: {
        zhCHS: {
            buy: '申购',
            redeem: '赎回',
            risk: '风险提示',
            append: '追加',
            trade: '交易记录',
            login: '请登录后进行操作 ',
            loginBtn: '立即登录',
            openAccountBtn: '立即开户',
            openAccount: '您尚未开户，开户成功即可交易',
            timeTranslation: {
                oneWeek: '近一周',
                oneMonth: '近一月',
                threeMonth: '近三月',
                sixMonth: '近六月',
                oneYear: '近一年',
                twoYear: '近两年',
                threeYear: '近三年',
                fiveYear: '近五年',
                all: '成立来'
            },
            msg:
                '以上资料来源于基金公司及第三方数据商，相关数据仅供参考本页面非任何法律文件，投资前请阅读基金合同，招募说明书基金过往业绩不预示未来表现不构成投资建议，市场有风险投资需谨慎'
        },
        zhCHT: {
            buy: '申購',
            redeem: '贖回',
            risk: '風險提示',
            append: '續投',
            trade: '交易記錄',
            login: '請登陸後進行操作 ',
            loginBtn: '立即登錄',
            openAccountBtn: '立即開戶',
            openAccount: '您尚未開戶，開戶成功即可交易',
            timeTranslation: {
                oneWeek: '近一周',
                oneMonth: '近一月',
                threeMonth: '近三月',
                sixMonth: '近六月',
                oneYear: '近一年',
                twoYear: '近两年',
                threeYear: '近三年',
                fiveYear: '近五年',
                all: '成立来'
            },
            msg:
                '以上資料基金會基金公司及第三方數據商，相關數據另有參考本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書基金過往業績不預示未來表現不構成投資建議，市場有風險投資需謹慎'
        },
        en: {
            buy: 'Subscribe',
            redeem: 'Redemption',
            risk: 'Risk Disclosure',
            trade: 'Transaction Records',
            append: 'Incremental',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade',
            timeTranslation: {
                oneWeek: 'Last 1 week',
                oneMonth: 'Last 1 month',
                threeMonth: 'Last 3 month',
                sixMonth: 'Last 6 month',
                oneYear: 'Last 1 year',
                twoYear: 'Last 2 year',
                threeYear: 'Last 3 year',
                fiveYear: 'Last 5 year',
                all: 'ALL'
            },
            msg:
                'The above information comes from the fund company and third-party data provides.This page is not a legal document. Please read the fund contract and prospectus before investing.Past performance is not indicative of future performance.All investments involve risk. Investors should consult all available information，before making any investment strategy.'
        }
    },
    keepalive: true,
    components: {
        fundDetailsHeader,
        fundDetailsEchart,
        HoldfundDetails,
        fundDetailsList,
        Button,
        fundSurvey,
        Dialog,
        fundCardList,
        fundTradingRules
    },
    computed: {
        ...mapGetters(['isLogin', 'openedAccount']),
        showPositionInfo() {
            // 登陆且已开户才展示持仓信息
            return this.isLogin && this.openedAccount
        },
        disabled() {
            // 接口返回数据后才允许点击
            if (
                !this.userInfo.grayStatusBit ||
                !this.fundOverviewInfoVO.tradeAuth
            ) {
                return true
            }
            return false
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
            tabObj: {
                label: '',
                value: ''
            },
            fundHeaderInfoVO: {
                apy: 0.0,
                netPrice: 0.0
            },
            id: '',
            fundOverviewInfoVO: {},
            recommendList: [], //推荐基金
            fundCorrelationFileList: [],
            historyList: [],
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
            price: '',
            step: 0,
            forbidPrompt: '',
            timeList: {
                oneWeek: {
                    label: '近一周',
                    value: '·'
                },
                oneMonth: {
                    label: '近一個月',
                    value: '·'
                },
                threeMonth: {
                    label: '近三個月',
                    value: '·'
                },
                sixMonth: {
                    label: '近六個',
                    value: '·'
                },
                oneYear: {
                    label: '近一年',
                    value: '·'
                }
            },
            timeLists: {
                oneWeek: {
                    label: '近一周',
                    value: ''
                },
                oneMonth: {
                    label: '近一個月',
                    value: ''
                },
                threeMonth: {
                    label: '近三個月',
                    value: ''
                },
                sixMonth: {
                    label: '近六個',
                    value: ''
                },
                oneYear: {
                    label: '近一年',
                    value: ''
                },
                twoYear: {
                    label: '近两年',
                    value: ''
                },
                threeYear: {
                    label: '近三年',
                    value: ''
                },
                fiveYear: {
                    label: '近五年',
                    value: ''
                },
                all: {
                    label: '成立来',
                    value: ''
                }
            }
        }
    },
    methods: {
        sliceDeci(s, l) {
            let deci = s.split('.')[1].slice(0, l)
            return s.split('.')[0] + '.' + deci
        },
        //获取基金净值历史
        async getFundNetPriceHistoryV1() {
            try {
                const { list } = await getFundNetPriceHistoryV1({
                    fundId: this.id,
                    pageNum: 1,
                    pageSize: 6
                })
                list.forEach((item, index) => {
                    item.belongDay = dayjs(item.belongDay).format('YYYY-MM-DD')
                    item.netPrice = this.sliceDeci(item.netPrice, 4)
                    if (index === list.length - 1) {
                        list[list.length - 1].price = '0.00' // 最后一项涨跌幅无法则算为0
                    } else {
                        if (Number(list[index + 1].netPrice) !== 0) {
                            item.price =
                                ((list[index].netPrice -
                                    list[index + 1].netPrice) /
                                    list[index + 1].netPrice) *
                                100
                            item.price =
                                this.fundHeaderInfoVO.assetType != 4
                                    ? item.price.toFixed(2)
                                    : item.price.toFixed(4)
                        } else {
                            item.price = '0.00'
                        }
                    }
                })
                this.price = list[0].price
                this.historyList = list.slice(0, 5)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        toRouterGenerator(data) {
            let url
            if (data === '/generator') {
                url = `${window.location.origin}/webapp/market/generator.html?key=${this.fundHeaderInfoVO.fundCode}`
            } else {
                url = `${window.location.origin}/wealth/fund/index.html#${data}?id=${this.id}&currencyType=${this.fundTradeInfoVO.currency.type}`
            }
            jumpUrl(3, url)
        },
        async getFundPerformanceHistory() {
            try {
                const res = await getFundPerformanceHistory({
                    fundId: this.id
                })
                for (let key in this.timeList) {
                    if (!res[key] && res[key] != 0) {
                        this.timeList[key].value = '--'
                    } else {
                        this.timeList[key].value = (res[key] * 100).toFixed(2)
                    }
                }
                for (let key in this.timeLists) {
                    this.timeLists[key].value = (res[key] * 100).toFixed(2)
                }
                this.tabObj.label = this.timeList['oneMonth'].label
                this.tabObj.value = this.timeList['oneMonth'].value
            } catch (e) {
                console.log(e)
                this.$toast(e.msg)
            }
        },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                console.log(res)
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
                // this.fundHeaderInfoVO.dividendType =
                //     res.fundTradeInfoVO.dividendType.name
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
                this.fundOverviewInfoVO.fundId = res.fundHeaderInfoVO.fundId
                this.fundTradeInfoVO = res.fundTradeInfoVO
                this.fundTradeInfoVO.fundId = res.fundHeaderInfoVO.fundId
                this.fundTradeInfoVO.assetType = res.fundHeaderInfoVO.assetType
                this.fundRiskType = res.fundOverviewInfoVO.fundRiskType
                this.fundOverviewInfoVO.currencyName = this.fundOverviewInfoVO.currency.name
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

                let monthEmun = {
                    1: 'oneMonth',
                    2: 'threeMonth',
                    3: 'sixMonth',
                    4: 'oneYear',
                    5: 'threeYear',
                    9: 'all'
                }
                if (time) {
                    this.tabObj.label = this.timeLists[monthEmun[time]].label
                    this.tabObj.value = this.timeLists[monthEmun[time]].value
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
        },
        init18inState() {
            for (let key in this.timeList) {
                this.timeList[key].label = this.$t('timeTranslation')[key]
            }
            for (let key in this.timeLists) {
                this.timeLists[key].label = this.$t('timeTranslation')[key]
            }
        },
        //获取推荐基金
        async getFundRecommendList() {
            try {
                const res = await getFundRecommendList({
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: this.$route.query.id || this.id
                })
                this.recommendList = res
                this.recommendList.map(item => {
                    item.apy = Math.floor(item.apy * 10000) / 100
                })
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundRecommendList:error:>>>', e)
            }
        }
    },
    async created() {
        // enablePullRefresh(true)
        this.init18inState()
        await this.getFundDetail()
        this.getFundNetPriceHistoryV1()
        this.getFundPositionV2()
        this.getFundRecommendList()
        this.getFundPerformanceHistory()
        this.getFundApyPointV1()
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
.fund___list--p {
    width: 90%;
    margin: 20px 5%;
    p {
        font-size: 12px;
        line-height: 17px;
        color: #999999;
    }
}
.block__fundheader--tips {
    display: flex;
    flex-direction: row;
    padding: 15px 10px;
    margin: 6px 0 0 0;
    background: #fff;
    line-height: 22px;
    height: 50px;
    .icon-icon-gaishu {
        font-size: 20px;
    }
    .title {
        font-size: 16px;
        margin: 0 0 0 10px;
    }
    .block__list--right {
        margin-right: auto;
        flex-grow: 1; //这三个元素只有它在有空余空间时可伸缩，也就是它占据了所有剩余空间
        display: flex; //将它设置为flex,就可以单独对他进行主轴右对齐
        justify-content: flex-end;
        text-align: right;
        span {
            font-size: 14px;
            color: #666666;
        }
        .iconfont {
            font-size: 15px;
            line-height: 25px;
        }
    }
    .iconfont {
        font-size: 20px;
    }
}
.fund-details {
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
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
