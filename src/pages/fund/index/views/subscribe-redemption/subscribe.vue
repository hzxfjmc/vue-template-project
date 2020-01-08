<template lang="pug">
    .subscribe-wrapper
        .succed.border-bottom(v-if="step === 2")
            img(src="@/assets/img/fund/succed.svg")
            div.text {{ $t('buySuccess') }}
        .fond-des
            .fond-name {{ fundName }}
            .ISIN ISIN:{{ isin }}

        template(v-if="step === 1")
            .fund-content
                .fond-buy
                    .block__fund--header.border-bottom
                        span.fund__title--block {{$t('buyMoneyNumber')}}
                        .block__fund--input(@click="focusEvent")
                            span.usaspan(v-if="currency.type == 1") $
                            span.hkspan(v-else) HK$
                            p {{money}}
                            input(
                                v-model="purchaseAmount" 
                                type="text"
                                :disabled="disabledInput"
                                @input="changeNumber"
                                :placeHolder="`${initialInvestAmount}${$route.query.currencyType == 2?$t('hkd') : $t('usd')}${$t('buyMoneyPlaceHolder')} `" )
                    .buy-row-item(v-for="(item,index) in subscribeObj" v-if="index != 'buyMoney'")
                        .left-item {{item.label}}
                        .right-item 
                            .right-item-subscriptionFee(v-if="index=='subscriptionFee'")
                                span {{subscriptionFee |sliceFixedTwo | formatCurrency}} ({{item.value|transNumToThousandMark(2)}}%)
                                span.msg(v-if="groupId") 拼团最低可返{{discount/100}}%
                            .right-item-other(v-else-if="index === 'withdrawBalance'")
                                span  {{currency.type == 1 ? 'USD':'HKD'}} {{item.value}}
                            .right-item-other(v-else)
                                span {{item.value}}
                FundSteps(
                    style="margin-top: 22px;"
                    :title="$t('buyRule')"
                    :curStep="0"
                    :stepNames="[$t('stepOne'), $t('stepTwo'), $t('stepThree')]"
                    :stepTimes="[buySubmit, buyConfirm, buyProfitLoss]"
                )
            .fund-footer-content
                .protocol
                    .protocol__checkbox.iconfont.icon-unchecked(:class="isCheckedProtocol ?'icon-selected checked':''" @click="checkProtocol")
                    .protocol__text(@click="checkProtocol") {{$t('protocolTips')}}
                    .protocol__button.iconfont.icon-iconshouqi(@click="showProtocol")
                van-button(:disabled="disabled" @click="handleSubmit") {{$t('submitButtonText')}}
        template(v-else-if="step === 2")
            .fond-buy.border-bottom
                .buy-row
                    .icon
                        img(src="@/assets/img/fund/clock.svg")
                    span.text-color5 {{ $t('predict') }} 
                    span(style="margin: 0 3px;") {{ buyConfirm }}
                    span.text-color5 {{ $t('confirmTheShare') }}
                .line
                .buy-row
                    .icon
                        .point
                    span.text-color5 {{ $t('predict') }}
                    span(style="margin: 0 3px;") {{ buyProfitLoss }}
                    span.text-color5 {{ $t('earnings') }}
            .fond-buy.fond-bug-monny.border-bottom(style="margin-top: 0")
                .buy-row
                    .left.line-height-8  {{$t('orderAmount')}}
                    .right.buy-money.line-height-8(style="text-align: right;") {{$route.query.currencyType == 2?'HKD' : 'USD'}} {{ orderTotalAmount | sliceFixedTwo | formatCurrency }}
                .buy-row
                    .left.line-height-8 {{$t('buyMoney')}}
                    .right.buy-money.line-height-8(style="text-align: right;") {{$route.query.currencyType == 2?'HKD' : 'USD'}} {{ subscribeObj['buyMoney'].value }}
            .fond-buy(style="margin-top: 0")
                a.submit(style="margin: 41px 0 28px 0" @click="goNext(orderNo, $route.query.currencyType)") {{ $t('done') }}
        protocol-popup(
            v-model="protocolVisible"
            :protocolFileList="buyProtocolFileList"
            )
        share-way(
            v-model="showShare"
            overlay-class="activity-invited"
            @handleShare="handleShare"
            :title="content"
            )
        .block__footer--loading(v-if="loading")
            Loading(type="spinner" color="#1989fa")
