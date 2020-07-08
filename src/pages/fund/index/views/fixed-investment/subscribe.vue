<template lang="pug">
    .subscribe-wrapper
        .fond-des
            .fond-name {{ fundName }}
        .fund--block-content
            .fund-content
                .fund--block--top
                    .fund--header-title
                        .fund-title {{$t('A3')}}
                        .fund-desc(@click="goToTradeRule") {{$t('A4')}}
                    .fund--header--input.border-bottom
                        NumberKeyboard( 
                            :currency= "fundTradeInfoVO.currency.name"
                            :placeholder="placeholder"
                            @handlerAmount="handlerAmount")
                    .fund--header--footer
                        .fund--header--list
                            .fund-left {{$t('A5')}}
                                span.iconfont.icon-iconEBshoucang2(@click="show=true")
                            .fund-right {{HandlingFee}} ({{feeRate}}%)
                                //- em 1.00港币
                        .fund--header--list
                            .fund-left {{$t('A7')}}
                            .fund-right {{actulAmount}}
                
                .fund--block--exchange
                    .fund--blcok--etop
                        span {{$t('A13')}}
                            em.iconfont.icon-iconEBshoucang2(@click="ShowAutomaticExchange")
                        span.iconfont(
                            @click="hanlderExchangFlag"
                            :class="[exchangeFlag?'icon-selected':'icon-unchecked']")
                    p(v-if="exchangeFlag") 
                        span(v-if="!flag") {{$t('A14')}}
                        span(v-else) {{$t([`定投日自动于银行扣款${isNaN(amount)?'0.00':(amount*7.9).toFixed(2)}港币。并于证券账户扣款时按实时汇率兑换${isNaN(amount)?'0.00':Number(amount).toFixed(2)}美元。兑换后剩余的港币会留存于你的证券账户。`,`定投日自動於銀行扣款${isNaN(amount)?'0.00':(amount*7.9).toFixed(2)}港幣。並於證券帳戶扣款時按即時匯率兌換${isNaN(amount)?'0.00':Number(amount).toFixed(2)}美元。兌換後剩餘的港幣會留存於你的證券帳戶。`,`HK$${isNaN(amount)?'0.00':(amount*7.9).toFixed(2)} will be automatically deducted from your bank account in the day of AIP. The capital will be changed into US$${isNaN(amount)?'0.00':Number(amount).toFixed(2)} according to the instant exchange rate of securities accounts. The remaining HK$ will be retained in your securities account after the exchange. `])}}
                   

                .fund--block--floor
                    .fund--list--item.border-bottom
                        .item--top {{$t('A15')}}
                            em.iconfont.icon-iconEBshoucang2(@click="showEddaComfim")
                        .item--content(@click="showBankType = true")
                            .item--bottom(
                                v-if="!bankInfo.bankName")
                                .item--left {{$t('A16')}}
                                .item--right.iconfont.icon-iconEBgengduoCopy
                            .li(v-if="bankInfo.type == 2")
                                .block--left
                                    .bank-name {{bankInfo.bankName}} ({{bankInfo.bankAccountNo && bankInfo.bankAccountNo.slice(-4)}})
                                        span {{bankInfo.eddaSwitch?$t(['已授权','已授權','Authorized']):$t(['已失效', '已失效', 'Expired'])}}
                                    .limit-text 
                                        .text-show
                                            span(style="font-size:12px" ) {{$t(['您的EDDA额度为：单笔','您的EDDA額度為：單筆','Your EDDA limit: '])}}
                                            span {{Number(bankInfo.mandateAmount).toFixed(2) | thousand-spilt}}
                                            span(v-if="bankInfo.mandateAmount" ) {{$t(['港币','港幣','HKD'])}}
                                        span.modify-text(@click="modifyHandle(bankInfo)") {{$t(['点此修改','點此修改',' to apply again.'])}}
                            .li(v-if="bankInfo.type == 1")
                                .block--left
                                    .bank-name {{bankInfo.bankName}}
                                    .limit-text 
                                        .text-show
                                            span(style="font-size:12px" ) {{$t('A22')}}
                                     

                    .fund--list--item(@click="protocolShow = true")
                        .item--top {{$t('A30')}}
                        .item--content 
                            .item--left.item--block--wrapper {{fixedCycleTypeObj.key[0]}} {{fixedCycleTypeObj.key[1]}}
                                .item--right.iconfont.icon-iconEBgengduoCopy
                            p {{$t([`下个转入日${date}`,`下個轉入日${date}`,`Next Debit Date ${date}`])}}
                           
                        
        .fund-footer-content
            .protocol
                .protocol__checkbox.iconfont.icon-unchecked(:class="isCheckedProtocol ?'icon-selected checked':''" @click="checkProtocol")
                .protocol__text(@click="checkProtocol") {{$t('protocolTips')}}
                .protocol__button.iconfont.icon-iconshouqi(@click="showProtocol")
            van-button(@click="handlerSubmitFilter") {{$t('A104')}}
        
        picker(
            v-model="showBankType"
            :bankList="bankList"
            @checkBankHandle="checkBankHandle")
        protocol-popup(
            v-model="protocolVisible"
            :protocolFileList="buyProtocolFileList"
            )
        twoPicker( 
            @handlerFixedCycleType="handlerFixedCycleType"
            v-model="protocolShow")
        .block__footer--loading(v-if="loading")
            Loading(type="spinner" color="#2F79FF")
        van-dialog(v-model="show" :title="$t('A106')" :confirmButtonText="$t('iknow')")
            .block--content
                .block--list--item
                    .left {{$t('A105')}}
                    .right {{Number(fundFixedFeeVO.feeDiscount*100).toFixed(2)}}%
                .block--list--item
                    .left {{$t('A10')}}
                    .right {{$t([`第${fundFixedFeeVO.feeRefund}期`,`第${fundFixedFeeVO.feeRefund}期`,`Issue ${fundFixedFeeVO.feeRefund}`])}}
                p {{$t([`第${fundFixedFeeVO.feeRefund}期交易成功后返还前${fundFixedFeeVO.feeRefund}期的手续费折扣，以后每期交易成功后返还对应的手续费折扣`,`第${fundFixedFeeVO.feeRefund}期交易成功後返還前${fundFixedFeeVO.feeRefund}期的手續費折扣，以後每期交易成功後返還對應的手續費折扣`,`The fee discount of the first ${fundFixedFeeVO.feeRefund} periods will be returned after the successful of the ${fundFixedFeeVO.feeRefund}transaction. The corresponding fee discount will be returned after each successful transaction for the coming order.`])}}

