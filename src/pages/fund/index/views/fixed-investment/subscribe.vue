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
                            .fund-right {{HandlingFee}} ({{(fundTradeInfoVO.subscriptionFee * 100).toFixed(2)}}%)
                                //- em 1.00港币
                        .fund--header--list
                            .fund-left {{$t('A7')}}
                            .fund-right {{actulAmount}}
                
                .fund--block--exchange
                    .fund--blcok--etop
                        span {{$t('A13')}}
                            em.iconfont.icon-iconEBshoucang2
                        span.iconfont(
                            @click="hanlderExchangFlag"
                            :class="[exchangeFlag?'icon-selected':'icon-unchecked']")
                    p(v-if="exchangeFlag") {{$t('A14')}}
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
                                        span(style="font-size:12px" ) 请保证扣款日当天证券账户中有足够资金
                                     

                    .fund--list--item(@click="protocolShow = true")
                        .item--top {{$t('A30')}}
                        .item--content 
                            .item--left.item--block--wrapper {{fixedCycleTypeObj.key[0]}} {{fixedCycleTypeObj.key[1]}}
                                .item--right.iconfont.icon-iconEBgengduoCopy
                            p 下个转入日{{date}}，{{$t('A32')}}
                           
                        
            .fund-footer-content
                .protocol
                    .protocol__checkbox.iconfont.icon-unchecked(:class="isCheckedProtocol ?'icon-selected checked':''" @click="checkProtocol")
                    .protocol__text(@click="checkProtocol") {{$t('protocolTips')}}
                    .protocol__button.iconfont.icon-iconshouqi(@click="showProtocol")
                van-button(@click="handlerSubmitFilter") 同意协议并提交
        
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
</template>
<script>
import { getFundDetail } from '@/service/finance-info-server.js'
import {
    hanlderCreateFundFixedPlan,
    getRecentDeductionDate
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
            placeholder: '请输入金额',
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
                3: {
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
            }
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
        initState() {
            if (this.$route.query.type == 1) {
                let fixedFundInfo = this.$route.query
                this.amount = fixedFundInfo.fixedPlanAmount
                this.placeholder = fixedFundInfo.fixedPlanAmount
                this.bankInfo.type = fixedFundInfo.chargeType
                this.bankInfo.bankAccountNo = fixedFundInfo.eddaBankAccount
                this.bankInfo.bankCode = fixedFundInfo.eddaBankCode
                if (fixedFundInfo.eddaBankName) {
                    this.bankInfo.bankCode = fixedFundInfo.eddaBankName.en
                    this.bankInfo.bankNameEnglish =
                        fixedFundInfo.eddaBankName.zhCn
                    this.bankInfo.bankNameTraditional =
                        fixedFundInfo.eddaBankName.zhHk
                }
                this.flag = fixedFundInfo.exchangeFlag === 2
                this.fixedCycleTypeObj.key = [
                    fixedFundInfo.fixedCycleMonth,
                    fixedFundInfo.fixedCycleWeek
                ]
                this.exchangeFlag = fixedFundInfo.exchangeFlag == 0
                this.fixedCycleTypeObj.type = fixedFundInfo.fixedCycleType
                this.fixedCycleTypeObj.value = fixedFundInfo.fixedCycleValue
                console.log(fixedFundInfo)
            }
        },
        hanlderExchangFlag() {
            if (this.flag) return
            this.exchangeFlag = !this.exchangeFlag
        },
        async initFunc() {
            this.getFundUserInfo()
            this.getRecentDeductionDate()
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
                this.bankList[0].bankName = this.arrMarketENUM[this.marketType][
                    res.assetProp
                ]
                if (this.$route.query.chargeType == 1) {
                    this.bankInfo.bankName = this.arrMarketENUM[
                        this.marketType
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
        async getRecentDeductionDate() {
            try {
                let data = {
                    fixedCycleType: this.fixedCycleTypeObj.type,
                    fixedCycleValue: this.fixedCycleTypeObj.value
                }
                if (
                    this.$route.query.fixedCycleValue &&
                    this.$route.query.fixedCycleType
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
            this.getRecentDeductionDate()
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
                data.exchangeFlag = this.exchangeFlag ? 0 : 1
                let res = await hanlderCreateFundFixedPlan(data)
                res.fundName = this.fundName
                if (data.chargeType == 1) {
                    res.bankName = this.bankList[0].bankName
                }
                this.$router.push({
                    query: res,
                    name: 'investment-result'
                })
                // }
            } catch (e) {
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
            this.flag = this.bankInfo.type === 2
            this.exchangeFlag = this.flag
        },
        handlerAmount(val) {
            this.amount = val
        },
        handlerSubmitFilter() {
            if (this.amount === this.placeholder || Number(this.amount) === 0)
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
                this.derivativeType = fundOverviewInfoVO.derivativeType
                this.placeholder = `${Number(
                    this.fundHeaderInfoVO.initialInvestAmount
                ).toFixed(2)}HKD${this.$t('buyMoneyPlaceHolder')}`
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
