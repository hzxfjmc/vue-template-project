<template lang="pug">
    .subscribe-wrapper
        .fond-des
            .fond-name {{ fundName }}

        .fund--block-content
            .fund-content
                .fund--block--top
                    .fund--header-title
                        .fund-title 定投金额
                        .fund-desc 交易规则
                    .fund--header--input.border-bottom
                        NumberKeyboard( 
                            :placeholder="placeholder"
                            @handlerAmount="handlerAmount")
                    .fund--header--footer
                        .fund--header--list
                            .fund-left 申购费(预计)
                            .fund-right {{HandlingFee}} ({{(fundTradeInfoVO.subscriptionFee * 100).toFixed(2)}}%)
                                //- em 1.00港币
                        .fund--header--list
                            .fund-left 订单总金额
                            .fund-right {{actulAmount}}
                
                .fund--block--exchange
                    .fund--blcok--etop
                        span 当金额不足时，自动换汇
                            em.iconfont.icon-iconEBshoucang2
                        span.iconfont(
                            @click="()=>{this.exchangeFlag = !this.exchangeFlag}"
                            :class="[exchangeFlag?'icon-selected':'icon-unchecked']")
                    p(v-if="exchangeFlag") 定投日自动于银行扣款AAAA港币。并于证券账户扣款时按实时汇率兑换BBBB美元。兑换后剩余的港币会留存于你的证券账户
                .fund--block--floor
                    .fund--list--item.border-bottom(@click="showBankType = true")
                        .item--top 扣款方式
                            em.iconfont.icon-iconEBshoucang2
                        .item--bottom(v-if="!bankInfo.bankName")
                            .item--left 点此选择扣款方式
                            .item--right.iconfont.icon-iconEBgengduoCopy
                        .li(v-else)
                            .block--left
                                .bank-name {{bankInfo.bankName}}
                                    span {{bankInfo.eddaSwitch?$t(['已授权','已授權','Authorized']):$t(['已失效', '已失效', 'Expired'])}}
                                .limit-text 
                                    .text-show
                                        span(style="font-size:12px" ) {{$t(['您的EDDA额度为：单笔','您的EDDA額度為：單筆','Your EDDA limit: '])}}
                                        span {{Number(bankInfo.mandateAmount).toFixed(2) | thousand-spilt}}
                                        span(v-if="bankInfo.mandateAmount" ) {{$t(['港币','港幣','HKD'])}}
                                    span.modify-text(@click="modifyHandle(bankInfo)") {{$t(['点此修改','點此修改','Click here to apply again.'])}}

                    .fund--list--item(@click="protocolShow = true")
                        .item--top 定投周期
                        .item--content 
                            .item--left.item--block--wrapper {{fixedCycleTypeObj.key[0]}} {{fixedCycleTypeObj.key[1]}}
                                .item--right.iconfont.icon-iconEBgengduoCopy
                            p 下个转入日02月12日，如遇非交易日顺延
                           
                        
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
import { hanlderCreateFundFixedPlan } from '@/service/finance-server.js'
import jsBridge from '@/utils/js-bridge.js'
import { transNumToThousandMark, generateUUID } from '@/utils/tools.js'
import picker from './components/picker'
import { mapGetters } from 'vuex'
import { getFundUserInfo } from '@/service/user-server.js'
import { Loading } from 'vant'
import NumberKeyboard from './components/number-keyboard'
import protocolPopup from './components/protocol-popup'
import twoPicker from './components/two-picker'
import { queryMandateBank } from '@/service/stock-capital-server'

import './index.scss'
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
            exchangeFlag: true,
            fundName: '',
            bankList: [],
            buyProtocolFileList: [],
            fundTradeInfoVO: {},
            protocolVisible: false,
            amount: '',
            isCheckedProtocol: true,
            placeholder: '请输入金额',
            fixedCycleTypeObj: {
                key: ['每周', '周一'],
                type: 1,
                value: 1
            }
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    async created() {
        this.getFundDetailInfo()
        this.getFundUserInfo()
        this.queryMandateBank()
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
        handlerFixedCycleType(val) {
            this.fixedCycleTypeObj = val
        },
        //创建定投计划
        async hanlderCreateFundFixedPlan(token) {
            try {
                let params = {
                    chargeType: 1,
                    displayLocation: 1,
                    eddaBankAccount: '1',
                    eddaBankCode: '1',
                    eddaBankName: {
                        en: 'steady',
                        zhCn: '稳健',
                        zhHk: '穩健'
                    },
                    exchangeFlag: 1,
                    fixedCycleType: this.fixedCycleTypeObj.type,
                    fixedCycleValue: this.fixedCycleTypeObj.value,
                    fixedPlanAmount: this.amount,
                    fundId: this.$route.query.id,
                    requestId: generateUUID(),
                    tradeToken: token
                }
                params.exchangeFlag = this.exchangeFlag ? 0 : 1
                const res = await hanlderCreateFundFixedPlan(params)
                console.log(res)
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
                this.bankList = [{ type: 1, check: true }]
                let { list } = await queryMandateBank(params)
                list.map(item => {
                    item.check = false
                    item.type = 2
                })
                this.bankList = this.bankList.concat(list)
                console.log(this.bankList)
                this.$close()
            } catch (e) {
                e.msg && this.$toast(e.msg)
                this.$close()
            }
        },
        checkBankHandle(val) {
            this.bankInfo = val
            console.log(this.bankInfo)
        },
        handlerAmount(val) {
            this.amount = val
        },
        async handlerSubmitFilter() {
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
                    buyProtocolFileList
                } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundName = fundHeaderInfoVO.fundName
                this.fundTradeInfoVO = fundTradeInfoVO
                this.buyProtocolFileList = buyProtocolFileList
                this.buyProtocolFileList.map(item => {
                    item.fileName = item.fileName.split('.')[0]
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    i18n: {
        zhCHS: {
            protocolTips: '已阅读并同意服务协议及风险提示，并查阅相关信息'
        },
        zhCHT: {
            protocolTips: '已閱讀並同意服務協議及風險提示，並查閱相關信息'
        },
        en: {
            protocolTips:
                'I have read and agree to the service agreement and risk warning, and consult relevant information'
        }
    }
}
</script>