</template>
<script>
import {
    getFundDetail,
    getFundFeeConfigV1
} from '@/service/finance-info-server.js'
import {
    hanlderCreateFundFixedPlan,
    getRecentDeductionDate,
    getUpdateFundFixedPlanInfo,
    getFundPositionV2
} from '@/service/finance-server.js'
import { getMarketValidFundAccount } from '@/service/user-account-server.js'
import jsBridge from '@/utils/js-bridge.js'
import {
    transNumToThousandMark,
    generateUUID,
    jumpUrl,
    debounce
} from '@/utils/tools.js'
import picker from './components/picker'
import { mapGetters } from 'vuex'
import { getFundUserInfo } from '@/service/user-server.js'
import { Loading } from 'vant'
import NumberKeyboard from './components/number-keyboard'
import protocolPopup from './components/protocol-popup'
import twoPicker from './components/two-picker'
import { queryMandateBank } from '@/service/stock-capital-server'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
import './index.scss'
import dayjs from 'dayjs'

export default {
    name: 'subscribe',
    components: {
        picker,
        Loading,
        twoPicker,
        NumberKeyboard,
        protocolPopup
    },
    data() {
        return {
            show: false,
            bankInfo: {},
            protocolShow: false,
            showBankType: false,
            loading: false,
            exchangeFlag: false,
            fundName: '',
            bankList: [],
            buyProtocolFileList: [],
            fundTradeInfoVO: {
                currency: ''
            },
            protocolVisible: false,
            feeRate: '0.00',
            amount: '',
            isCheckedProtocol: true,
            placeholder: '',
            date: '',
            marketType: 1,
            fundHeaderInfoVO: {},
            fixedCycleTypeObj: {
                key: [
                    this.$t(['每周', '每週', 'Weekly']),
                    this.$t(['周一', '週一', 'Mon.'])
                ],
                type: 1,
                value: 1
            },
            flag: false,
            fundFixedFeeVO: {},
            fixedFundInfo: {},
            subscribeFeeVO: {},
            arrMarketENUM: {
                2: {
                    0: this.$t([
                        '港股现金账户',
                        '港股現金賬戶',
                        'Cash Account(HKD)'
                    ]),
                    M: this.$t([
                        '港股保证金账户',
                        '港股孖展賬戶',
                        'Margin Account(HKD)'
                    ])
                },
                1: {
                    0: this.$t([
                        '美股现金账户',
                        '美股現金賬戶',
                        'Cash Account(USD)'
                    ]),
                    M: this.$t([
                        '美股保证金账户',
                        '美股孖展賬戶',
                        'Margin Account(USD)'
                    ])
                }
            },
            positionStatus: null
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    async created() {
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.initFunc(), 300)
    },
    computed: {
        ...mapGetters([
            'appType',
            'lang',
            'isLogin',
            'openedAccount',
            'appVersion'
        ]),
        currencyName() {
            return CURRENCY_NAME[this.lang][this.fundTradeInfoVO.currency.type]
        },
        actulAmount() {
            if (isNaN(Number(this.amount) + Number(this.HandlingFee))) {
                return '0.00'
            }
            return (Number(this.amount) + Number(this.HandlingFee)).toFixed(2)
        },
        HandlingFee() {
            if (
                isNaN(this.feeRate * this.amount) ||
                !Number(this.amount) ||
                this.feeRate == 0
            ) {
                return '0.00'
            }
            if (Math.ceil(this.feeRate * this.amount * 100) / 100 === 0) {
                return 0.01
            }
            return (
                Math.ceil(this.feeRate * this.amount * 100) / 10000
            ).toFixed(2)
        }
    },
    methods: {
        //费用
        async getFundFeeConfigV1() {
            const { fundFixedFeeVO, subscribeFeeVO } = await getFundFeeConfigV1(
                {
                    fundId: this.$route.query.id
                }
            )
            this.fundFixedFeeVO = fundFixedFeeVO || {}
            this.subscribeFeeVO = subscribeFeeVO
            if (this.subscribeFeeVO.fundFeeLevelVOList.length === 0) {
                this.feeRate = Number(
                    this.subscribeFeeVO.defaultFeeRate * 100
                ).toFixed(2)
            } else {
                this.feeRate = Number(
                    this.subscribeFeeVO.fundFeeLevelVOList[0].feeRate * 100
                ).toFixed(2)
            }
        },
        //点击去修改
        modifyHandle(val) {
            event.stopPropagation()
            if (!val.eddaSwitch || val.bankNumber === '238') {
                this.$alert({
                    message: this.$t([
                        '对应银行服务调整中，暂不支持修改限额。',
                        '對應銀行服務調整中，暫不支持修改限額。',
                        'Cannot edit because of bank system maintenance.'
                    ]),
                    confirmButtonText: this.$t(['我知道了', '我知道了', 'OK'])
                })
                return
            }
            this.openWebView(
                `${window.location.origin}/webapp/open-account/deposit.html?isCloseWebView=true#/modify-amount?id=${val.id}`
            )
        },
        //App页面跳转
        async openWebView(url) {
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        //获取持仓数据
        async getFundPositionV2() {
            try {
                const res = await getFundPositionV2({
                    fundId: this.$route.query.id
                })
                // -1 未持仓 0 已清仓 1 正常持仓 2 初始持仓
                this.positionStatus = res.positionStatus.type
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundPositionV2:error:>>>', e)
            }
        },
        showEddaComfim() {
            this.$alert({
                title: this.$t('A28'),
                message: this.$t('eddaDesc'),
                confirmButtonText: this.$t('iknow')
            })
        },
        ShowAutomaticExchange() {
            this.$alert({
                title: this.$t([`自动换汇`, `自動換匯`, `Automatic exchange`]),
                message: this.$t('exchangeDesc'),
                confirmButtonText: this.$t('iknow')
            })
        },
        initState() {
            if (this.$route.query.type == 1) {
                this.fixedFundInfo = this.$route.query
                this.amount = this.fixedFundInfo.fixedPlanAmount
                this.bankInfo.type = this.fixedFundInfo.chargeType
                this.bankInfo.bankAccountNo = this.fixedFundInfo.eddaBankAccount
                this.bankInfo.bankCode = this.fixedFundInfo.eddaBankCode
                this.bankList.map(item => {
                    if (
                        this.bankInfo.bankAccountNo === item.bankAccountNo &&
                        this.bankInfo.type == 2
                    ) {
                        item.check = true
                    }
                    if (
                        this.bankInfo.type == 1 &&
                        this.bankInfo.type == item.type
                    ) {
                        item.check = true
                    }
                    if (
                        this.bankInfo.bankAccountNo == item.bankAccountNo &&
                        this.bankInfo.type == 2
                    ) {
                        this.bankInfo = item
                    }
                })
                this.flag =
                    this.fundTradeInfoVO.currency.type == 1 &&
                    this.bankInfo.type == 2
                this.fixedCycleTypeObj.key = [
                    this.fixedFundInfo.fixedCycleMonth,
                    this.fixedFundInfo.fixedCycleWeek
                ]
                this.exchangeFlag = this.fixedFundInfo.exchangeFlag == 1
                this.fixedCycleTypeObj.type = this.fixedFundInfo.fixedCycleType
                this.fixedCycleTypeObj.value = this.fixedFundInfo.fixedCycleValue
                console.log(this.fixedCycleTypeObj)
            }
        },
        hanlderExchangFlag() {
            if (this.flag && this.fundTradeInfoVO.currency.type === 1) return
            this.flag =
                this.fundTradeInfoVO.currency.type === 1 &&
                this.bankInfo.bankAccountNo
            this.exchangeFlag = !this.exchangeFlag
        },
        async initFunc() {
            this.getFundUserInfo()
            this.getFundFeeConfigV1()
            this.getRecentDeductionDate(true)
            await this.getFundPositionV2()
            await this.getFundDetailInfo()
            await this.queryMandateBank()
            await this.getMarketValidFundAccount()
            this.initState()
        },
        async getMarketValidFundAccount() {
            try {
                const res = await getMarketValidFundAccount({
                    marketType: this.marketType
                })
                // 0代表现金，M代表孖展
                this.bankList[0].bankName = this.arrMarketENUM[
                    this.fundTradeInfoVO.currency.type
                ][res.assetProp]
                if (this.$route.query.chargeType == 1) {
                    this.bankInfo.bankName = this.arrMarketENUM[
                        this.fundTradeInfoVO.currency.type
                    ][res.assetProp]
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        goToTradeRule() {
            let url = `${window.location.origin}/wealth/fund/index.html#/trade-rule?id=${this.fundHeaderInfoVO.fundId}&assetType=${this.fundHeaderInfoVO.assetType}`
            jumpUrl(3, url)
        },
        //获取交易日
        async getRecentDeductionDate(flag) {
            try {
                let data = {
                    fixedCycleType: this.fixedCycleTypeObj.type,
                    fixedCycleValue: this.fixedCycleTypeObj.value
                }
                if (
                    this.$route.query.fixedCycleValue &&
                    this.$route.query.fixedCycleType &&
                    flag
                ) {
                    data.fixedCycleType = this.$route.query.fixedCycleType
                    data.fixedCycleValue = this.$route.query.fixedCycleValue
                }
                const res = await getRecentDeductionDate(data)
                if (this.lang != 'en') {
                    this.date = dayjs(res).format(
                        this.$t(['MM月DD日', 'MM月DD日'])
                    )
                } else {
                    let month = new Date(res).getMonth()
                    let day = new Date(res).getDay()
                    if (day < 10) {
                        day = `0${day}`
                    }
                    const MONTHEUMC = {
                        1: 'January',
                        2: 'February',
                        3: 'March',
                        4: 'April',
                        5: 'May',
                        6: 'June',
                        7: 'July',
                        8: 'August',
                        9: 'September',
                        10: 'October',
                        11: 'November',
                        12: 'December'
                    }
                    this.date = `${day} ${MONTHEUMC[month]}`
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerFixedCycleType(val) {
            this.fixedCycleTypeObj = val
            this.getRecentDeductionDate(false)
        },
        //创建定投计划
        async hanlderCreateFundFixedPlan(token) {
            try {
                let data = {
                    chargeType: this.bankInfo.type,
                    displayLocation: 1,
                    exchangeFlag: 1,
                    fixedCycleType: this.fixedCycleTypeObj.type,
                    fixedCycleValue: this.fixedCycleTypeObj.value,
                    fixedPlanAmount: this.amount,
                    fundId: this.$route.query.id,
                    requestId: generateUUID(),
                    tradeToken: token
                }
                if (data.chargeType === 2) {
                    data.eddaBankAccount = this.bankInfo.bankAccountNo
                    data.eddaBankCode = this.bankInfo.bankCode
                    data.eddaBankName = {
                        en: this.bankInfo.bankNameEnglish,
                        zhCn:
                            this.bankInfo.bankNameSimple ||
                            this.bankInfo.bankName,
                        zhHk: this.bankInfo.bankNameTraditional
                    }
                }
                let res = {},
                    url
                data.exchangeFlag = this.exchangeFlag ? 1 : 0
                this.$loading()
                if (this.$route.query.fixedPlanCode) {
                    data.fixedPlanCode = this.$route.query.fixedPlanCode
                    await getUpdateFundFixedPlanInfo(data)
                    url = 'my-investment'
                } else {
                    res = await hanlderCreateFundFixedPlan(data)

                    url = 'investment-result'
                }
                this.$close()
                res.fundName = this.fundName
                if (data.chargeType == 1) {
                    res.bankName = this.bankList[0].bankName
                }
                if (url === 'my-investment') {
                    this.$imgToast({
                        message: this.$t('A91'),
                        cb: () => {
                            jsBridge.callApp('command_close_webview')
                        }
                    })
                } else {
                    this.$router.push({
                        query: res,
                        name: url
                    })
                }
                // }
            } catch (e) {
                this.$close()
                this.$toast(e.msg)
            }
        },
        // 查询已授权账户
        async queryMandateBank() {
            try {
                this.$loading()
                let params = {
                    mandateCurrency: 'HKD'
                }
                this.bankList = [
                    {
                        type: 1,
                        check: false,
                        bankName: '',
                        desc: this.$t([
                            `请保证扣款日当天证券账户中有足够资金。`,
                            `請保證扣款日當天證券賬戶中有足夠資金。`,
                            `Please ensure that you have sufficient funds in your security account on the date of the debit.`
                        ])
                    }
                ]
                let { list } = await queryMandateBank(params)
                list.map(item => {
                    item.check = false
                    item.type = 2
                    if (item.eddaSwitch) {
                        this.bankList.push(item)
                    }
                })
                this.$close()
            } catch (e) {
                e.msg && this.$toast(e.msg)
                this.$close()
            }
        },
        checkBankHandle(val) {
            this.bankInfo = val
            this.bankList.map(item => {
                item.check = false
                if (
                    item.type == this.bankInfo.type &&
                    !this.bankInfo.bankAccountNo
                ) {
                    item.check = true
                }
                if (
                    this.bankInfo.bankAccountNo == item.bankAccountNo &&
                    this.bankInfo.type == 2
                ) {
                    item.check = true
                }
            })
            this.flag = this.bankInfo.type === 2
            if (
                this.bankInfo.type == 2 &&
                this.fundTradeInfoVO.currency.type == 1
            ) {
                this.exchangeFlag = true
                this.flag = true
            } else {
                this.exchangeFlag = this.exchangeFlag
                this.flag = false
            }
            if (
                this.bankInfo.type == 1 &&
                this.fundTradeInfoVO.currency.type == 1
            ) {
                this.exchangeFlag = this.exchangeFlag
                this.flag = false
            }
        },
        handlerAmount(val) {
            this.amount = val
            this.subscribeFeeVO.fundFeeLevelVOList.map(item => {
                if (
                    Number(this.amount) >= Number(item.minAmount) &&
                    (!item.maxAmount ||
                        Number(this.amount) < Number(item.maxAmount))
                ) {
                    this.feeRate = Number(item.feeRate * 100).toFixed(2)
                }
            })
        },
        async handlerSubmitFilter() {
            if (!this.isCheckedProtocol) {
                return this.$toast(
                    this.$t([
                        `请阅读并勾选相关协议`,
                        `請閱讀並勾選相關協議`,
                        `Please read and check the relevant agreements`
                    ])
                )
            }
            if (isNaN(Number(this.amount)) || Number(this.amount) === 0) {
                return this.$toast(this.$t('A69'))
            }
            if (
                this.positionStatus != 1 &&
                Number(this.amount) < this.fundHeaderInfoVO.initialInvestAmount
            ) {
                return this.$toast(
                    this.$t([
                        `最低申购${Number(
                            this.fundHeaderInfoVO.initialInvestAmount
                        ).toFixed(2)} ${this.currencyName}`,
                        `最低申購${Number(
                            this.fundHeaderInfoVO.initialInvestAmount
                        ).toFixed(2)} ${this.currencyName}`,
                        `Mini. Subs ${this.currencyName} ${Number(
                            this.fundHeaderInfoVO.initialInvestAmount
                        ).toFixed(2)}`
                    ])
                )
            }
            if (
                this.positionStatus == 1 &&
                Number(this.amount) < this.fundHeaderInfoVO.continueInvestAmount
            ) {
                return this.$toast(
                    this.$t([
                        `最低申购${Number(
                            this.fundHeaderInfoVO.continueInvestAmount
                        ).toFixed(2)} ${this.currencyName}`,
                        `最低申購${Number(
                            this.fundHeaderInfoVO.continueInvestAmount
                        ).toFixed(2)} ${this.currencyName}`,
                        `Mini. Subs ${this.currencyName} ${Number(
                            this.fundHeaderInfoVO.continueInvestAmount
                        ).toFixed(2)}`
                    ])
                )
            }
            if (!this.bankInfo.type) return this.$toast(this.$t('A17'))
            //判断是否修改内容
            let exchangeFlag = this.exchangeFlag ? 1 : 0
            if (
                this.$route.query.type == 1 &&
                this.amount == this.fixedFundInfo.fixedPlanAmount &&
                this.fixedCycleTypeObj.type ==
                    this.fixedFundInfo.fixedCycleType &&
                this.fixedCycleTypeObj.value ==
                    this.fixedFundInfo.fixedCycleValue &&
                exchangeFlag == this.fixedFundInfo.exchangeFlag &&
                this.bankInfo.type == this.fixedFundInfo.chargeType &&
                this.bankInfo.bankAccountNo ==
                    this.fixedFundInfo.eddaBankAccount
            ) {
                return this.$toast(
                    this.$t(['未做任何修改', '未做任何修改', 'No Change Made'])
                )
            }
            if (
                this.$route.query.type == 2 &&
                this.amount == this.fixedFundInfo.fixedPlanAmount &&
                this.fixedCycleTypeObj.type ==
                    this.fixedFundInfo.fixedCycleType &&
                this.fixedCycleTypeObj.value ==
                    this.fixedFundInfo.fixedCycleValue &&
                exchangeFlag == this.fixedFundInfo.exchangeFlag &&
                this.bankInfo.type == this.fixedFundInfo.chargeType &&
                this.bankInfo.bankAccountNo ==
                    this.fixedFundInfo.eddaBankAccount
            ) {
                return this.$toast(
                    this.$t(['未做任何修改', '未做任何修改', 'No Change Made'])
                )
            }

            if (this.derivativeType != 1) {
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
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                let token = data && data.token
                this.hanlderCreateFundFixedPlan(token)
            } catch (error) {
                this.$toast(error.desc.errorMessage)
                console.log('申购页面-tradeErrorMsg :', error)
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

        async openProtocol(url) {
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
        // 获取基金信息
        async getFundDetailInfo() {
            try {
                const {
                    fundHeaderInfoVO,
                    fundTradeInfoVO,
                    buyProtocolFileList,
                    fundOverviewInfoVO
                } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundHeaderInfoVO = fundHeaderInfoVO
                this.fundName = fundHeaderInfoVO.fundName
                this.fundTradeInfoVO = fundTradeInfoVO
                let marketTypeEMUN = {
                    1: 3, //美股市场
                    2: 2, //港股市场
                    3: 1 //a股市场
                }
                this.marketType =
                    marketTypeEMUN[this.fundTradeInfoVO.currency.type]
                this.buyProtocolFileList = buyProtocolFileList
                this.buyProtocolFileList.map(item => {
                    item.fileName = item.fileName.split('.')[0]
                })
                if (this.fundTradeInfoVO.continueInvestAmount === undefined) {
                    this.fundTradeInfoVO.continueInvestAmount = 0
                }
                this.fundHeaderInfoVO.continueInvestAmount = this.fundTradeInfoVO.continueInvestAmount
                this.derivativeType = fundOverviewInfoVO.derivativeType

                this.placeholder = `${
                    this.positionStatus != 1
                        ? Number(
                              this.fundHeaderInfoVO.initialInvestAmount
                          ).toFixed(2)
                        : Number(
                              this.fundTradeInfoVO.continueInvestAmount
                          ).toFixed(2)
                } ${this.fundTradeInfoVO.currency.name}${this.$t(
                    'buyMoneyPlaceHolder'
                )}`
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    i18n: {
        zhCHS: {
            protocolTips: '已阅读并同意服务协议及风险提示，并查阅相关信息',
            buyMoneyPlaceHolder: '起',
            cancel: '取消',
            continue: '继续申购',
            content:
                '您购买资金已超过当前净资产50%，当前购买产品为衍生产品或复杂产品，风险视乎产品特性不同而有所不同，并可招致巨大损失。点击继续申购视为确认自愿承担该产品风险。',
            exchangeDesc:
                '扣款时，如果扣款货币(例如港币)不足，差额部分将通过您其他货币(例如美元)的可取金额自动换汇补充，以避免扣款失败。汇率将遵循换汇发生时APP的最新汇率',
            eddaDesc:
                '如使用EDDA方式扣款，uSMART将会提前于您的银行账户进行扣款并存入您的证券账户，并随后进行证券账户扣款操作。资金存入后为可用资金，您可以使用该资金进行交易，提款等操作。请保证于证券扣款时证券账户有足够的资金以作月供供款。'
        },
        zhCHT: {
            protocolTips: '已閱讀並同意服務協議及風險提示，並查閱相關信息',
            buyMoneyPlaceHolder: '起',
            cancel: '取消',
            continue: '繼續申購',
            content:
                '您購買資金已超過當前淨資產50％，當前購買產品為衍生產品或複雜產品，風險視乎產品特性不同而有所不同，招致致巨大損失。點擊繼續申購確認確認承擔該產品風險。',
            exchangeDesc:
                '扣款時，如果扣款貨幣(例如港幣)不足，差額部分將通過您其他貨幣(例如美元)的可取金額自動換匯補充，以避免扣款失敗。匯率將遵循換匯發生時APP的最新匯率',
            eddaDesc:
                '如使用EDDA方式扣款，uSMART將會提前於您的銀行賬戶進行扣款並存入您的證券賬戶，並隨後進行證券賬戶扣款操作。資金存入後為可用資金，您可以使用該資金進行交易，提款等操作。請保證於證券扣款時證券賬戶有足夠的資金以作月供供款。'
        },
        en: {
            protocolTips:
                'I have read and agree to the service agreement and risk warning, and consult relevant information',
            buyMoneyPlaceHolder: ' Initial Subs',
            cancel: 'cancel',
            continue: 'Continue ',
            content:
                'Your purchase funds have exceeded 50% of your current net assets. The current purchase product is a derivative product or a complex product.The risk varies depending on the characteristics of the product and can cause huge losses. Clicking Continue is deemed to be a voluntary acceptance of the risk of the product.',
            exchangeDesc:
                'The exchange rate will follow the latest exchange rate of the APP when the exchange occurs',
            eddaDesc:
                'If you select EDDA as debit method, uSMART will deduct money from your bank account to your securities account, then deduct from your securities account later for contribution.If you select EDDA as debit method, uSMART will deduct money from your bank account to your securities account, then deduct from your securities account later for contribution.'
        }
    }
}
</script>
