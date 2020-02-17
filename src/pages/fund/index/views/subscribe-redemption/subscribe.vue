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
                                span.msg(v-if="discountShow && code == 1") {{descrbeDiscount}}
                                span.msg(v-if="discountShow && code == 2") {{descrbeDiscountHk}}
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
                van-button(:disabled="disabled" @click="handlerSubmitFilter") {{$t('submitButtonText')}}
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
                @handleShare="handleShare"
                :title="shareTitle"
            )

        .block__footer--loading(v-if="loading")
            Loading(type="spinner" color="#2F79FF")
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
import { getSource } from '@/service/customer-relationship-server'
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
import { getFundUserInfo } from '@/service/user-server.js'
import { Loading } from 'vant'
import LS from '@/utils/local-storage'
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
            // 1: 购买 2:成功
            step: 1,
            showShare: false,
            orderNo: null,
            subscribeObj: JSON.parse(JSON.stringify(subscribeObj)),
            buyMoneyBlur: false,
            buyMoney: null,
            disabledInput: true,
            fundName: '',
            shareTitle: '',
            isin: '',
            currency: {},
            code: null,
            purchaseAmount: null,
            withdrawBalance: 0,
            subscriptionFee: null,
            descrbeDiscount: '',
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
            discountShow: false,
            groupId: null,
            positionStatus: '', //持仓状态
            userInfo: {},
            groupRestUsers: 5,
            discount: null,
            derivativeType: null
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
        if (LS.get('groupId') != undefined) {
            this.groupId = LS.get('groupId')
        }
        this.getSource()
        this.getFundUserInfo()
        this.getGroupOrders()
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
        },
        //查询拼团订单
        async getGroupOrders() {
            try {
                if (!this.groupId && this.groupId != 0) return
                this.discountShow = true
                let data = await getGroupAction({
                    biz_id: this.$route.query.id,
                    biz_type: 0,
                    action_status: 2
                })
                let mostNum
                let restNum
                if (data.action && data.action.rule_detail) {
                    mostNum = JSON.parse(data.action.rule_detail).most_user

                    this.discount = JSON.parse(
                        data.action.rule_detail
                    ).rule_list[
                        JSON.parse(data.action.rule_detail).rule_list.length - 1
                    ].discount
                }
                this.descrbeDiscount = this.$t([
                    `拼团最高可返${100 - this.discount}%`,
                    `「同行優惠」最高可以費用${100 - this.discount}%折扣`,
                    `Up to ${100 - this.discount}% discount on subscription fee`
                ])
                this.descrbeDiscountHk = this.$t([
                    `最多可享${100 - this.discount}%认购费折扣`,
                    `最多可享${100 - this.discount}%認購費折扣`,
                    `Up to ${100 - this.discount}% discount on subs. fee`
                ])
                if (!this.groupId) return
                let grdersData = await getGroupOrders({
                    group_id: Number(this.groupId)
                })
                let orderList = grdersData.order_list || []
                if (data.action && data.action.rule_detail) {
                    restNum =
                        JSON.parse(data.action.rule_detail).rule_list[0]
                            .start_user_count - orderList.length
                }

                this.shareTitle = this.$t([
                    `<p>认购申请已提交</p>`,
                    `<p>認購申請已提交</p>`,
                    `<p>Subscription submitted</p>`
                ])
                if (orderList.length === mostNum) {
                    this.shareTitle += this.$t([
                        `<p>同行认购成功，团队已满员</p>`,
                        `<p>同行認購成功，團隊已滿</p>`,
                        `<p>Your group is full, you have got the Group Discount offer. </p>`
                    ])
                } else {
                    let mostRest = mostNum - orderList.length

                    // 未成团
                    if (restNum > 0) {
                        this.shareTitle += this.$t([
                            `<p>还差 ${restNum} 人成团，赶快邀请好友来拼团吧</p>`,
                            `<p>還差${restNum}人，趕緊邀請好友一同參與「同行優惠」</p>`,
                            `<p>${restNum} people needed to get the 50% discount on subscription fee.</p>`
                        ])
                    } else {
                        this.shareTitle += this.$t([
                            `<p>团队已达到标，还可以邀请 ${mostRest} 人</p>`,
                            `<p>「同行優惠」已達成目標，還可以再多${mostRest}人一同參與</p>`,
                            `<p>You have entitled Group Discount, you can have ${mostRest} more people to join your group.</p>`
                        ])
                    }
                }

                if (data.action && data.action.rule_detail) {
                    this.groupRestUsers = this.discount =
                        JSON.parse(data.action.rule_detail).rule_list[0]
                            .start_user_count - orderList.length
                }
            } catch (e) {
                LS.remove('groupId')
                console.log('getGroupOrders:error:>>>', e)
            }
        },
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                this.loading = false
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        async handleShare(_index) {
            // webViewClick('Invitefriend', 'shareurl', '分享链接')
            let shareTypeMap = appType.Hk
                ? [
                      'whatsapp',
                      'wechat_friends_circle',
                      'wechat_friend',
                      'twitter'
                  ]
                : ['wechat_friend', 'wechat_friends_circle', 'qq', 'weibo']

            let shareType = shareTypeMap[_index]
            try {
                let lt =
                    (langType.Ch && 1) ||
                    (langType.Hk && 2) ||
                    (langType.En && 3) ||
                    1

                let at = appType.Hk ? 2 : 1
                let link = `${this.$appOrigin}/hqzx/marketing/group.html?appType=${at}&langType=${lt}&biz_type=0&biz_id=${this.$route.query.id}&group_id=${this.groupId}&invitationCode=${this.userInfo.invitationCode}&order_id=${this.orderNo}#/invite`
                let pageUrl = `${window.location.origin}/hqzx/marketing/group.html?appType=${at}&langType=${lt}&biz_type=0&biz_id=${this.$route.query.id}&group_id=${this.groupId}&invitationCode=${this.userInfo.invitationCode}&order_id=${this.orderNo}#/invite`
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                let shortPageUrl = await getShortUrl({
                    long: encodeURIComponent(pageUrl)
                })
                await jsBridge.callApp('command_share', {
                    shareType: shareType,
                    title: this.$t([
                        `我正在申购${this.fundName}，老司机开团，就差你上车啦！`,
                        `我正在申購${this.fundName}，就差你一個了！`,
                        `I am subscribing${this.fundName}， join me now!`
                    ]),
                    description: this.$t([
                        '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
                        '一同購買更享「同行優惠」，尊享申購費折扣！點擊了解詳情>>>',
                        'Subscribe together to get the Group Discount on the subscription fee. Click here for details >>>'
                    ]),
                    pageUrl: `${window.location.origin}/${shortPageUrl.url}`,
                    shortUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    thumbUrl: `${window.location.origin}/webapp/marketing/images/mgmChSharev2.png`
                })
                this.$toast(this.$t([`分享成功`, `分享成功`, `Successful`]))
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
            // }
        },
        focusEvent() {
            if (this.withdrawBalance <= 0) {
                this.$dialog
                    .confirm({
                        message: this.$t('subscribemsg'),
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
                this.derivativeType =
                    fundDetail.fundOverviewInfoVO.derivativeType
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
        handlerSubmitFilter() {
            if (
                this.purchaseAmount / this.withdrawBalance >= 0.5 &&
                this.derivativeType != 1
            ) {
                this.$dialog
                    .confirm({
                        message: this.$t('content'),
                        confirmButtonText: this.$t('continue'),
                        cancelButtonText: this.$t('cancel')
                    })
                    .then(() => {
                        this.handleSubmit()
                        // on confirm
                    })
                    .catch(() => {
                        // on cancel
                    })
            } else {
                this.handleSubmit()
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
                    if (!this.groupId && this.groupId != 0) {
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
                            group_id: Number(this.groupId) || 0,
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
                        await this.getGroupOrders()

                        this.showShare = true
                        re = JSON.parse(body)
                        console.log(re)
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
            FundReturn: '拼团最低可返',
            subscribeApply: '认购申请已提交',
            subscribeSuccess: '同行认购成功，团队已满员',
            invitation: '还差 5人，赶快邀请好友来拼团吧',
            invitationInfo: '团队已达到标，还可以邀请 999 人',
            startGroup: '我正在认购，老司机开团，就差你上车啦！',
            groupBuy: '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
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
            subscribemsg: '您的可用余额不足\n您可以选择入金后进行申购',
            cancel: '取消',
            continue: '继续申购',
            content:
                '您购买资金已超过当前净资产50%，当前购买产品为衍生产品或复杂产品，风险视乎产品特性不同而有所不同，并可招致巨大损失。点击继续申购视为确认自愿承担该产品风险。'
        },
        zhCHT: {
            FundReturn: '拼团最低可返',
            subscribeApply: '认购申请已提交',
            subscribeSuccess: '同行认购成功，团队已满员',
            invitation: '还差 5人，赶快邀请好友来拼团吧',
            invitationInfo: '团队已达到标，还可以邀请 999 人',
            startGroup: '我正在认购，老司机开团，就差你上车啦！',
            groupBuy: '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
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
            confirm: '立即存款',
            subscribemsg: '您的可用餘額不足\n您可以选择存款後進行申購',
            cancel: '取消',
            continue: '繼續申購',
            content:
                '您購買資金已超過當前淨資產50％，當前購買產品為衍生產品或複雜產品，風險視乎產品特性不同而有所不同，招致致巨大損失。點擊繼續申購確認確認承擔該產品風險。'
        },
        en: {
            FundReturn: '拼团最低可返',
            subscribeApply: '认购申请已提交',
            subscribeSuccess: '同行认购成功，团队已满员',
            invitation: '还差 5人，赶快邀请好友来拼团吧',
            invitationInfo: '团队已达到标，还可以邀请 999 人',
            startGroup: '我正在认购，老司机开团，就差你上车啦！',
            groupBuy: '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
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
            subscribemsg:
                'Sorry，Your account number is not enough\nYou can subscribe the fund after you deposit',
            cancel: 'cancel',
            continue: 'Continue ',
            content:
                'Your purchase funds have exceeded 50% of your current net assets. The current purchase product is a derivative product or a complex product.The risk varies depending on the characteristics of the product and can cause huge losses. Clicking Continue is deemed to be a voluntary acceptance of the risk of the product.'
        }
    }
}
</script>
