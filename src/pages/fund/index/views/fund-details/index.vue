<template lang="pug">
.fund-details
    .fund-content(slot="main" ref="content")
        fundDetailsHeader(
            :price="price"
            :revenue="revenue"
            :tagShow="tagShow"
            :tagsShow="tagsShow"
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

        FightFundHk(
            v-if="!fightShow && code ===2"
            :userList="userList"
            :swipeShow="swipeShow"
            :actionInfo = "actionInfo") 

        FightFund(
            v-if="!fightShow && code === 1"
            :userList="userList"
            :swipeShow="swipeShow"
            :actionInfo = "actionInfo")   

        .block__fundheader--tips(
            v-if="isLogin"
            @click="toRouterGenerator('/order-record')")
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
            p {{$t('msg1')}}
            p {{$t('msg2')}}
    .fund__block--btn(v-if="!loading")
        .fund-footer-content(v-if="RedemptionButton")
            span.btn.button-width.fund-footer-tip(v-if="showPositionInfo && subscribeFeeVO.defaultFeeRate && subscribeFeeVO.fundFeeLevelVOList.length && (Number(subscribeFeeVO.fundFeeLevelVOList[0] && subscribeFeeVO.fundFeeLevelVOList[0].feeRate)<Number(subscribeFeeVO.defaultFeeRate))" disabled) {{`${$t('subscriptionFee')}：`}}{{discountRate}}
                span （
                s {{defaultRate}}
                span ）
            .fund-block--content
                .btn.colorbg.button-5width.btn-inverster(
                        :class="[investmentShow? 'fund-footer':'fund-no']"
                        @click="handleBuyOrSell(4)")
                        span(:class="[subscribeFeeVO.fundFeeLevelVOList[0].feeRate != 0 &&(fundFixedFeeVO.  feeDiscount*100) != 0?'span-lineHeight':'span-lineHeight1']") {{$t('A2')}}
                        em(v-if="subscribeFeeVO.fundFeeLevelVOList[0].feeRate != 0 &&(fundFixedFeeVO.feeDiscount*100) != 0") 享申购费{{100-(fundFixedFeeVO.feeDiscount*100)}}%
                van-button.button-5width.button-left.btn(
                    :class="[flag?'fund-check':'fund-no']" 
                    @click="toRouter('/fund-redemption')") {{$t('redeem')}}
                van-button.btn.button-5width(
                    :class="[flag1?'fund-buy':'fund-no']" 
                    @click="toRouter('/fund-subscribe')") {{$t('append')}}

        .fund-footer-content(v-if="!RedemptionButton && this.btnShow")
            span.btn.button-width.fund-footer-tip(v-if="showPositionInfo && subscribeFeeVO.defaultFeeRate && subscribeFeeVO.fundFeeLevelVOList.length && (Number(subscribeFeeVO.fundFeeLevelVOList[0].feeRate)<Number(subscribeFeeVO.defaultFeeRate))" disabled) {{`${$t('subscriptionFee')}：`}}{{discountRate}}
                span （
                s {{defaultRate}}
                span ）
            .fund-block--content
                van-button.button-6width.button-left.btn(
                    :class="[flag?'fund-check':'fund-no']" 
                    @click="toRouter('/fund-redemption')") {{$t('redeem')}}
                van-button.btn.button-6width(
                    :class="[flag1?'fund-buy':'fund-no']" 
                    @click="toRouter('/fund-subscribe')") {{$t('append')}}

        
        .fund-footer-content(v-if="PurchaseButton")
            span.btn.button-width.fund-footer-tip(v-if="showPositionInfo && subscribeFeeVO.defaultFeeRate && subscribeFeeVO.fundFeeLevelVOList.length && (Number(subscribeFeeVO.fundFeeLevelVOList[0] && subscribeFeeVO.fundFeeLevelVOList[0].feeRate)<Number(subscribeFeeVO.defaultFeeRate))" disabled) {{`${$t('subscriptionFee')}：`}}{{discountRate}}
                span （
                s {{defaultRate}}
                span ）
            .block__button--list
                .btn.colorbg.button-width1.btn-inverster(
                    :class="[investmentShow? 'fund-footer':'fund-no']"
                    @click="handleBuyOrSell(4)")
                    span(:class="[subscribeFeeVO.fundFeeLevelVOList[0] && subscribeFeeVO.fundFeeLevelVOList[0].feeRate != 0 &&(fundFixedFeeVO.feeDiscount*100) != 0?'span-lineHeight':'span-lineHeight1']") {{$t('A2')}}
                    em(v-if="subscribeFeeVO.fundFeeLevelVOList[0] && subscribeFeeVO.fundFeeLevelVOList[0].feeRate != 0 &&(fundFixedFeeVO.feeDiscount*100) != 0") 享申购费{{100-(fundFixedFeeVO.feeDiscount*100)}}%
                van-button.btn.button-width1(
                    :class="[flag2? 'fund-footer':'fund-no']"
                    @click="handleBuyOrSell(1)") {{code === 1 ? $t('buy'):$t('buyHk')}}

        .fund-footer-content(v-if="!PurchaseButton && !this.btnShow")
            span.btn.button-width.fund-footer-tip(v-if="showPositionInfo && subscribeFeeVO.defaultFeeRate && subscribeFeeVO.fundFeeLevelVOList.length && (Number(subscribeFeeVO.fundFeeLevelVOList[0] && subscribeFeeVO.fundFeeLevelVOList[0].feeRate)<Number(subscribeFeeVO.defaultFeeRate))" disabled) {{`${$t('subscriptionFee')}：`}}{{discountRate}}
                span （
                s {{defaultRate}}
                span ）
            van-button.btn.button-width(
                :class="[flag2? 'fund-footer':'fund-no']"
                @click="handleBuyOrSell(1)") {{code === 1 ? $t('buy'):$t('buyHk')}}

        .fund-footer-contentShare(v-if="invate === 'share'")
            van-button(
                class="fund-footer btn button-width"
                @click="handleShare()") {{$t(['APP中打开','APP中打開','Open uSAMRT'])}}

        .fund-footer-content(
            v-if="chsFightButton")
            .block__list--header(v-if="shareHeaderShow")
                .block__footer-avat
                    img(:src="avatImg") 
                .block__footer--content
                    .block__footer--bottom {{contentmsg}}
                    .block__footer--top
                        span 剩余
                        .vant-count-down
                            CountDown( 
                                millisecond
                                :time="time"
                                format="DD天 HH:mm:ss")
                    
                .block__footer-right(v-if="figthComeShow")
                    van-button(
                        @click="handleBuyOrSell(3)"
                        :disabled="differenceNumer === 0") {{differenceNumer === 0 ? '已成团' : '参与拼团'}}
            .block__button--list(v-if="figthBtnShow")
                van-button(
                    class="fund-footer btn button-width1"
                    @click="handleBuyOrSell(1)" 
                    :class="[flag2 ? 'fund-footer':'fund-no']") {{$t('buy')}}
                .block__fight--btn.btn(
                    :class="[flag2 ?'fund-footer1':'fund-footer2']" 
                    @click="handleBuyOrSell(2)")
                    span 发起拼团申购
                    em 申购费最高可返{{100-discount}}%
            .block__button--list(v-if="!figthBtnShow")
                .block__fight--btn1.btn(@click="handleBuyOrSell(3)")
                    span 参与拼团申购
                    em 申购费最高可返{{100-discount}}%

        .fund-footer-content.fund-footer-hk(
            v-if="chtFightButton")
            .block__list--header-hk(v-if="subscribeButtonShow")
                .block__footer-left
                p {{applyAfter}}
                .block__footer-right
                    van-button(
                        class="van-button"
                        @click="handleBuyOrSell(2)") {{$t('aloneScribe')}}
            .block__button--list-hk(v-if="subscribeButtonShow")
                .block__fight--btn-hk( @click="handleBuyOrSell(3)")
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
                                    :format="$t('format')")
                            p )
                        .block__fight--bottom {{subscribeButtonHk}}
            .block__button--list-hk(v-if="!subscribeButtonShow")
                .block__buy-hk
                    van-button(
                        class="btn"
                        @click="handleBuyOrSell(2)") {{$t('Subscribenow')}}

    img(
        v-show="false"
        :src="shareIcon"
        ref="titlebarIcon")
           
    
