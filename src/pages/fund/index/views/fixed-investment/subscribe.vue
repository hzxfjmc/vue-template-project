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
                            .fund-right {{HandlingFee}} ({{(fundTradeInfoVO.subscriptionFee * 100).toFixed(2)}}%)
                                //- em 1.00港币
                        .fund--header--list
                            .fund-left {{$t('A7')}}
                            .fund-right {{actulAmount}}
                
                .fund--block--exchange
                    .fund--blcok--etop
                        span {{$t('A13')}}
                            em.iconfont.icon-iconEBshoucang2(@click="showEddaComfim")
                        span.iconfont(
                            @click="hanlderExchangFlag"
                            :class="[exchangeFlag?'icon-selected':'icon-unchecked']")
                    p(v-if="exchangeFlag") 
                        span(v-if="!flag") {{$t('A14')}}
                        span(v-else) 定投日自动于银行扣款{{isNaN(amount)?'0.00':(amount*7.9).toFixed(2)}}港币。并于证券账户扣款时按实时汇率兑换{{isNaN(amount)?'0.00':Number(amount).toFixed(2)}}美元。兑换后剩余的港币会留存于你的证券账户。
                   

                .fund--block--floor
                    .fund--list--item.border-bottom(@click="showBankType = true")
                        .item--top {{$t('A15')}}
                            em.iconfont.icon-iconEBshoucang2
                        .item--bottom(v-if="!bankInfo.bankName")
                            .item--left {{$t('A16')}}
                            .item--right.iconfont.icon-iconEBgengduoCopy
                        .li(v-if="bankInfo.type == 2")
                            .block--left
                                .bank-name {{bankInfo.bankName}}
                                    span {{bankInfo.eddaSwitch?$t(['已授权','已授權','Authorized']):$t(['已失效', '已失效', 'Expired'])}}
                                .limit-text 
                                    .text-show
                                        span(style="font-size:12px" ) {{$t(['您的EDDA额度为：单笔','您的EDDA額度為：單筆','Your EDDA limit: '])}}
                                        span {{Number(bankInfo.mandateAmount).toFixed(2) | thousand-spilt}}
                                        span(v-if="bankInfo.mandateAmount" ) {{$t(['港币','港幣','HKD'])}}
                                    span.modify-text(@click="modifyHandle(bankInfo)") {{$t(['点此修改','點此修改','Click here to apply again.'])}}
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
                            p 下个转入日{{date}}
                           
                        
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
                    .right X%
                .block--list--item
                    .left {{$t('A10')}}
                    .right 第二期
                p 第2期交易成功后返还前两期的手续费折扣，以后每期交易成功后返还对应的手续费折扣

