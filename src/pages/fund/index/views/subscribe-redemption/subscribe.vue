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
                        NumberKeyboard( 
                            :currency= "currency.name"
                            :placeholder="placeholder"
                            v-model="purchaseAmount"
                            @input="handlerAmount"
                            )
                        .block__fund--tag--list(v-if="tagList.length!=0")
                            span(v-for="item in tagList") {{item}}
                    .block__tags()
                        span {{tagText}}
                    .buy-row-item.buy-row-item-fund(v-for="(item,index) in subscribeObj" v-if="index != 'buyMoney' && index != 'withdrawBalance'")
                        .left-item {{item.label}}
                        .right-item 
                            .right-item-subscriptionFee(v-if="index=='subscriptionFee'")
                                span {{subscriptionFee |sliceFixedTwo | formatCurrency}} ({{item.value|transNumToThousandMark(2)}}%)
                                span.msg(v-if="discountShow && code == 1") {{descrbeDiscount}}
                                span.msg(v-if="discountShow && code == 2") {{descrbeDiscountHk}}
                            //- .right-item-other(v-else-if="index === 'withdrawBalance'")
                            //-     span  {{currency.type == 1 ? 'USD':'HKD'}} {{item.value}}
                            .right-item-other(v-else)
                                span {{item.value}}
                   
                .block__payment--type
                    .block__header--title
                        span 扣款方式
                        span {{currency.type == 1 ? $t('usd'):$t('hkd')}}融资账户
                    .block__bottom
                        span {{subscribeObj['withdrawBalance'].label}}：{{subscribeObj['withdrawBalance'].value}}{{currency.type == 1 ? $t('usd'):$t('hkd')}}
                .block__fund-tip 美元不足？友信支持7x24换汇服务
                    em.block__fund--button(
                        v-if="tipShow" 
                        @click="toExchangePage") 点此查看详情
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
                van-button(@click="handlerSubmitFilter") {{$t('submitButtonText')}}
        template(v-else-if="step === 2")
            .fond-buy.border-bottom
                .buy-row
                    .icon
                        img(src="@/assets/img/fund/clock.svg")
                    span.text-color5(v-html="$t('confirmTheShare', buyConfirm)")
                .line
                .buy-row
                    .icon
                        .point
                    span.text-color5(v-html="$t('earnings', buyProfitLoss)")
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
import {
    getFundDetail,
    getFundFeeConfigV1
} from '@/service/finance-info-server.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
import jsBridge from '@/utils/js-bridge.js'
import FundSteps from '@/biz-components/fond-steps'
import {
    generateUUID,
    transNumToThousandMark,
    debounce
} from '@/utils/tools.js'
import { getSource } from '@/service/customer-relationship-server'
import {
    createGroupOrder,
    getGroupOrders,
    getGroupAction
} from '@/service/zt-group-apiserver.js'
import { subscribeObj, subscribeObji18n } from './subscribe.js'
import protocolPopup from './components/protocol-popup'
import { jumpUrl, compareVersion } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import { appType, langType, getUaValue } from '@/utils/html-utils.js'
import { getShortUrl } from '@/service/news-shorturl.js'
import { getFundUserInfo } from '@/service/user-server.js'
import { Loading } from 'vant'
import LS from '@/utils/local-storage'
import './index.scss'
import NumberKeyboard from './components/number-keyboard'
export default {
    name: 'subscribe',
    components: {
        FundSteps,
        protocolPopup,
        shareWay,
        NumberKeyboard,
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
            purchaseAmount: '',
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
            derivativeType: null,
            tipShow: false,
            tips: '',
            Exchange: '',
            subscribeFeeVO: {
                defaultFeeRate: 0,
                fundFeeLevelVOList: []
            },
            placeholder: '请输入',
            tagList: [],
            tagText: '',
            fundDetail: {}
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
            if (numberInt) {
                this.subscribeFeeVO.fundFeeLevelVOList.map(item => {
                    item.minAmount =
                        item.minAmount === null ? 0 : item.minAmount
                    item.maxAmount =
                        item.maxAmount === null ? Infinity : item.maxAmount
                    if (
                        +item.minAmount <= +numberInt &&
                        +numberInt < +item.maxAmount
                    ) {
                        this.subscribeObj.subscriptionFee.value =
                            item.feeRate * 100 || 0
                    }
                })
            } else {
                this.subscribeObj.subscriptionFee.value =
                    this.subscribeFeeVO.defaultFeeRate * 100 || 0
            }
            this.subscriptionFee =
                (numberInt * this.subscribeObj.subscriptionFee.value) / 100 || 0
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
        this.compareVersionFund()
        this.getSource()

        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.getSource, 300)
    },
    computed: {
        ...mapGetters([
            'appType',
            'lang',
            'isLogin',
            'openedAccount',
            'appVersion'
        ]),
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
        }
    },
    methods: {
        handlerAmount() {
            // this.purchaseAmount = +val || ''
            this.getTagText()
        },
        async getFundFeeConfig() {
            try {
                let params = {
                    fundId: this.$route.query.id
                }
                let { subscribeFeeVO } = await getFundFeeConfigV1(params)
                this.subscribeFeeVO.defaultFeeRate = subscribeFeeVO.defaultFeeRate
                    ? subscribeFeeVO.defaultFeeRate
                    : ''
                this.subscribeFeeVO.fundFeeLevelVOList = subscribeFeeVO.fundFeeLevelVOList
                    ? subscribeFeeVO.fundFeeLevelVOList
                    : []
                // 赋值默认申购费
                this.subscribeObj.subscriptionFee.value = this.subscribeFeeVO
                    .fundFeeLevelVOList.length
                    ? this.subscribeFeeVO.fundFeeLevelVOList[0].feeRate * 100
                    : this.subscribeFeeVO.defaultFeeRate * 100
            } catch (e) {
                console.log('getFundFeeConfigV1: ', e)
            }
        },
        //大陆版 IOS  3.4.0 版本（包括）之前 的都不展示 点次去换汇
        compareVersionFund() {
            const isIos = /(ipad)|(iphone)/i.test(navigator.userAgent)
            const appVersion = getUaValue('appVersion')
            const flag = compareVersion(appVersion, '3.4.0')
            if (!isIos || this.appType.Hk) {
                this.tipShow = true
            }
            if (!this.appType.Hk && flag === 1) {
                this.tipShow = true
            }
        },
        //跳转协议
        toExchangePage() {
            jumpUrl(5, 'yxzq_goto://currency_exchange')
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            this.getFundUserInfo()
            this.getGroupOrders()
            this.getFundPositionV2Fun()
            this.getWithdrawBalance()
            this.getFundFeeConfig()
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
                this.appType = data.action.app_type
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
                    `Up to ${100 - this.discount}% discount on subs. fee`
                ])
                this.descrbeDiscountHk = this.$t([
                    `申购费低至${this.discount / 10}折`,
                    `認購費低至${this.discount / 10}折`,
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
                    `<p>申购申请已提交</p>`,
                    `<p>認購申請已提交</p>`,
                    `<p>Subscription submitted</p>`
                ])
                if (orderList.length === mostNum) {
                    this.shareTitle += this.$t([
                        `<p>同行申购成功，团队已满员</p>`,
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
                let link = `${
                    this.$appOrigin
                }/hqzx/marketing/group.html?appType=${
                    this.appType.Ch ? 1 : 2
                }&langType=${lt}&biz_type=0&biz_id=${
                    this.$route.query.id
                }&group_id=${this.groupId}&invitationCode=${
                    this.userInfo.invitationCode
                }&order_id=${this.orderNo}#/invite`
                let pageUrl = `${
                    window.location.origin
                }/hqzx/marketing/group.html?appType=${
                    this.appType.Ch ? 1 : 2
                }&langType=${lt}&biz_type=0&biz_id=${
                    this.$route.query.id
                }&group_id=${this.groupId}&invitationCode=${
                    this.userInfo.invitationCode
                }&order_id=${this.orderNo}#/invite`
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                let shortPageUrl = await getShortUrl({
                    long: encodeURIComponent(pageUrl)
                })
                let title =
                    this.code === 1
                        ? this.$t([
                              `我已申购${this.fundName}，老司机开团，就差你上车啦！`,
                              `我已認購${this.fundName}，就差你一個了！`,
                              `I am subscribing${this.fundName}， join me now!`
                          ])
                        : this.$t([
                              `我已申购${this.fundName}，老司机开团，就差你上车啦！`,
                              `我已認購${this.fundName}，就差你一個了！`,
                              `I am subscribing${this.fundName}， join me now!`
                          ])
                let description =
                    this.code === 1
                        ? this.$t([
                              '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
                              '一同購買更享「同行優惠」，尊享申購費折扣！點擊了解詳情>>>',
                              'Subscribe together to get the Group Discount on the subscription fee. Click here for details >>>'
                          ])
                        : this.$t([
                              '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
                              '一同購買更享「同行優惠」，尊享認購費折扣！點擊了解詳情>>>',
                              'Subscribe together to get the Group Discount on the subscription fee. Click here for details >>>'
                          ])
                await jsBridge.callApp('command_share', {
                    shareType: shareType,
                    title: title,
                    description: description,
                    pageUrl: `${window.location.origin}/${shortPageUrl.url}`,
                    shortUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    overseaPageUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    thumbUrl: `${window.location.origin}/webapp/marketing/images/mgmChSharev2.png`
                })
                this.$toast(this.$t([`分享成功`, `分享成功`, `Successful`]))
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
            // }
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
                this.fundDetail = fundDetail
                this.fundName = fundDetail.fundHeaderInfoVO.fundName
                this.isin = fundDetail.fundOverviewInfoVO.isin
                this.derivativeType =
                    fundDetail.fundOverviewInfoVO.derivativeType
                for (let key in this.subscribeObj) {
                    this.subscribeObj[key].label = this.$t('subscribeObj')[key]
                }
                this.currency = fundDetail.fundTradeInfoVO.currency
                const CURRENCYEUMN = {
                    1: this.$t('usd'),
                    2: this.$t('hkd')
                }
                const CurrencyName = CURRENCYEUMN[this.currency.type]
                const initialInvestAmount =
                    fundDetail.fundTradeInfoVO.initialInvestAmount
                const formatInitialInvesetAmount = transNumToThousandMark(
                    Number(initialInvestAmount).toFixed(2)
                )
                if (
                    Number(this.subscribeObj['withdrawBalance'].value) >
                    initialInvestAmount
                ) {
                    this.tagList =
                        initialInvestAmount <= 1000
                            ? [
                                  `1,000${CurrencyName}`,
                                  `2,000${CurrencyName}`,
                                  `3,000${CurrencyName}`
                              ]
                            : [
                                  `${transNumToThousandMark(
                                      Number(initialInvestAmount),
                                      0
                                  )}${CurrencyName}`,
                                  `${transNumToThousandMark(
                                      Number(initialInvestAmount * 2),
                                      0
                                  )}${CurrencyName}`,
                                  `${transNumToThousandMark(
                                      Number(initialInvestAmount * 4),
                                      0
                                  )}${CurrencyName}`
                              ]
                }

                if (this.positionStatus !== 1) {
                    this.initialInvestAmount = formatInitialInvesetAmount
                } else {
                    this.initialInvestAmount = formatInitialInvesetAmount
                }

                this.placeholder = `${
                    this.initialInvestAmount
                }${CurrencyName}${this.$t('buyMoneyPlaceHolder')} `

                this.tips = this.$t([
                    `*友信暂不支持使用${CURRENCYEUMN[this.currency.type]}购买${
                        CURRENCYEUMN[this.currency.type]
                    }基金，如有需要，您可以手动换汇后进行申购`,
                    `*友信暫不支持使用${CURRENCYEUMN[this.currency.type]}購買${
                        CURRENCYEUMN[this.currency.type]
                    }基金，如有需要，您可以手動換匯後進行申購`,
                    `*uSMART does not support the use of ${
                        CURRENCYEUMN[this.currency.type]
                    } to purchase ${
                        CURRENCYEUMN[this.currency.type]
                    } funds, If there is a need, you can manually exchange and then purchase the funds.`
                ])
                this.Exchange = this.$t('Exchange')
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
            let state = this.checkBuy(true)
            if (state === false) {
                return
            }
            if (state !== '') {
                this.$toast(state, 'middle')
                return
            }
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
                this.$toast(error.desc.errorMessage)
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
                        const requestId = generateUUID()
                        const { body, group_id } = await createGroupOrder(
                            {
                                group_id: Number(this.groupId) || 0,
                                biz_type: 0,
                                biz_id: this.$route.query.id,
                                order_detail: JSON.stringify({
                                    displayLocation: 1,
                                    fundId: this.$route.query.id,
                                    purchaseAmount: this.purchaseAmount,
                                    requestId: requestId,
                                    tradeToken: token
                                })
                            },
                            { requestId: requestId }
                        )
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
        },
        // 校驗，showDialog表示是否展示彈窗提示
        checkBuy(showDialog) {
            console.log(
                this.purchaseAmount,
                this.withdrawBalance,
                this.initialInvestAmount
            )
            if (this.purchaseAmount <= 0) {
                return this.$t('inputMoney')
            }
            if (!(+this.withdrawBalance > 0)) {
                if (showDialog) {
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
                    return false
                } else {
                    return this.$t('noEnoughMoney')
                }
            }
            if (
                +this.subscribeObj.totalOrderAmount.value >
                +this.withdrawBalance
            ) {
                return this.$t('noEnoughMoney')
            }
            // 這裡兩個都是字符串，initialInvestAmount為帶,分割的字符串
            if (
                +this.purchaseAmount <
                this.fundDetail.fundTradeInfoVO.initialInvestAmount
            ) {
                const CURRENCYEUMN = {
                    1: this.$t('usd'),
                    2: this.$t('hkd')
                }
                return this.$t(
                    'mixBuyMoney',
                    this.initialInvestAmount,
                    CURRENCYEUMN[this.currency.type]
                )
            }
            return ''
        },
        // 錯誤提示文案
        getTagText() {
            this.tagText = this.checkBuy(false) || ''
        }
    },
    i18n: {
        zhCHS: {
            FundReturn: '拼团最低可返',
            subscribeApply: '申购申请已提交',
            subscribeSuccess: '同行申购成功，团队已满员',
            invitation: '还差 5人，赶快邀请好友来拼团吧',
            invitationInfo: '团队已达到标，还可以邀请 999 人',
            startGroup: '我已申购，老司机开团，就差你上车啦！',
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
            submitButtonText: '同意协议并提交',
            dayDone: '日完成',
            day: '日',
            balanceRule: '申购规则',
            stepOne: '申购提交',
            stepTwo: '确认份额',
            stepThree: '查看盈亏',
            confirmTheShare: date =>
                `预计 <span class="text-color">${date}<span/> 确认份额，开始计算收益`,
            earnings: date =>
                `预计 <span class="text-color">${date}<span/> 查看份额、收益`,
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
            Exchange: '点此去换汇',
            hkd: '港币',
            usd: '美元',
            content:
                '您购买资金已超过当前净资产50%，当前购买产品为衍生产品或复杂产品，风险视乎产品特性不同而有所不同，并可招致巨大损失。点击继续申购视为确认自愿承担该产品风险。',
            inputMoney: '请输入申购金额',
            mixBuyMoney: (price, currency) => `最低申购${price}${currency}`,
            noEnoughMoney: `可用余额不足`
        },
        zhCHT: {
            FundReturn: '拼团最低可返',
            subscribeApply: '申购申请已提交',
            subscribeSuccess: '同行申购成功，团队已满员',
            invitation: '还差 5人，赶快邀请好友来拼团吧',
            invitationInfo: '团队已达到标，还可以邀请 999 人',
            startGroup: '我已申购，老司机开团，就差你上车啦！',
            groupBuy: '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
            buySuccess: '申購成功',
            buyMoney: '購買金額',
            buyFile: '基金購買協議',
            buyRule: '申購規則',
            currency: '幣種',
            availableBalance: '可用餘額',
            buyBalance: '购买金额',
            minBugBalance: '最小申購金額',
            buyMoneyNumber: '認購金額',
            continueBalance: '續投金額',
            redemption: '申購費',
            hkd: '港幣',
            usd: '美元',
            submitButtonText: '同意協議並提交',
            dayDone: '日完成',
            day: '日',
            balanceRule: '申購規則',
            stepOne: '認購提交',
            stepTwo: '確認份額',
            stepThree: '查看盈虧',
            confirmTheShare: date =>
                `預計 <span class="text-color">${date}<span/> 確認份額，開始計算收益`,
            earnings: date =>
                `預計 <span class="text-color">${date}<span/> 查看份額、收益`,
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
            Exchange: '點此去換匯',
            content:
                '您購買資金已超過當前淨資產50％，當前購買產品為衍生產品或複雜產品，風險視乎產品特性不同而有所不同，招致致巨大損失。點擊繼續申購確認確認承擔該產品風險。',
            inputMoney: '請輸入申購金額',
            mixBuyMoney: (price, currency) => `最低申購${price}${currency}`,
            noEnoughMoney: `可用餘額不足`
        },
        en: {
            FundReturn: '拼团最低可返',
            subscribeApply: '申购申请已提交',
            subscribeSuccess: '同行申购成功，团队已满员',
            invitation: '还差 5人，赶快邀请好友来拼团吧',
            invitationInfo: '团队已达到标，还可以邀请 999 人',
            startGroup: '我已申购，老司机开团，就差你上车啦！',
            groupBuy: '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
            buySuccess: 'Subscription Successful',
            buyMoney: 'Investment Amount',
            buyFile: 'Fund Investment Agreement',
            buyRule: 'Subscription Rules',
            currency: 'Currency',
            availableBalance: 'Available Balance',
            buyBalance: 'Investment Amount',
            minBugBalance: 'Initial',
            buyMoneyNumber: 'Investment Amount',
            continueBalance: 'Subsequent',
            redemption: 'Subscription Fee',
            submitButtonText: 'Agree to agreement and submit',
            dayDone: 'Complete in X days',
            day: 'Days',
            balanceRule: 'Subscription Rules',
            stepOne: 'Submit',
            stepTwo: 'Fund Units Allocation',
            stepThree: 'Check P/L',
            confirmTheShare: date =>
                `Estimate Fund Units Allocation in <span class="text-color">${date}<span/>`,
            earnings: date =>
                `Estimate Fund Units Allocation in <span class="text-color">${date}<span/>`,
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
            Exchange: 'Click here to Exchange',
            hkd: 'HKD',
            usd: 'USD',
            content:
                'Your purchase funds have exceeded 50% of your current net assets. The current purchase product is a derivative product or a complex product.The risk varies depending on the characteristics of the product and can cause huge losses. Clicking Continue is deemed to be a voluntary acceptance of the risk of the product.',
            inputMoney: 'Please Entry Amount',
            mixBuyMoney: (price, currency) =>
                `Mini. Subs. ${currency} ${price}`,
            noEnoughMoney: `Insufficient in Available Balance`
        }
    }
}
</script>