</template>
<script>
import NP from 'number-precision'
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import FightFund from './components/fight-fund.vue'
import FightFundHk from './components/fight-fund-hk.vue'
import fundSurvey from './components/fund-survey'
import fundTradingRules from './components/fund-trading-rules'
import fundCardList from './components/fund-card-list'
import scheme from '@/utils/scheme'
import env from '@/utils/scheme/env'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundPerformanceHistory,
    getFundApyPointV1,
    getFundNetPriceHistoryV1,
    getFundRecommendList,
    getFundFeeConfigV1
} from '@/service/finance-info-server.js'
import {
    getGroupAction,
    getGroupOrder,
    getAdGroupOrders,
    addGroupFollow,
    checkWhetherGroup
} from '@/service/zt-group-apiserver.js'
import { getSource } from '@/service/customer-relationship-server'
import LS from '@/utils/local-storage'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { getFundPositionV2 } from '@/service/finance-server.js'
import { getFundUserInfo } from '@/service/user-server.js'
import { Button, Dialog } from 'vant'
import { getShortUrl } from '@/service/news-shorturl.js'
import jsBridge from '@/utils/js-bridge'
import { browseFundDetails, clickFundDetails } from '@/utils/burying-point'
import { mapGetters } from 'vuex'
import { debounce } from '@/utils/tools.js'
import { CountDown } from 'vant-fork'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            format: 'DD天 HH:mm:ss',
            aloneScribe: '独自申购',
            togetherScribe: '[同行申购]',
            Surplus: '剩余',
            describe: '还差5人,申购费最高可返50%',
            subscriptionFee: '申购费',
            buy: '申购',
            buyHk: '申购',
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
            msg1:
                '*本页面资料来源于基金管理公司、基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,友信对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。',
            msg2:
                '相关数据仅供参考，本页面非任何法律文件，投资前请阅读基金合同，招募说明书。基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。',
            describe3: '拼团成功，团队规模3人，尊享70%申购费返还',
            Subscribenow: '立即认购'
        },
        zhCHT: {
            format: 'DD天 HH:mm:ss',
            aloneScribe: '獨自認購',
            togetherScribe: '「同行」認購',
            Surplus: '剩餘',
            describe: '還差5人，最高可享申購費50%折扣',
            subscriptionFee: '申購費',
            buy: '申購',
            buyHk: '認購',
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
            msg1:
                '*本頁面資料來源於基金管理公司、基金服務提供供應商。所有數據截至最新淨值日期（除特殊標註外）,友信對基金的業績表現計算是按該時期的資產淨值、相關類別貨幣計算。如有未顯示年度/時期的表現，則指該年度/時期未有足夠資料計算。',
            msg2:
                '相關數據僅供參考，本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書。基金過往業績不預示未來表現，不構成投資建議，市場有風險,投資需謹慎。',
            describe3: '3人「同行」成功，尊享70%申購費折扣',
            Subscribenow: '立即認購'
        },
        en: {
            format: 'DDD HH:mm:ss',
            aloneScribe: 'Subscribe',
            togetherScribe: 'Susb. with Group',
            Surplus: '',
            describe:
                'X people needed to get the 50% discounton subscription fee.',
            subscriptionFee: 'Subs. Fee',
            buy: 'Subscribe',
            buyHk: 'Subscribe',
            redeem: 'Redemption',
            risk: 'Risk Disclosure',
            trade: 'Transaction Records',
            append: 'Incremental',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade',
            timeTranslation: {
                oneWeek: 'Last 1-Week',
                oneMonth: 'Last 1-Month',
                threeMonth: 'Last 3-Month',
                sixMonth: 'Last 6-Month',
                oneYear: 'Last 1-Year',
                twoYear: 'Last 2-Year',
                threeYear: 'Last 3-Year',
                fiveYear: 'Last 5-Year',
                all: 'Since Inception'
            },
            msg1:
                "* The information on this page comes from fund management companies and fund service providers. All data are up to the date of the latest net worth (unless otherwise specified). uSMART calculates the fund's performance on a NAV-to-NAV basis in the relevant share class currency. Whenever there is no past performance shown, no sufficient data available in that year to calculate performance.",
            msg2:
                'The relevant data is for reference only. This page is not a legal document. Please carefully read the fund’s prospectus before investing. Past performance is not an indicator of future performance. All investments involve risk. Investors should consider all available information before making any investment decisions.',
            describe3:
                'You entitled Group Discount, you will get Y% discount on subscription fee.',
            Subscribenow: 'Subscribe now'
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
        fundTradingRules,
        FightFundHk
    },
    computed: {
        RedemptionButton() {
            /*
             * btnShow 是否持仓
             * isGrayAuthority 灰度
             * invate 是否是邀请
             */
            return (
                this.btnShow &&
                this.isGrayAuthority &&
                this.invate !== 'share' &&
                !this.investmentWhiteBit
            )
        },
        /*
         * fightShow 是否拼团
         * isGrayAuthority 灰度
         * invate 是否是邀请
         */
        PurchaseButton() {
            return (
                !this.btnShow &&
                this.isGrayAuthority &&
                !this.userInfo.orgEmailLoginFlag &&
                this.fightShow &&
                this.invate !== 'share' &&
                !this.investmentWhiteBit
            )
        },
        chsFightButton() {
            return (
                !this.btnShow &&
                this.isGrayAuthority &&
                !this.userInfo.orgEmailLoginFlag &&
                !this.fightShow &&
                this.code == 1 &&
                this.invate !== 'share'
            )
        },
        chtFightButton() {
            return (
                !this.btnShow &&
                this.isGrayAuthority &&
                !this.userInfo.orgEmailLoginFlag &&
                !this.fightShow &&
                this.code == 2 &&
                this.invate !== 'share'
            )
        },
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['isLogin', 'appType', 'openedAccount', 'lang']),
        showPositionInfo() {
            // 登陆且已开户才展示持仓信息
            return this.isLogin && this.openedAccount
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
        },
        defaultRate() {
            console.log(
                NP.times(+this.subscribeFeeVO.defaultFeeRate, 100),
                '默认费率'
            )
            return `${NP.times(
                +this.subscribeFeeVO.defaultFeeRate,
                100
            ).toFixed(2)}%`
        },
        discountRate() {
            return `${(
                this.subscribeFeeVO.fundFeeLevelVOList[0].feeRate * 100
            ).toFixed(2)}%`
        }
    },
    data() {
        return {
            loading: true,
            swipeShow: false,
            shareHeaderShow: true,
            figthComeShow: false,
            figthBtnShow: true,
            fightShow: true,
            contentmsg: '',
            time: 30 * 60 * 60 * 1000,
            code: null,
            has_joined: true,
            tagsShow: false,
            tagShow: false,
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
            fundFixedFeeVO: {},
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
            subscribeFeeVO: {
                defaultFeeRate: 0,
                fundFeeLevelVOList: []
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
            revenue: '',
            step: 0,
            forbidPrompt: '',
            actionInfo: {},
            orderList: [],
            actionId: '',
            userList: [],
            group_id: null,
            discount: null,
            subscribeButton: null,
            subscribeButtonHk: null,
            subscribeButtonShow: false,
            applyAfter: null,
            differenceNumer: 5,
            avatImg: require('@/assets/img/fund/share/avat.png'),
            invate: this.$route.query.type,
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
            },
            shareIcon: require('@/assets/img/fund/icon/icon-share.png'),
            investmentShow: true,
            investmentWhiteBit: true
        }
    },
    methods: {
        handleShare() {
            scheme.gotoWebview(
                `${window.location.origin}/wealth/fund/index.html?appType=${
                    this.appType.Ch ? 1 : 2
                }#/fund-details?id=${this.$route.query.id}`
            )
        },
        async getFundFeeConfig() {
            try {
                let params = {
                    fundId: this.$route.query.id || this.id
                }
                let {
                    subscribeFeeVO,
                    fundFixedFeeVO
                } = await getFundFeeConfigV1(params)
                this.fundFixedFeeVO = fundFixedFeeVO
                this.subscribeFeeVO.defaultFeeRate = subscribeFeeVO.defaultFeeRate
                    ? subscribeFeeVO.defaultFeeRate
                    : ''
                this.subscribeFeeVO.fundFeeLevelVOList = subscribeFeeVO.fundFeeLevelVOList
                    ? subscribeFeeVO.fundFeeLevelVOList
                    : []
            } catch (e) {
                console.log('getFundFeeConfigV1: ', e)
            }
        },
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
                    let discribe, discribeHk
                    let rule_detail = JSON.parse(e.action.rule_detail)
                    let num =
                        rule_detail.rule_list[0].start_user_count -
                        e.group.order_count
                    if (num > 0) {
                        discribe = this.$t([
                            `拼团申购中，还差${num}人成团 `,
                            `同行認購中，還差${num}人成團 `,
                            `${num}people needed for the Group Discount Subscription`
                        ])
                        discribeHk = this.$t([
                            `同行申购中，还差${num}人成团 `,
                            `同行認購中，還差${num}人成團 `,
                            `${num} people needed for the Group Discount Subscription`
                        ])
                    } else {
                        let discount
                        rule_detail.rule_list.map(item => {
                            if (e.group.order_count >= item.start_user_count) {
                                discount = item.discount
                            }
                        })
                        discribe = this.$t([
                            `拼团成功，团队规模${
                                e.group.order_count
                            }人，尊享${100 - discount}%申购费返还`,
                            `${e.group.order_count}人「同行」成功，尊享${100 -
                                discount}%申購費折扣`,
                            `You entitled Group Discount, you will get ${100 -
                                discount}% discount on subscription fee.`
                        ])
                        discribeHk = this.$t([
                            `${
                                e.group.order_count
                            }人同行成功，尊享申购费${discount / 10}折扣 `,
                            `${
                                e.group.order_count
                            }人同行成功，尊享認購費${discount / 10}折 `,
                            `Groups with ${e.group.order_count} ppl, ${100 -
                                discount}% discount on subs. fee`
                        ])
                    }
                    tempArr.push({
                        headImg:
                            e.user_info.head_img ||
                            require('@/assets/img/fund/share/avat.png'),
                        nickName: e.user_info.nick_name,
                        order_count: e.group.order_count,
                        discribe: discribe,
                        discribeHk: discribeHk,
                        rule_detail:
                            rule_detail.rule_list[
                                rule_detail.rule_list.length - 1
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
        async getGroupOrder() {
            try {
                if (!this.$route.query.group_id) return
                const { order_list } = await getGroupOrder({
                    group_id: this.$route.query.group_id
                })
                this.orderList = order_list || []

                this.orderList.map(item => {
                    if (item.user_info.is_invite_user) {
                        this.avatImg = item.head_img
                    }
                })
            } catch (e) {
                console.log('getGroupOrder:error:>>>', e)
            }
        },
        //查询业务团购活动
        async getGroupAction() {
            try {
                const res = await getGroupAction({
                    biz_id: this.id,
                    biz_type: 0,
                    action_status: 2
                })

                if (res.group) {
                    this.group_id = res.group.group_id
                }
                this.orderList = res.order_list || []
                this.orderList.map(item => {
                    if (item.user_info.is_invite_user) {
                        // this.group_id = item.group_order.group_id
                        this.avatImg =
                            item.user_info.head_img ||
                            require('@/assets/img/fund/share/avat.png')
                    }
                })
                if (res !== null && res.action.status === 3) {
                    this.fightShow = false
                }
                if (this.$route.query.group_id) {
                    const data = await checkWhetherGroup({
                        group_id: this.$route.query.group_id
                    })
                    if (data.flag) {
                        this.fightShow = true
                    }
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
                            this.contentmsg = `已${this.orderList.length}人成团`
                        }
                    } else {
                        this.contentmsg = `差${this.differenceNumer}人成团`
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
                    if (this.orderList.length > 0 && !res.has_joined) {
                        this.subscribeButtonShow = true
                        this.subscribeButtonHk = this.$t([
                            `立即享申购费低至${this.discount / 10}折`,
                            `立即享認購費低至${this.discount / 10}折`,
                            `Up to ${100 -
                                this.discount}% discount on subs. fee`
                        ])
                    } else {
                        this.subscribeButtonShow = false
                    }
                    this.applyAfter = this.$t([
                        `申购后，好友参与[同行优惠]，可享申购费低至${this
                            .discount / 10}折`,
                        `認購後，好友參與「同行優惠」，可享認購費低至${this
                            .discount / 10}折`,
                        `Share with friends, up to ${100 -
                            this.discount}% discount on subs. fee`
                    ])
                    this.actionInfo.describeDiscount = this.$t([
                        `拼团成功，根据团队规模最高可返${100 -
                            this.discount}%申购费`,
                        `「同行」成功，根據團隊規模最高可享申購費${100 -
                            this.discount}%折扣`,
                        `If you meet the Group Discount requirements, you can get up to ${100 -
                            this
                                .discount}% discount on subs. fee. depending on the group size.`
                    ])
                    this.actionInfo.describeDiscountHk = this.$t([
                        `「同行」成功后，根据团队人数最多可享申购费${this
                            .discount / 10}折`,
                        `「同行」成功後，根據團隊人數最多可享認購費${this
                            .discount / 10}折`,
                        `If you meet the Group Discount requirements, you can get up to ${100 -
                            this
                                .discount}% discount on subs. fee. depending on the group size.`
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
                        list[list.length - 1].revenue = '0.00' // 最后一项涨跌幅无法则算为0
                    } else {
                        if (Number(list[index + 1].netPrice) !== 0) {
                            item.price =
                                ((list[index].netPrice -
                                    list[index + 1].netPrice) /
                                    list[index + 1].netPrice) *
                                100
                            item.price =
                                this.fundHeaderInfoVO.assetType != 4
                                    ? Number(item.price).toFixed(2)
                                    : Number(item.price).toFixed(4)
                            item.revenue = Number(
                                Number(item.price).toFixed(4) * 100
                            ).toFixed(2)
                        } else {
                            item.price = '0.00'
                        }
                    }
                })
                this.price = list[0].price
                this.revenue = list[0].revenue
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
                let investmentUserBit = this.userInfo.grayStatusBit
                    .toString(2)
                    .split('')
                    .reverse()
                    .join('')[9]
                if (investmentUserBit === '1') {
                    this.investmentWhiteBit = false
                }
                if (!isWhiteUserBit) {
                    this.fightShow = true
                    return
                } else {
                    await this.addGroupFollow()
                    await this.getGroupAction()
                    this.getGroupOrder()
                    this.getAdGroupOrders()
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        //跳转
        toRouter(routerPath) {
            if (routerPath == '/fund-subscribe') {
                this.handleBuyOrSell(1)
            } else if (routerPath == '/fixed-investment') {
                if (!this.investmentShow) return this.$toast(this.forbidPrompt)
                this.handleBuyOrSell(4)
            } else {
                if (!this.flag) return this.$toast(this.forbidPrompt)
                let url = `${window.location.origin}/wealth/fund/index.html#${routerPath}?id=${this.id}&currencyType=${this.fundTradeInfoVO.currency.type}`
                jumpUrl(3, url)
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
                this.fundHeaderInfoVO.derivativeType =
                    res.fundOverviewInfoVO.derivativeType
                this.fundCode = this.fundHeaderInfoVO.fundCode
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
                // alert(this.fundOverviewInfoVO.tradeAuth & 4)
                //是否开启定投
                this.investmentShow =
                    (this.fundOverviewInfoVO.tradeAuth & 4) > 0 ? true : false
                //合规信息
                this.tagShow = this.fundHeaderInfoVO.derivativeType !== 1
                this.tagsShow = this.fundHeaderInfoVO.derivativeType !== 3
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
            if (!this.flag2 || !this.flag1)
                return this.$toast(this.forbidPrompt)

            //定投提示
            if (!this.investmentShow && params === 4) {
                return this.$toast(this.forbidPrompt)
            }

            //拼团埋点描述
            let fundDesc = params === 1 ? '申购' : '拼团'
            clickFundDetails(
                'fund_detail',
                fundDesc,
                this.fundHeaderInfoVO.fundId,
                this.fundHeaderInfoVO.fundName
            )

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
            if (params === 1 || params === 4) {
                LS.remove('groupId')
            }
            if (
                !this.userInfo.assessResult ||
                new Date().getTime() >
                    new Date(this.userInfo.validTime).getTime()
            ) {
                let url = `${window.location.origin}/wealth/fund/index.html#/risk-assessment?id=${this.id}&fundRiskType=${this.fundRiskType}&currencyType=${this.fundTradeInfoVO.currency.type}&code=${params}`
                jumpUrl(3, url)
                return
            } else {
                if (
                    this.userInfo.assessResult <
                    this.fundHeaderInfoVO.fundRiskType
                ) {
                    if (this.userInfo.damagedStatus === 1) {
                        let url = `${window.location.origin}/wealth/fund/index.html#/risk-assessment-result?id=${this.id}&fundRiskType=${this.fundRiskType}&code=${params}`
                        jumpUrl(3, url)
                        return
                    }
                    if (
                        this.fundHeaderInfoVO.derivativeType === 2 ||
                        this.fundHeaderInfoVO.derivativeType === 3
                    ) {
                        let url = `${window.location.origin}/wealth/fund/index.html#/risk-appropriate-result?id=${this.id}&fundRiskType=${this.fundRiskType}&code=${params}`
                        jumpUrl(3, url)
                        return
                    }
                    if (this.fundHeaderInfoVO.derivativeType === 1) {
                        let riskTipContent = this.$t([
                            `该产品为${this.fundHeaderInfoVO.fundRisk}（R${
                                this.fundHeaderInfoVO.fundRiskType
                            }），超出您当前的风险承受能力${
                                this.$t('resultList')[
                                    this.userInfo.assessResult
                                ].riskStyle
                            }（A${
                                this.userInfo.assessResult
                            }）。点击继续操作视为您确认自愿承担该产品风险，且友信并未主动向您推荐该产品`,
                            `該產品為${this.fundHeaderInfoVO.fundRisk}（R${
                                this.fundHeaderInfoVO.fundRiskType
                            }），超出您當前的風險承受能力${
                                this.$t('resultList')[
                                    this.userInfo.assessResult
                                ].riskStyle
                            }（A${
                                this.userInfo.assessResult
                            }）。點擊繼續操作視為您確認自願承擔該產品風險，且友信並未主動向您推薦該產品`,
                            `The risk level of this product is R${
                                this.fundHeaderInfoVO.fundRiskType
                            }(${
                                this.fundHeaderInfoVO.fundRisk
                            }), which exceeds your current risk tolerance is A${
                                this.userInfo.assessResult
                            }(${
                                this.$t('resultList')[
                                    this.userInfo.assessResult
                                ].riskStyle
                            }). Click Continue to operate as if you confirm that you voluntarily bear the risk of this product, and uSMART does not actively recommend this product to you.`
                        ])
                        this.$dialog
                            .confirm({
                                title: this.$t('riskTip'),
                                message: riskTipContent,
                                confirmButtonText: this.$t('continueButton'),
                                cancelButtonText: this.$t('cancelButton'),
                                confirmButtonColor: '#0D50D8',
                                cancelButtonColor: '#D1D1D1'
                            })
                            .then(() => {
                                let url
                                let extendStatusBit =
                                    this.userInfo.extendStatusBit & 16
                                if (extendStatusBit > 0) {
                                    if (params === 4) {
                                        url = `${window.location.origin}/wealth/fund/index.html#/fixed-investment?id=${this.id}&assessResult=${this.userInfo.assessResult}&currencyType=${this.fundTradeInfoVO.currency.type}&fundCode=${this.fundCode}`
                                    } else {
                                        url = `${window.location.origin}/wealth/fund/index.html#/fund-subscribe?id=${this.id}&assessResult=${this.userInfo.assessResult}&currencyType=${this.fundTradeInfoVO.currency.type}&fundCode=${this.fundCode}`
                                    }
                                } else {
                                    url = `${window.location.origin}/wealth/fund/index.html#/open-permissions?id=${this.id}&assessResult=${this.userInfo.assessResult}&currencyType=${this.fundTradeInfoVO.currency.type}&fundCode=${this.fundCode}`
                                }
                                jumpUrl(3, url)
                                // on confirm
                            })
                            .catch(() => {
                                return
                                // on cancel
                            })
                    }
                } else {
                    let url
                    let extendStatusBit = this.userInfo.extendStatusBit & 16
                    if (extendStatusBit > 0) {
                        if (params === 4) {
                            url = `${window.location.origin}/wealth/fund/index.html#/fixed-investment?id=${this.id}&assessResult=${this.userInfo.assessResult}&currencyType=${this.fundTradeInfoVO.currency.type}&fundCode=${this.fundCode}&code=${params}`
                        } else {
                            url = `${window.location.origin}/wealth/fund/index.html#/fund-subscribe?id=${this.id}&assessResult=${this.userInfo.assessResult}&currencyType=${this.fundTradeInfoVO.currency.type}&fundCode=${this.fundCode}&code=${params}`
                        }
                    } else {
                        url = `${window.location.origin}/wealth/fund/index.html#/open-permissions?id=${this.id}&assessResult=${this.userInfo.assessResult}&currencyType=${this.fundTradeInfoVO.currency.type}&fundCode=${this.fundCode}&code=${params}`
                    }
                    jumpUrl(3, url)
                }
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
            if (this.isLogin) {
                await this.getFundUserInfo()
            }
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
                this.fundHeaderInfoVO.code = code
                this.fundTradeInfoVO.code = code
                this.holdInitState.code = code
                if (!this.isLogin) {
                    this.code = this.appType.Hk ? 2 : 1
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //设置app分享按钮
        async setShareButton() {
            const base64 = this.$refs.titlebarIcon.src.replace(
                /^data:image\/(png|ico|jpe|jpeg|gif);base64,/,
                ''
            )
            jsBridge.callApp('command_set_titlebar_button', {
                position: 1, //position取值1、2
                clickCallback: 'handlerFundShare',
                type: 'custom_icon',
                custom_icon: base64
            })
        }
    },
    async created() {
        try {
            this.shareIcon = env.isMainlandBlack
                ? require('@/assets/img/fund/icon/icon-share.png')
                : require('@/assets/img/fund/icon/icon-share-hk.png')
            this.init18inState()
            await this.getFundDetail()
            await this.getFundPositionV2()
            this.getFundNetPriceHistoryV1()
            this.getFundRecommendList()
            this.getFundPerformanceHistory()
            this.getFundApyPointV1()
            if (this.isLogin) {
                this.getFundFeeConfig()
                await this.getFundUserInfo()
            }
        } finally {
            this.loading = false
        }
        this.getSource()
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        this.setShareButton()
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.appVisibleHandle, 100)
        //app点击分享按钮回调
        window.handlerFundShare = async () => {
            let langMun = {
                zhCHS: 1,
                zhCHT: 2,
                en: 3
            }
            let link = `${this.$appOrigin}/wealth/fund/index.html?langType=${
                langMun[this.lang]
            }&appType=${this.appType.Ch ? 1 : 2}&stockColorType=${
                this.stockColorType
            }#/fund-details?id=${this.id}&type=share`
            let pageUrl = `${
                window.location.origin
            }/wealth/fund/index.html?langType=${langMun[this.lang]}&appType=${
                this.appType.Ch ? 1 : 2
            }&stockColorType=${this.stockColorType}#/fund-details?id=${
                this.id
            }&type=share`
            try {
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                let shortPageUrl = await getShortUrl({
                    long: encodeURIComponent(pageUrl)
                })
                let tenKRTN
                let apy
                if (this.fundHeaderInfoVO.assetType === 4) {
                    tenKRTN = this.$t(['万元收益:', '萬元收益:', '10K RTN:'])
                    apy = this.revenue
                } else {
                    tenKRTN = this.$t([
                        '近一年涨跌幅:',
                        '近一年漲跌幅:',
                        'Past Year:'
                    ])
                    apy =
                        this.fundHeaderInfoVO.apy > 0
                            ? '+' + this.fundHeaderInfoVO.apy
                            : this.fundHeaderInfoVO.apy
                    apy =
                        this.fundHeaderInfoVO.assetType === 4
                            ? (apy * 100).toFixed(4)
                            : (apy * 100).toFixed(2)
                    apy = apy + '%'
                }
                const description = this.$t([
                    `${tenKRTN}${apy},基金规模:${
                        this.fundOverviewInfoVO.currency.name
                    } ${(this.fundOverviewInfoVO.fundSize / 100000000).toFixed(
                        2
                    )}亿,更新时间:${this.fundHeaderInfoVO.belongDay}`,
                    `${tenKRTN}${apy},基金規模:${
                        this.fundOverviewInfoVO.currency.name
                    } ${(this.fundOverviewInfoVO.fundSize / 100000000).toFixed(
                        2
                    )}億,更新時間:${this.fundHeaderInfoVO.belongDay}`,
                    `${tenKRTN}${apy},AUM:${
                        this.fundOverviewInfoVO.currency.name
                    } ${(this.fundOverviewInfoVO.fundSize / 1000000000).toFixed(
                        2
                    )}B,Update Time:${this.fundHeaderInfoVO.belongDay}`
                ])
                const title = `${this.fundHeaderInfoVO.fundName} ${this.fundHeaderInfoVO.isin}`
                jsBridge.callApp('command_share', {
                    shareType: 'freedom',
                    title: title,
                    description: description,
                    pageUrl: `${window.location.origin}/${shortPageUrl.url}`,
                    shortUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    overseaPageUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    thumbUrl: `${window.location.origin}/wealth/fund/iconShareImg.png`
                })
            } catch (e) {
                console.log(e)
            }
        }
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
        text-align: justify;
        color: #999999;
        margin-bottom: 10px;
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
                border-radius: 4px !important;
                line-height: 30px;
                margin: 10px 0 0 40px;
                background: #1e93f3;
                font-size: 10px;
                color: #fff;
                height: 100% !important;
            }
        }
    }
    .block__buy-hk {
        width: 100%;
        line-height: 48px;
        .van-button {
            width: 100% !important;
            background: linear-gradient(
                153deg,
                rgba(14, 192, 241, 1) 0%,
                rgba(83, 90, 240, 1) 100%
            );
            font-size: 10px;
            color: #fff;
            height: 100% !important;
        }
        .btn {
            font-size: 16px;
            line-height: 48px;
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
                font-size: 14px;
                justify-content: center;
                flex-direction: row;
                text-align: center;
                .van-count-down {
                    color: #fff;
                    font-size: 16px !important;
                    margin: 0px 3px 0 3px;
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
    .btn-inverster {
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
            height: 25px;

            font-size: 16px;
        }
        .span-lineHeight {
            line-height: 25px;
        }
        .span-lineHeight1 {
            line-height: 50px;
        }
        em {
            line-height: 20px;
            font-size: 12px;
            font-style: normal;
        }
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
        height: 48px;
        color: #fff;
        text-align: center;
        line-height: 48px;
        font-size: 0.32rem;
        border-radius: 0;
        border: none;
    }
    .colorbg {
        background: #fff;
        color: #2f79ff;
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
        color: rgba(255, 255, 255, 0.6);
    }
    .button-5width {
        width: 33.33%;
    }
    .button-6width {
        width: 50%;
    }
    .button-left {
        border-right: 1px solid #e1e1e1;
    }
    .van-button {
        border-radius: 0 !important;
    }
}
.fund-block--content {
    display: flex;
    flex-direction: row;
}
.fund-footer-content {
    width: 100%;
    .fund-footer-tip {
        display: block;
        width: 100%;
        height: 36px !important;
        line-height: 36px;
        background: rgba(254, 113, 39, 0.1);
        color: #fe7127;
        font-size: 14px;
    }
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
            flex-direction: column;
            .block__footer--top,
            .block__footer--bottom {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
            }

            .van-count-down {
                font-size: 16px;
                margin: 0 6px;
                font-family: yxFontDINPro-Medium;
                color: rgba(234, 61, 61, 1);
                border-radius: 5px;
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
                line-height: 28px;
                color: #fff;
                border-radius: 5px !important;
                background: #ea3d3d;
                width: 100%;
            }
        }
    }
}
.fund-footer-contentShare {
    position: absolute;
    z-index: 999;
    bottom: 48px;
    border-radius: 5px;
    transform: translateX(-50%);
    left: 50%;
    overflow: hidden;
    .fund-footer {
        height: 40px !important;
        font-size: 14px;
        line-height: 40px;
    }
}
.block__button--list {
    display: flex;
    flex-direction: row;
}
</style>