</template>
<script>
import { getFundDetail } from '@/service/finance-info-server.js'
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
            amount: '',
            isCheckedProtocol: true,
            placeholder: '',
            date: '',
            marketType: 1,
            fundHeaderInfoVO: {},
            fixedCycleTypeObj: {
                key: ['每周', '周一'],
                type: 1,
                value: 1
            },
            flag: false,
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
                        '港股现金账户',
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
        actulAmount() {
            if (isNaN(Number(this.amount) + Number(this.HandlingFee))) {
                return '0.00'
            }
            return (Number(this.amount) + Number(this.HandlingFee)).toFixed(2)
        },
        HandlingFee() {
            if (
                isNaN(this.fundTradeInfoVO.subscriptionFee * this.amount) ||
                !Number(this.amount)
            ) {
                return '0.00'
            }
            if (
                Math.ceil(
                    this.fundTradeInfoVO.subscriptionFee * this.amount * 100
                ) /
                    100 ===
                0
            ) {
                return 0.01
            }
            return (
                Math.ceil(
                    this.fundTradeInfoVO.subscriptionFee * this.amount * 100
                ) / 100
            ).toFixed(2)
        }
    },
    methods: {
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
            this.$router.push({
                name: 'modify-amount',
                params: {
                    datas: val
                },
                query: {
                    id: val.id,
                    from: this.$route.query.from === 'hk' ? 'hk' : 'dl'
                }
            })
        },
        //获取持仓数据
        async getFundPositionV2() {
            try {
                const res = await getFundPositionV2({
                    fundId: this.$route.query.id
                })
                // -1 未持仓 0 已清仓 1 正常持仓 2 初始持仓
                this.positionStatus = res.positionStatus.type
                console.log(res)
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundPositionV2:error:>>>', e)
            }
        },
        showEddaComfim() {
            this.$alert({
                title: this.$t('A28'),
                message: this.$t('A29'),
                confirmButtonText: this.$t('iknow')
            })
        },
        initState() {
            if (this.$route.query.type == 1) {
                let fixedFundInfo = this.$route.query
                this.amount = fixedFundInfo.fixedPlanAmount
                this.bankInfo.type = fixedFundInfo.chargeType
                this.bankInfo.bankAccountNo = fixedFundInfo.eddaBankAccount
                this.bankInfo.bankCode = fixedFundInfo.eddaBankCode
                console.log(this.bankInfo)
                this.bankList.map(item => {
                    if (
                        this.bankInfo.bankAccountNo === item.bankAccountNo &&
                        fixedFundInfo.exchangeFlag == 1
                    ) {
                        item.check = true
                    }
                    if (item.type == 1 && fixedFundInfo.exchangeFlag == 0) {
                        item.check = true
                    }
                    if (
                        fixedFundInfo.exchangeFlag == 1 &&
                        this.bankInfo.bankAccountNo == item.bankAccountNo
                    ) {
                        this.bankInfo = item
                    }
                })
                this.flag =
                    this.fundTradeInfoVO.currency.type == 1 &&
                    fixedFundInfo.exchangeFlag == 1
                this.fixedCycleTypeObj.key = [
                    fixedFundInfo.fixedCycleMonth,
                    fixedFundInfo.fixedCycleWeek
                ]
                this.exchangeFlag = fixedFundInfo.exchangeFlag == 1
                this.fixedCycleTypeObj.type = fixedFundInfo.fixedCycleType
                this.fixedCycleTypeObj.value = fixedFundInfo.fixedCycleValue
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
                this.date = dayjs(res).format('MM月DD日')
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
                        en: this.bankInfo.bankCode,
                        zhCn: this.bankInfo.bankNameEnglish,
                        zhHk: this.bankInfo.bankNameTraditional
                    }
                }
                let res = {},
                    url
                data.exchangeFlag = this.exchangeFlag ? 1 : 0
                if (this.$route.query.fixedPlanCode) {
                    data.fixedPlanCode = this.$route.query.fixedPlanCode
                    await getUpdateFundFixedPlanInfo(data)
                    url = 'my-investment'
                } else {
                    res = await hanlderCreateFundFixedPlan(data)
                    url = 'investment-result'
                }
                res.fundName = this.fundName
                if (data.chargeType == 1) {
                    res.bankName = this.bankList[0].bankName
                }
                this.$router.push({
                    query: res,
                    name: url
                })
                // }
            } catch (e) {
                console.log(e)
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
                        desc: '请保证扣款日当天证券账户中有足够资金'
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
            // this.flag = this.bankInfo.type === 2
            if (
                this.bankInfo.type == 2 &&
                this.fundTradeInfoVO.currency.type == 1
            ) {
                this.exchangeFlag = true
                this.flag = true
            } else {
                this.exchangeFlag = false
                this.flag = false
            }
        },
        handlerAmount(val) {
            this.amount = val
        },
        handlerSubmitFilter() {
            if (isNaN(Number(this.amount)) || Number(this.amount) === 0)
                return this.$toast('请输入金额')
            if (!this.bankInfo.type) return this.$toast('请选择扣款方式')
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
                    2: 3, //美股市场
                    1: 2, //港股市场
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
                '您购买资金已超过当前净资产50%，当前购买产品为衍生产品或复杂产品，风险视乎产品特性不同而有所不同，并可招致巨大损失。点击继续申购视为确认自愿承担该产品风险。'
        },
        zhCHT: {
            protocolTips: '已閱讀並同意服務協議及風險提示，並查閱相關信息',
            buyMoneyPlaceHolder: '起',
            cancel: '取消',
            continue: '繼續申購',
            content:
                '您購買資金已超過當前淨資產50％，當前購買產品為衍生產品或複雜產品，風險視乎產品特性不同而有所不同，招致致巨大損失。點擊繼續申購確認確認承擔該產品風險。'
        },
        en: {
            protocolTips:
                'I have read and agree to the service agreement and risk warning, and consult relevant information',
            buyMoneyPlaceHolder: ' Initial Subs',
            cancel: 'cancel',
            continue: 'Continue ',
            content:
                'Your purchase funds have exceeded 50% of your current net assets. The current purchase product is a derivative product or a complex product.The risk varies depending on the characteristics of the product and can cause huge losses. Clicking Continue is deemed to be a voluntary acceptance of the risk of the product.'
        }
    }
}
</script>
