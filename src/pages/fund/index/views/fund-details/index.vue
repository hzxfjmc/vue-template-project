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

        FightFund(
            v-if="!fightShow"
            :userList="userList"
            :swipeShow="swipeShow"
            :actionInfo = "actionInfo")   

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
    
    
    .fund-footer-content(v-if="!btnShow && isGrayAuthority && !userInfo.orgEmailLoginFlag && fightShow")
        van-button(
            class="fund-footer btn button-width"
            @click="handleBuyOrSell(1)" 
            :disabled="disabled") {{$t('buy')}}

    .fund-footer-content(
        v-if="!btnShow && isGrayAuthority && !userInfo.orgEmailLoginFlag && !fightShow && code == 1")
        .block__list--header(v-if="shareHeaderShow")
            .block__footer-avat
                img(:src="avatImg") 
            .block__footer--content
                span 剩余
                .vant-count-down
                    CountDown( 
                        millisecond
                        :time="time"
                        format="DD天 HH:mm:ss")
                span {{contentmsg}}
            .block__footer-right(v-if="figthComeShow")
                van-button(
                    @click="handleBuyOrSell(3)"
                    :disabled="disabled || differenceNumer === 0") {{differenceNumer === 0 ? '已成团' : '参与拼团'}}
        .block__button--list(v-if="figthBtnShow")
            van-button(
                class="fund-footer btn button-width1"
                @click="handleBuyOrSell(1)" 
                :disabled="disabled") {{$t('buy')}}
            .block__fight--btn.btn(
                :class="[disabled?'fund-footer2':'fund-footer1']" 
                @click="handleBuyOrSell(2)")
                span 发起拼团申购
                em 申购费最高可返{{100-discount}}%
        .block__button--list(v-if="!figthBtnShow")
            .block__fight--btn1.btn(@click="handleBuyOrSell(3)")
                span 参与拼团申购
                em 申购费最高可返{{100-discount}}%

    .fund-footer-content.fund-footer-hk(
        v-if="!btnShow && isGrayAuthority && !userInfo.orgEmailLoginFlag && !fightShow && code==2")
        .block__list--header-hk
            .block__footer-left
               p {{applyAfter}}
            .block__footer-right
                van-button(
                    @click="handleBuyOrSell(1)"
                    :disabled="disabled") {{$t('aloneScribe')}}
        .block__button--list-hk
            .block__fight--btn-hk( @click="handleBuyOrSell(4)")
                .block__fight--left
                    img(:src="avatImg")
                .block__fight--right
                    .block__fight--top
                        p  {{$t('togetherScribe')}}
                        p ({{$t('Surplus')}}
                        .vant-count-down
                            CountDown( 
                                millisecond
                                :time="time"
                                format="DD天 HH:mm:ss")
                        p )
                    .block__fight--bottom {{subscribeButton}}
    

           
    
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import FightFund from './components/fight-fund.vue'
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
import {
    getGroupAction,
    // getGroupOrder,
    getAdGroupOrders,
    addGroupFollow
} from '@/service/zt-group-apiserver.js'
import { getSource } from '@/service/customer-relationship-server'
import LS from '@/utils/local-storage'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { getFundPositionV2 } from '@/service/finance-server.js'
import { getFundUserInfo } from '@/service/user-server.js'
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
            aloneScribe: '独自认购',
            togetherScribe: '[同行认购]',
            Surplus: '剩余',
            describe: '还差5人,申购费最高可返50%',
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
                '以上资料来源于基金公司及第三方数据商，相关数据仅供参考本页面非任何法律文件，投资前请阅读基金合同，招募说明书基金过往业绩不预示未来表现不构成投资建议，市场有风险投资需谨慎',
            describe3: '拼团成功，团队规模3人，尊享70%申购费返还'
        },
        zhCHT: {
            aloneScribe: '獨自認購',
            togetherScribe: '「同行」認購',
            Surplus: '剩餘',
            describe: '還差5人，最高可享申購費50%折扣',
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
                '以上資料基金會基金公司及第三方數據商，相關數據另有參考本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書基金過往業績不預示未來表現不構成投資建議，市場有風險投資需謹慎',
            describe3: '3人「同行」成功，尊享70%申購費折扣'
        },
        en: {
            aloneScribe: 'Subscribe',
            togetherScribe: 'Subs. with Group Discount',
            Surplus: 'Remaining',
            describe:
                'X people needed to get the 50% discounton subscription fee.',
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
                'The above information comes from the fund company and third-party data provides.This page is not a legal document. Please read the fund contract and prospectus before investing.Past performance is not indicative of future performance.All investments involve risk. Investors should consult all available information，before making any investment strategy.',
            describe3:
                'You entitled Group Discount, you will get Y% discount on subscription fee.'
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
        CountDown,
        fundSurvey,
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
            swipeShow: false,
            shareHeaderShow: true,
            figthComeShow: false,
            figthBtnShow: true,
            fightShow: true,
            contentmsg: '',
            time: 30 * 60 * 60 * 1000,
            code: '',
            has_joined: true,
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
            actionInfo: {},
            orderList: [],
            actionId: '',
            userList: [],
            group_id: null,
            discount: null,
            subscribeButton: null,
            applyAfter: null,
            differenceNumer: 5,
            avatImg: require('@/assets/img/fund/share/avat.png'),
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
        async addGroupFollow() {
            try {
                if (this.$route.query.group_id && this.$route.query.order_id) {
                    await addGroupFollow({
                        group_id: +this.$route.query.group_id,
                        invite_order_id: this.$route.query.order_id
                    })
                }
            } catch (e) {
                console.log('addGroupFollowError: ', e)
            }
        },
        //获取拼团广告订单
        async getAdGroupOrders() {
            try {
                const { order_list } = await getAdGroupOrders({
                    limit: 10,
                    action_id: this.actionId
                })
                if (order_list.length > 0) {
                    this.swipeShow = true
                }
                let tempArr = []
                order_list.forEach((e, i) => {
                    tempArr.push({
                        headImg:
                            e.user_info.head_img ||
                            require('@/assets/img/fund/share/avat.png'),
                        nickName: e.user_info.nick_name,
                        order_count: e.group.order_count,
                        discribe: this.$t([
                            `拼团成功，团队规模${
                                e.group.order_count
                            }人，尊享${100 -
                                JSON.parse(e.action.rule_detail).rule_list[
                                    JSON.parse(e.action.rule_detail).rule_list
                                        .length - 1
                                ].discount}%申购费返还`,
                            `${e.group.order_count}人「同行」成功，尊享${100 -
                                JSON.parse(e.action.rule_detail).rule_list[
                                    JSON.parse(e.action.rule_detail).rule_list
                                        .length - 1
                                ].discount}%申購費折扣`,
                            `You entitled Group Discount, you will get ${100 -
                                JSON.parse(e.action.rule_detail).rule_list[
                                    JSON.parse(e.action.rule_detail).rule_list
                                        .length - 1
                                ].discount}% discount on subscription fee.`
                        ]),
                        rule_detail: JSON.parse(e.action.rule_detail).rule_list[
                            JSON.parse(e.action.rule_detail).rule_list.length -
                                1
                        ].discount
                    })
                    if (
                        tempArr.length === 2 ||
                        i === (order_list || []).length - 1
                    ) {
                        this.userList.push(tempArr)
                        tempArr = []
                    }
                })
            } catch (e) {
                console.log('getGroupOrder:error:>>>', e)
            }
        },
        //查询团购单的订单
        // async getGroupOrder() {
        //     try {
        //         if (!this.$route.query.group_id) return
        //         const { order_list } = await getGroupOrder({
        //             group_id: this.$route.query.group_id
        //         })
        //         this.orderList = order_list || []

        // this.orderList.map(item => {
        //     if (item.user_info.is_invite_user) {
        //         this.avatImg = item.head_img
        //         alert(123)
        //     }
        // })
        //     } catch (e) {
        //         console.log('getGroupOrder:error:>>>', e)
        //     }
        // },
        //查询业务团购活动
        async getGroupAction() {
            try {
                const res = await getGroupAction({
                    biz_id: this.id,
                    biz_type: 0,
                    action_status: 2,
                    group_id: this.$route.query.group_id
                })

                this.orderList = res.order_list || []

                this.orderList.map(item => {
                    if (item.user_info.is_invite_user) {
                        this.group_id = item.group_order.group_id
                        this.avatImg = item.user_info.head_img
                    }
                })
                if (res !== null && res.action.status === 3) {
                    this.fightShow = false
                }

                if (res.order_list.length > 0 && !res.has_joined) {
                    this.figthBtnShow = true
                    this.figthComeShow = true
                }
                if (
                    res.order_list.length < 1 &&
                    this.$route.query.from != 'appOutside'
                ) {
                    this.shareHeaderShow = false
                }
                if (
                    this.$route.query.from === 'appOutside' &&
                    !res.has_joined
                ) {
                    this.figthBtnShow = false
                    this.figthComeShow = false
                }
                if (this.$route.query.from === 'appOutside' && res.has_joined) {
                    this.figthBtnShow = true
                    this.figthComeShow = false
                }
                this.actionInfo = res.action
                if (res.action && res.action.rule_detail) {
                    res.action.rule_detail = JSON.parse(res.action.rule_detail)
                    this.differenceNumer =
                        this.actionInfo.rule_detail.rule_list[0]
                            .start_user_count - this.orderList.length
                    //已满足团但是没满足团设置最大人数
                    if (this.differenceNumer < 1) {
                        this.differenceNumer =
                            this.actionInfo.rule_detail.most_user -
                            this.orderList.length
                        if (this.differenceNumer >= 1) {
                            this.contentmsg = `还剩${this.differenceNumer}人成团`
                        }
                    } else {
                        this.contentmsg = `还剩${this.differenceNumer}人成团`
                    }
                    this.discount =
                        res.action.rule_detail.rule_list[
                            res.action.rule_detail.rule_list.length - 1
                        ].discount

                    //未满足团
                    if (this.differenceNumer > 1) {
                        this.subscribeButton = this.$t([
                            `还差${this.differenceNumer}人,申购费最高可返${100 -
                                this.discount}%`,
                            `還差${
                                this.differenceNumer
                            }人，最高可享申購費${100 - this.discount}%折扣`,
                            `${
                                this.differenceNumer
                            } people needed to get the ${100 -
                                this.discount}% discounton subscription fee.`
                        ])
                    }

                    this.applyAfter = this.$t([
                        `认购后，好友参与[同行优惠]，最多可省${100 -
                            this.discount}%的认购费`,
                        `認購後，好友參與「同行優惠」，最享${100 -
                            this.discount}%認購費折扣`,
                        `Share the Group Discount offer to your friends, you can get up to ${100 -
                            this.discount}% discount on the subscription fee.`
                    ])
                    this.actionInfo.describeDiscount = this.$t([
                        `拼团成功，根据团队规模最高可返${100 -
                            this.discount}%申购费`,
                        `「同行」成功，根據團隊規模最高可享申購費${100 -
                            this.discount}%折扣`,
                        `You entitled Group Discount,Up to ${100 -
                            this
                                .discount}% discount on handling fee if you meet the Group Discount requirement.`
                    ])
                }
                this.time = (res.action.action_end_time - res.unix_time) * 1000
                this.actionId = res.action.action_id
            } catch (e) {
                console.log('getGroupAction:error:>>>', e)
            }
        },
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
                    this.timeList[key].value = (res[key] * 100).toFixed(2)
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
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                //白名单
                let isWhiteUserBit = this.userInfo.grayStatusBit
                    .toString(2)
                    .split('')
                    .reverse()
                    .join('')[5]
                if (!isWhiteUserBit) {
                    this.isGroup = true
                    return
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
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
        async handleBuyOrSell(params) {
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
            if (params === 3) {
                LS.put('groupId', this.$route.query.group_id || this.group_id)
            }
            if (params === 2) {
                LS.put('groupId', 0)
            }
            if (params === 4) {
                LS.put('groupId', this.$route.query.group_id || 0)
            }
            if (params === 1) {
                LS.remove('groupId')
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
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
                if (!this.isLogin) {
                    this.code = this.appType.Hk ? 2 : 1
                }
            } catch (e) {
                this.$toast(e.msg)
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
        await this.getGroupAction()
        this.getAdGroupOrders()
        // this.getGroupOrder()
        if (this.isLogin) {
            await this.getFundUserInfo()
            this.addGroupFollow()
        }
        this.getSource()
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
.fund-footer-hk {
    .block__list--header-hk {
        background: rgba(0, 145, 255, 0.05);
        display: flex;
        flex-direction: row;
        padding: 6px 18px 0 18px;
        height: 62px;
        .block__footer-left {
            width: 60%;
            font-size: 13px;
            padding: 5px 0 0 0;
        }
        .block__footer-right {
            width: 100px;
            height: 30px;

            .van-button {
                width: 100% !important;
                border-radius: 5px !important;
                line-height: 30px;
                margin: 10px 0 0 20px;
                background: #1e93f3;
                font-size: 10px;
                color: #fff;
                height: 100% !important;
            }
        }
    }
    .block__fight--btn-hk {
        height: 65px;
        display: flex;
        flex-direction: row;
        background: linear-gradient(
            153deg,
            rgba(14, 192, 241, 1) 0%,
            rgba(83, 90, 240, 1) 100%
        );
        .block__fight--left {
            // width: 30%;
            img {
                width: 40px;
                height: 40px;
                border-radius: 40px;
                margin: 12px 30px 12px 12px;
                // border: 1px solid red;
            }
        }
        .block__fight--right {
            display: flex;
            width: 70%;
            flex-direction: column;
            color: #fff;
            align-items: item;
            .block__fight--top {
                width: 100%;
                display: flex;
                margin: 10px 0 0px 0;
                font-size: 16px;
                justify-content: center;
                flex-direction: row;
                text-align: center;
                .van-count-down {
                    color: #fff;
                    font-size: 18px;
                    margin: 2px 3px 0 3px;
                }
            }
            .block__fight--bottom {
                width: 100%;
                display: flex;
                justify-content: center;
                flex-direction: row;
                text-align: center;
            }
        }
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
    .button-width1 {
        width: 50%;
    }
    .fund-footer {
        background: $primary-color;
    }
    .fund-footer1 {
        background: #ea3d3d;
    }
    .fund-footer2 {
        background: #c7c7c7;
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
        // background: #ea3d3d;
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
    .block__fight--btn1 {
        width: 100%;
        height: 48px;
        display: flex;
        background: #ea3d3d;
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
        background: #fef5f5;
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
                margin: 0 6px;
                font-family: yxFontDINPro-Medium;
                color: rgba(234, 61, 61, 1);
                line-height: 24px;
            }
        }
        .block__footer-avat {
            margin: 0 10px 0 0;
            img {
                width: 40px;
                border-radius: 40px;
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
