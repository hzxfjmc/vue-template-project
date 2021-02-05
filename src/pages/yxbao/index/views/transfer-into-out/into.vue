<template lang="pug">
.block__element-wrapper
    .block__out__fund 
        .fund__left(v-if="choosedFund.length")
            p.title.ellipse {{choosedFund[0].fundName}}(
                span {{choosedFund[0].currency === 1 ? $t('usd') : $t('hkd')}})
            p.weak {{$t('yieldInLast7d')}} 
                span.num(
                    :class="{green: choosedFund[0].sevenDaysApy<0}"
                ) {{choosedFund[0].sevenDaysApy*100 | transNumToThousandMark(4)}}%
                span.detail(@click="goToFundDetails(choosedFund[0].fundId)") {{$t('C90')}}
        .fund__more(@click="showFundList = true")
            p.more {{$t('moreFund')}}
                span.iconfont.icon-iconEBgengduoCopy
    .block__out--header
        h1.title {{$t('C27')}}   
        NumberKeyboard(
            :placeholder="placeholder"
            :withdrawBalance="accountInfo.withdrawBalance"
            :currencyType="currencyType"
            :showAllSellBtn='showAllSellBtn'
            @handlerAmount="handlerAmount"
            :openTips="true"
        )
        p.desc {{desc}}
    
    .block__out--title.common-flex-space-between.common-marge-top
        p.title {{$t('C30')}} 
        .tips 
            p.tips--top {{accountTypeStr}}
            p.tips--bottom {{$t('C32')}}：{{accountInfo.withdrawBalance | transNumToThousandMark}}{{currencyType === 1 ? $t('usd') : $t('hkd')}}
    
    .block__footer--check
        em.iconfont(
            @click="checkInfo = !checkInfo"
            :class="[checkInfo ?'icon-icon-checkbox-selected':'icon-unchecked']")
        span {{$t('agreement')}}
            em(@click="openProtocol(filePath)") 《{{ProtocolFile}}》
    van-button.btn(
        @click="getBaoCapitalTrade"
        :disabled="!checkInfo"
        ) {{$t('C9')}}
    
    .block__footer--loading(v-if="loading")
        Loading(type="spinner" color="#2F79FF")
    van-popup(
        :class="{'bottom': isPhoneX}"
        v-model="showFundList"
        position="bottom"
        :closeable="true"
    )   
        .fund__top
            .left {{$t('chooseFundTips2')}}
            .right(@click="showFundList = false") {{$t('C15')}}
        .fund__list--item(
            @click="chooseFund(item.fundId)"
            v-if="fundList.length"
            v-for="item in fundList"
        )
            .item__left
                p.name.ellipse {{item.fundName}}(
                    span {{item.currency === 1 ? $t('usd') : $t('hkd')}})
                p.weak {{$t('yieldInLast7d')}} 
                    span.num(
                        :class="{green: item.sevenDaysApy<0}"
                    ) {{item.sevenDaysApy*100 | transNumToThousandMark(4)}}%
                    span.detail(@click="goToFundDetails(item.fundId)") {{$t('C90')}}
            .item__right(v-if="item.fundId === choosedFund[0].fundId")
                span.iconfont.icon-tick-