</template>
<script>
import NP from 'number-precision'
import shareWay from '@/biz-components/share-way/index'
import { getCosUrl } from '@/utils/cos-utils'
// import { getTradePasswordToken } from '@/service/user-server.js'
import { fundPurchase, getFundPositionV2 } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
import jsBridge from '@/utils/js-bridge.js'
import FundSteps from '@/biz-components/fond-steps'
import { generateUUID, transNumToThousandMark } from '@/utils/tools.js'
import {
    createGroupOrder,
    getGroupOrders,
    getGroupAction
} from '@/service/zt-group-apiserver.js'
import { subscribeObj, subscribeObji18n } from './subscribe.js'
import protocolPopup from './components/protocol-popup'
import { jumpUrl } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import { appType, langType } from '@/utils/html-utils.js'
import { getShortUrl } from '@/service/news-shorturl.js'
import { getCurrentUser } from '@/service/user-server.js'
import { Loading } from 'vant'
import './index.scss'
export default {
    name: 'subscribe',
    components: {
        FundSteps,
        protocolPopup,
        shareWay,
        Loading
    },
    data() {
        return {
            loading: true,
            content: '还差X人，赶快邀请好友来拼团把',
            // 1: 购买 2:成功
            step: 1,
            showShare: false,
            orderNo: null,
            subscribeObj: JSON.parse(JSON.stringify(subscribeObj)),
            buyMoneyBlur: false,
            buyMoney: null,
            disabledInput: true,
            fundName: '',
            isin: '',
            currency: {},
            purchaseAmount: null,
            withdrawBalance: 0,
            subscriptionFee: null,
            initialInvestAmount: 0, // 起投金额
            continueInvestAmount: 0, // 续投金额
            buyProtocolFileName: '',
            buyProtocol: '', // 基金购买协议
            buySubmit: '',
            money: '',
            buyConfirm: '', // 买入确认份额时间
            buyProfitLoss: '', // 买入查看盈亏时间
            buyProtocolFileList: [],
            sellProtocolFileList: [],
            protocolVisible: false,
            isCheckedProtocol: true,
            orderTotalAmount: '',
            groupId: this.$route.query.groupId,
            positionStatus: '', //持仓状态
            userInfo: {},
            groupRestUsers: 5,
            discount: null
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    watch: {
        purchaseAmount(val) {
            let numberInt
            if (`${val}`.indexOf(',') > -1) {
                let arr = val.split(',')
                numberInt = arr.join('')
            } else {
                numberInt = val
            }
            this.subscribeObj.totalOrderAmount.value =
                Number(numberInt) +
                    (numberInt * this.subscribeObj.subscriptionFee.value) /
                        100 || '0.00'
            this.subscribeObj.totalOrderAmount.value = transNumToThousandMark(
                Number(this.subscribeObj.totalOrderAmount.value).toFixed(2)
            )
            this.subscriptionFee =
                (numberInt * this.subscribeObj.subscriptionFee.value) / 100
            if (numberInt > +this.withdrawBalance) {
                this.purchaseAmount = +this.withdrawBalance
                return
            }
        }
    },
    async created() {
        await this.getCurrentUser()
        this.getFundPositionV2Fun()
        this.getWithdrawBalance()
    },
    computed: {
        ...mapGetters(['appType', 'lang', 'isLogin', 'openedAccount']),
        // 预计完成时间多语言配置
        predictDay() {
            return {
                zhCHS: `预计${this.buyProfitLoss.slice(0, 5)}日完成`,
                zhCHT: `預計${this.buyProfitLoss.slice(0, 5)}日完成`,
                en: `EST. ${this.buyProfitLoss.slice(0, 5).replace('.', '/')}`
            }[this.$i18n.lang]
        },
        subscriptionFeeScale() {
            return NP.times(+this.subscriptionFee, 100)
        },
        disabled() {
            return !this.isCheckedProtocol || !this.purchaseAmount
        }
    },
    methods: {
        //查询拼团订单
        async getGroupOrders() {
            try {
                let data = await getGroupAction({
                    biz_id: this.$route.query.id,
                    biz_type: 0,
                    action_status: 2
                })
                let grdersData = await getGroupOrders({
                    group_id: this.groupId
                })
                let orderList = grdersData.order_list || []
                this.groupRestUsers =
                    JSON.parse(data.action.rule_detail).most_user -
                    orderList.length
                this.discount = JSON.parse(
                    data.action.rule_detail
                ).rule_list[1].discount
                this.content = `还差${this.groupRestUsers}人，赶快邀请好友来拼团把`
                this.showShare = true
            } catch (e) {
                this.$toast(e.msg)
                console.log('getGroupOrders:error:>>>', e)
            }
        },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userInfo = res
                this.loading = false
            } catch (e) {
                this.$toast(e.msg)
                console.log('getCurrentUser:error:>>>', e)
            }
        },
        async handleShare(_index) {
            // webViewClick('Invitefriend', 'shareurl', '分享链接')
            let shareTypeMap = [
                'wechat_friend',
                'wechat_friends_circle',
                'qq',
                'weibo'
            ]

            let shareType = shareTypeMap[_index]
            try {
                let lt =
                    (langType.Ch && 1) ||
                    (langType.Hk && 2) ||
                    (langType.En && 3) ||
                    1

                let at = appType.Hk ? 2 : 1
                let link = `${this.$appOrigin}/hqzx/marketing/group.html?appType=${at}&langType=${lt}&biz_type=0&biz_id=${this.$route.query.id}&group_id=${this.groupId}&&invitationCode=${this.userInfo.invitationCode}#/invite`
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                await jsBridge.callApp('command_share', {
                    shareType: shareType,
                    title: `还差${this.groupRestUsers}人，赶快邀请好友来拼团吧`,
                    description: '',
                    pageUrl: unescape(link),
                    shortUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    thumbUrl: `${this.$appOrigin}/webapp/marketing/images/mgmChSharev2.png`
                })
                this.$toast('分享成功')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
            // }
        },
        focusEvent() {
            if (this.withdrawBalance <= 0) {
                this.$dialog
                    .confirm({
                        message: this.$t('msg'),
                        confirmButtonText: this.$t('confirm'),
                        closeOnClickOverlay: true,
                        cancelButtonText: this.$t('iknow')
                    })
                    .then(() => {
                        jumpUrl(
                            3,
                            `${window.location.origin}/webapp/open-account/deposit.html#/`
                        )
                    })
                    .catch(() => {
                        // on cancel
                    })

                return
            }
        },
        changeNumber(e) {
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
            let match =
                (this.purchaseAmount &&
                    this.purchaseAmount.match(/^(\d+)(\.)?(\d{1,2})?/)) ||
                []
            this.purchaseAmount = `${match[1] || ''}${match[2] ||
                ''}${match[3] || ''}`
            if (e.target.value.indexOf('.') > 0) {
                this.money =
                    obj[this.lang][this.purchaseAmount.split('.')[0].length]
            } else {
                this.money = obj[this.lang][this.purchaseAmount.length]
            }
            if (e.target.value > +this.withdrawBalance) {
                this.purchaseAmount = +this.withdrawBalance
                this.purchaseAmount = this.purchaseAmount + ''
                this.money =
                    this.purchaseAmount.indexOf('.') > 0
                        ? obj[this.lang][
                              this.purchaseAmount.split('.')[0].length
                          ]
                        : obj[this.lang][this.purchaseAmount.length]
                return
            }
        },
        async openProtocol(url) {
            url = await getCosUrl(url)
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        checkProtocol() {
            this.isCheckedProtocol = !this.isCheckedProtocol
        },
        showProtocol() {
            this.protocolVisible = true
        },
        hideProtocol() {
            this.protocolVisible = false
        },
        times: NP.times,
        goNext(orderNo, currencyType) {
            if (jsBridge.isYouxinApp) {
                jsBridge.callApp('command_close_webview')
            } else {
                this.$router.push({
                    path: '/order-record-detail',
                    query: {
                        orderNo,
                        currencyType
                    }
                })
            }
        },
        // 获取基金信息
        async getFundDetailInfo() {
            try {
                const fundDetail = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundName = fundDetail.fundHeaderInfoVO.fundName
                this.isin = fundDetail.fundOverviewInfoVO.isin
                for (let key in this.subscribeObj) {
                    this.subscribeObj[key].label = this.$t('subscribeObj')[key]
                }

                if (this.positionStatus !== 1) {
                    this.initialInvestAmount = transNumToThousandMark(
                        Number(
                            fundDetail.fundTradeInfoVO.initialInvestAmount
                        ).toFixed(2)
                    )
                } else {
                    this.initialInvestAmount = transNumToThousandMark(
                        Number(
                            fundDetail.fundTradeInfoVO.continueInvestAmount
                        ).toFixed(2)
                    )
                }
                this.currency = fundDetail.fundTradeInfoVO.currency
                this.subscribeObj.subscriptionFee.value =
                    fundDetail.fundTradeInfoVO.subscriptionFee * 100
                this.setCosUrl(
                    'buyProtocol',
                    fundDetail.fundTradeInfoVO.buyProtocol
                )
                this.buySubmit = fundDetail.fundTradeInfoVO.buySubmit
                this.buyConfirm = fundDetail.fundTradeInfoVO.buyConfirm
                this.buyProfitLoss = fundDetail.fundTradeInfoVO.buyProfitLoss
                this.buyProtocolFileName = (
                    fundDetail.fundTradeInfoVO.buyProtocol || ''
                )
                    .split('/')
                    .pop()

                this.buyProtocolFileList = fundDetail.buyProtocolFileList
                this.buyProtocolFileList.map(item => {
                    item.fileName = item.fileName.split('.')[0]
                })
            } catch (e) {
                console.log(e)
                console.log('申购页面-getFundDetail:error:>>>', e)
            }
        },
        async setCosUrl(dataKey, url) {
            try {
                this[dataKey] = await getCosUrl(url)
            } catch (e) {
                console.log('申购页面-getCosUrl:error:>>>', e)
            }
        },
        // 获取可用余额
        async getWithdrawBalance() {
            let currencyType
            if (this.$route.query.currencyType) {
                currencyType = this.$route.query.currencyType
            } else {
                const fundDetail = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                currencyType = fundDetail.fundTradeInfoVO.currency.type
            }
            try {
                const hsInfo = await hsAccountInfo(currencyType)
                this.withdrawBalance = hsInfo.withdrawBalance
                if (this.withdrawBalance > 0) {
                    this.disabledInput = false
                }
                this.subscribeObj.withdrawBalance.value = transNumToThousandMark(
                    hsInfo.withdrawBalance
                )
                this.getFundDetailInfo()
            } catch (e) {
                console.log('申购页面-getWithdrawBalance:error:>>>', e)
            }
        },
        handleClickBuyPlaceHolder() {
            this.buyMoneyBlur = true
            this.$nextTick(() => {
                this.$refs['buy-money'].focus()
            })
        },
        handleOnblurBuyInput() {
            if (this.buyMoney === null || this.buyMoney === '') {
                this.buyMoneyBlur = false
            }
        },
        async handleSubmit() {
            let submitStep = 0 // 0: 开始 1: 获取token成功 2: 申购成功
            let token = null
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                token = data && data.token
                submitStep = 1
            } catch (error) {
                console.log('申购页面-tradeErrorMsg :', error)
            }

            // test:
            // submitStep = 1
            if (submitStep === 1) {
                try {
                    this.$loading()
                    let re
                    if (!this.$route.query.groupId) {
                        re = await fundPurchase({
                            displayLocation: 1,
                            fundId: this.$route.query.id,
                            purchaseAmount: this.purchaseAmount,
                            requestId: generateUUID(),
                            tradeToken: token
                        })
                        this.orderNo = re.orderNo
                        this.orderTotalAmount = re.orderTotalAmount
                        console.log('申购页面-fundPurchaseData:', re)
                    } else {
                        const { body, group_id } = await createGroupOrder({
                            group_id: Number(this.$route.query.groupId),
                            biz_type: 0,
                            biz_id: this.$route.query.id,
                            order_detail: JSON.stringify({
                                displayLocation: 1,
                                fundId: this.$route.query.id,
                                purchaseAmount: this.purchaseAmount,
                                requestId: generateUUID(),
                                tradeToken: token
                            })
                        })
                        this.groupId = group_id
                        this.getGroupOrders()

                        re = JSON.stringify(body)
                    }
                    submitStep = 2
                    this.orderNo = re.orderNo
                    this.orderTotalAmount = re.orderTotalAmount
                    this.subscribeObj.buyMoney.value = transNumToThousandMark(
                        re.orderAmount
                    )
                    console.log('申购页面-fundPurchaseData:', re)
                    this.$close()
                } catch (error) {
                    this.$alert({
                        message: error.msg,
                        confirmButtonText: this.$t('iKnow')
                    })
                    this.$close()
                }
            }
            if (submitStep === 2) {
                this.step = 2
            }
        },
        // 获取当前客户单个基金持仓数据
        async getFundPositionV2Fun() {
            let res = await getFundPositionV2({
                fundId: this.$route.query.id
            })
            this.positionStatus = res.positionStatus.type
        }
    },
    i18n: {
        zhCHS: {
            buySuccess: '申购成功',
            buyMoney: '购买金额',
            buyFile: '基金购买协议',
            buyRule: '申购规则',
            currency: '币种',
            availableBalance: '可用余额',
            buyBalance: '购买金额',
            minBugBalance: '最小申购金额',
            buyMoneyNumber: '申购金额',
            continueBalance: '续投金额',
            redemption: '申购费',
            predict: '预计',
            submitButtonText: '同意协议并提交',
            dayDone: '日完成',
            day: '日',
            balanceRule: '申购规则',
            stepOne: '买入提交',
            stepTwo: '确认份额',
            stepThree: '查看盈亏',
            confirmTheShare: '确认份额并开始计算收益',
            earnings: '查看收益',
            money: '金额',
            done: '完成',
            iKnow: '我知道了',
            subscribeObj: subscribeObji18n.i18n.zhCHS,
            protocolTips: '已阅读并同意服务协议及风险提示，并查阅相关信息',
            buyMoneyPlaceHolder: '起',
            orderAmount: '订单金额',
            iknow: '我知道了',
            confirm: '立即入金',
            msg: '您的可用余额不足\n您可以选择入金后进行申购'
        },
        zhCHT: {
            buySuccess: '申購成功',
            buyMoney: '購買金額',
            buyFile: '基金購買協議',
            buyRule: '申購規則',
            currency: '幣種',
            availableBalance: '可用餘額',
            buyBalance: '购买金额',
            minBugBalance: '最小申購金額',
            buyMoneyNumber: '申購金額',
            continueBalance: '續投金額',
            redemption: '申購費',
            predict: '預計',
            submitButtonText: '同意協議並提交',
            dayDone: '日完成',
            day: '日',
            balanceRule: '申購規則',
            stepOne: '買入提交',
            stepTwo: '確認份額',
            stepThree: '查看盈虧',
            confirmTheShare: '確認份額並開始計算收益',
            earnings: '查看收益',
            money: '金額',
            done: '完成',
            iKnow: '我知道了',
            subscribeObj: subscribeObji18n.i18n.zhCHT,
            protocolTips: '已閱讀並同意服務協議及風險提示，並查閱相關信息',
            buyMoneyPlaceHolder: '起',
            orderAmount: '訂單金額',
            iknow: '我知道了',
            confirm: '立即入金',
            msg: '您的可用余額不足\n您可以選擇入金後進行申購'
        },
        en: {
            buySuccess: 'Subscription Successful',
            buyMoney: 'Investment Amount',
            buyFile: 'Fund Investment Agreement',
            buyRule: 'Subscription Rules',
            currency: 'Currency',
            availableBalance: 'Available Balance',
            buyBalance: 'Investment Amount',
            minBugBalance: 'Initial',
            buyMoneyNumber: 'Amount of Purchasing',
            continueBalance: 'Subsequent',
            redemption: 'Subscription Fee',
            predict: 'Estimated',
            submitButtonText: 'Agree to agreement and submit',
            dayDone: 'Complete in X days',
            day: 'Days',
            balanceRule: 'Subscription Rules',
            stepOne: 'Submit',
            stepTwo: 'Fund Units Allocation',
            stepThree: 'Check P/L',
            confirmTheShare: 'Fund Units Allocation',
            earnings: 'Check P/L',
            money: 'Amount',
            done: 'Completed',
            iKnow: 'Got it',
            subscribeObj: subscribeObji18n.i18n.en,
            protocolTips:
                'I have read and agree to the service agreement and risk warning, and consult relevant information',
            buyMoneyPlaceHolder: ' Initial Subs',
            orderAmount: 'Amount of Orders',
            iknow: 'I Get It',
            confirm: 'Deposit Now',
            msg:
                'Sorry，Your account number is not enough\nYou can subscribe the fund after you deposit'
        }
    }
}
</script>