</template>
<script>
import NumberKeyboard from './number-keyboard'
import { getBaoCapitalTrade } from '@/service/finance-server.js'
import { getFundDetail, getBaoFundList } from '@/service/finance-info-server.js'
import { getCosUrl } from '@/utils/cos-utils'
import { generateUUID, transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
import { Loading, Popup } from 'vant'
import { getMarketValidFundAccount } from '@/service/user-account-server'
import { getFundUserInfo } from '@/service/user-server.js'
import { mapGetters } from 'vuex'
export default {
    components: {
        NumberKeyboard,
        Loading,
        [Popup.name]: Popup
    },
    data() {
        return {
            checkInfo: true,
            showFundList: false,
            amount: '',
            placeholder: '',
            chargeType: 1,
            accountInfo: {
                withdrawBalance: ''
            },
            fundTradeInfoVO: {},
            userInfo: {},
            currencyType: 0,
            desc: '',
            loading: true,
            ProtocolFile: '',
            filePath: '',
            fundList: [],
            fundId: '',
            choosedFund: [],
            accountTypeStr: '',
            showAllSellBtn: {
                show: true,
                desc: 'allIn',
                maxAmount: ''
            }
        }
    },
    async created() {
        await this.getFundUserInfo()
        await this.getBaoFundList()
        await this.getFundDetail()
        this.handleHsAccountInfo()
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    computed: {
        ...mapGetters(['isLogin']),
        isUSDCurrency() {
            return this.currencyType == 1
        },
        isPhoneX() {
            return (
                /iphone/gi.test(window.navigator.userAgent) &&
                window.screen.height >= 812
            )
        },
        isGrayAuthority() {
            return true
        }
    },
    methods: {
        async getAccountType() {
            /*
            ("0", "Cash Account", "现金账户")
            ("M", "Margin Account", "保证金账户")
            */
            let { assetProp } = await getMarketValidFundAccount({
                // 1 A股，2 港股，3 美股
                marketType: this.isUSDCurrency ? 3 : 2
            })
            let currencyStr = this.isUSDCurrency
                ? this.$t('usStock')
                : this.$t('hkStock')
            this.accountTypeStr =
                assetProp === 'M'
                    ? this.$t('marginAccount', currencyStr)
                    : this.$t('cashAccount', currencyStr)
        },
        async getFundUserInfo() {
            if (!this.isLogin) return
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                console.log(res)
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
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
        handlerAmount(amount) {
            this.amount = amount
        },
        goToFundDetails(fundId) {
            let url = `${window.location.origin}/wealth/yxbao/index.html#/yxbao-details?id=${fundId}&displayLocation=3`
            jumpUrl(3, url)
        },
        async chooseFund(id) {
            this.showFundList = false
            if (this.fundId === id) return
            this.fundId = id
            this.choosedFund = this.fundList.filter(item => {
                return item.fundId === id
            })
            await this.getFundDetail()
            this.loading = true
            await this.handleHsAccountInfo()
        },
        //获取基金详情
        async getFundDetail() {
            try {
                this.fundCorrelationFileList = []
                const {
                    fundTradeInfoVO,
                    buyProtocolFileList
                } = await getFundDetail({
                    displayLocation: 3,
                    fundId: this.fundId || this.$route.query.id,
                    isin: this.$route.query.isin
                })
                this.fundTradeInfoVO = fundTradeInfoVO
                let placeholder = `${transNumToThousandMark(
                    fundTradeInfoVO.initialInvestAmount
                )}${
                    fundTradeInfoVO.currency.type === 1
                        ? this.$t('usd')
                        : this.$t('hkd')
                }${this.$t('above')}`
                this.ProtocolFile =
                    buyProtocolFileList[0] &&
                    buyProtocolFileList[0].fileName.split('.')[0]
                this.filePath =
                    buyProtocolFileList[0] && buyProtocolFileList[0].filePath
                this.placeholder = placeholder
                let desc = this.$t([
                    `预计${fundTradeInfoVO.buyProfitLoss}查看收益`,
                    `預計${fundTradeInfoVO.buyProfitLoss}開始查看收益`,
                    `Check Return on ${fundTradeInfoVO.buyProfitLoss}（Estimated）`
                ])
                this.desc = desc
                this.currencyType = fundTradeInfoVO.currency.type
                this.getAccountType()
            } catch (e) {
                console.log(e)
                this.$toast(e.msg)
            }
        },
        // 获取用户恒生资金账户信息
        async handleHsAccountInfo() {
            try {
                let data = await hsAccountInfo(this.currencyType)
                this.accountInfo = data || {}
                this.showAllSellBtn.show = true
                if (
                    Number(this.accountInfo.withdrawBalance) <
                    Number(this.fundTradeInfoVO.initialInvestAmount)
                ) {
                    this.showAllSellBtn.show = false
                }
                this.showAllSellBtn.maxAmount = data.withdrawBalance
                this.loading = false
                this.$close()
            } catch (error) {
                this.$toast(error.msg, 'middle')
                this.loading = false
                console.log('hsAccountInfo:error:>>>', error)
            }
        },
        // 获取现金+列表
        async getBaoFundList() {
            try {
                const res = await getBaoFundList()
                // 基金七日年化收益从高到底排序
                let fundList = res.sort((pre, cur) => {
                    return Number(cur.sevenDaysApy) - Number(pre.sevenDaysApy)
                })
                this.fundList = fundList.filter(item => {
                    return this.isGrayAuthority || item.isin !== 'HK0000584737'
                })

                this.choosedFund = this.fundList.filter(item => {
                    return item.fundId === this.$route.query.id
                })
                if (this.choosedFund.length) {
                    this.fundId = this.$route.query.id
                } else {
                    this.choosedFund = this.fundList[0]
                    this.fundId = this.fundList[0].fundId
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getBaoCapitalTrade() {
            try {
                if (this.amount == 0 || this.amount === this.placeholder)
                    return this.$toast(this.$t('C34'), 'middle')
                if (Number(this.amount) > this.accountInfo.withdrawBalance) {
                    return this.$toast(this.$t('C83'), 'middle')
                }
                if (
                    this.amount <
                    Number(this.fundTradeInfoVO.initialInvestAmount)
                )
                    return this.$toast(
                        this.$t([
                            `最低转入${Number(
                                this.fundTradeInfoVO.initialInvestAmount
                            ).toFixed(2)}${
                                this.fundTradeInfoVO.currency.type === 1
                                    ? '美元'
                                    : '港币'
                            }`,
                            `最低轉入${Number(
                                this.fundTradeInfoVO.initialInvestAmount
                            ).toFixed(2)}${
                                this.fundTradeInfoVO.currency.type === 1
                                    ? '美元'
                                    : '港幣'
                            }`,
                            `Mini. Subs ${
                                this.fundTradeInfoVO.currency.type === 1
                                    ? 'USD'
                                    : 'HKD'
                            } ${Number(
                                this.fundTradeInfoVO.initialInvestAmount
                            ).toFixed(2)}`
                        ]),
                        'middle'
                    )
                if (this.amount > this.withdrawBalance) {
                    return this.$toast(this.$t('C83'), 'middle')
                }
                if (!this.checkInfo)
                    return this.$toast(
                        this.$t([
                            '请勾选同意协议',
                            '請勾選同意協議',
                            'Please Selct the Protocol'
                        ]),
                        'middle'
                    )
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                if (!data && !data.token) {
                    this.getBaoCapitalTrade()
                    return
                }
                this.$loading()
                const res = await getBaoCapitalTrade({
                    amount: this.amount,
                    chargeType: this.chargeType,
                    fundId: this.fundId || this.$route.query.id,
                    recordType: 1,
                    requestId: generateUUID(),
                    tradeToken: data.token
                })
                this.$close()
                this.$router.push({
                    name: 'order-details',
                    params: { data: res, accountTypeStr: this.accountTypeStr }
                })
            } catch (error) {
                this.$close()
                if (error.desc && error.desc.errorMessage)
                    return this.$toast(error.desc.errorMessage, 'middle')
                if (error.msg) return this.$toast(error.msg, 'middle')
                console.log('申购页面-tradeErrorMsg :', error)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__footer--check {
    width: 343px;
    height: 48px;
    margin: 12px 16px 0 16px;
    color: rgba(25, 25, 25, 0.45);
    font-size: 12px;
    em {
        font-style: normal;
        color: #0d50d8;
    }
    .iconfont {
        font-size: 12px;
        margin: 0 5px 0 0;
    }
}
.btn {
    background: #0d50d8;
    color: #fff;
    width: 343px;
    height: 48px;
    font-size: 16px;
    margin: 20px 16px;
    border-radius: 6px;
}
.title {
    font-size: 16px;
    font-family: yxFont;
    font-weight: 700;
}
.block__out__fund {
    display: flex;
    justify-content: space-between;
    padding: 15px 12px 14px 12px;
    background: #fff;
    .fund__left {
        width: 70%;
    }
    .title {
        margin-bottom: 4px;
        height: 22px;
        font-size: 16px;
        line-height: 22px;
    }
    .weak {
        color: $text-color5;
        .num {
            color: #ea3d3d;
            padding: 0 10px 0 4px;
            &.green {
                color: #28c478;
            }
        }
        .detail {
            font-size: 12px;
            color: #2f79ff;
        }
    }
    .fund__more {
        margin-top: 6px;
        color: $text-color6;
        .iconfont {
            padding-left: 6px;
        }
    }
}
.block__out--header {
    margin-top: 6px;
    padding: 20px 12px 0 12px;
    background: #fff;
    .desc {
        font-size: 12px;
        padding: 9px 0;
        color: $text-color6;
    }
}
.block__out--title {
    background: #fff;
    padding: 15px 12px 14px 12px;
    .tips {
        text-align: right;
        .tips--top {
            font-size: 16px;
            color: $text-color;
        }
        .tips--bottom {
            color: $text-color6;
            font-size: 12px;
            padding: 6px 0 0 0;
        }
    }
}
.fund__top {
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
    font-size: 12px;
    color: rgba(25, 25, 25, 0.65);
    line-height: 17px;
}
.fund__list--item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    font-size: 16px;
    border-top: 1px solid $text-color8;
    .item__left {
        width: 80%;
    }
    .item__right {
        color: #2f79ff;
    }
    .weak {
        font-size: 14px;
        color: $text-color5;
        .detail {
            font-size: 12px;
            color: #2f79ff;
        }
        .num {
            color: #ea3d3d;
            padding: 0 10px 0 4px;
            &.green {
                color: #28c478;
            }
        }
    }
}
.van-popup {
    &.bottom {
        padding-bottom: 20px;
    }
}
.block__footer--loading {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    top: 0;
    left: 0;
    .van-loading {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
}
</style>
<style lang="scss" scoped>
body[data-theme='pro-theme'] {
    .detail {
        color: #daaf6f !important;
    }
    .btn {
        background: #daaf6f;
    }
    .block__footer--check {
        em {
            color: #daaf6f;
        }
    }
    .fund__list--item {
        .iconfont {
            color: #daaf6f;
        }
    }
}
</style>
