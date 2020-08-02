<template lang="pug">
.block__element-wrapper
    .block__out__fund
        .fund__left(v-if="choosedFund.length")
            p.title.ellipse {{choosedFund[0].fundName}}(
                span {{currencyType===1 ? $t('usd') : $t('hkd')}})
            p.content {{$t('C87')}}:
                span.num {{choosedFund[0].availableBaoBalance | transNumToThousandMark}}
                span.type {{currencyType === 1 ? $t('usd') : $t('hkd')}}
        .fund__more(@click="showFundList = true")
            p.more {{$t('moreFund')}}
                span.iconfont.icon-iconEBgengduoCopy
    .block__out--header
        h1 {{$t('C88')}}
        NumberKeyboard(
            :placeholder="placeholder"
            :currencyType="currencyType"
            :showAllSellBtn="showAllSellBtn"
            @handlerAmount="handlerAmount"
        )
        .block__list(v-if="!check")
            .block__list--item.common-flex-space-between
                .block__list--left {{$t('C22')}}
                .block__list--right.common-flex-center
                    p.block__fee {{HandlingFee}}
                    p {{currencyType===1 ? $t('usd') : $t('hkd')}}
            .block__list--item.common-flex-space-between
                .block__list--left {{$t('C23')}}
                .block__list--right.expectedAmount {{actulAmount}}

    .block__out--title.common-flex-space-between.border-bottom.common-marge-top(@click="goTradeRule")
        h1 {{$t('C37')}}
        p.tips {{$t('C42')}}
            em.iconfont.icon-iconEBgengduoCopy
    .block__out--content
        .block__out--list(@click="chooseType(1)")
            .left.iconfont(
                :class="[check ?'icon-icon-checkbox-selected':'icon-unchecked']")
            .right
                p.sub-title {{$t('C18')}}
                p.desc {{buyProfitLoss}}
        .block__out--list(
            v-if="fundTradeInfoVO.fastRedemptionFee !== 0 && isWhiteUserBit"
            @click="chooseType(2)")
            .left.iconfont(
                :class="[check ?'icon-unchecked':'icon-icon-checkbox-selected']"
                )
            .right
                p.sub-title {{$t('C19')}}
                p.desc {{contentDesc}}
    .block__footer--check()
        em.iconfont(
            @click="checkInfo = !checkInfo"
            :class="[checkInfo ?'icon-icon-checkbox-selected':'icon-unchecked']")
        span {{$t('agreement')}}
            em(@click="openProtocol(filePath)") 《{{ProtocolFile}}》
    van-button.btn(
        @click="getBaoCapitalTrade"
        :disabled="!checkInfo || this.availableBaoBalance === '0'"
        ) {{$t('C8')}}

    .block__footer--loading(v-if="loading")
            Loading(type="spinner" color="#2F79FF")

    van-popup(
        v-model="showFundList"
        position="bottom"
    )   
        .fund__top
            .left {{$t('chooseFundTips')}}
            .right(@click="showFundList = false") {{$t('C15')}}
        .fund__list--item(
            v-if="baoPositionList.length"
            v-for="item in baoPositionList"
            @click="chooseFund(item)"
        )
            .item__left
                p.title.ellipse {{item.fundName}}(
                    span {{item.currency === 1 ? $t('usd') : $t('hkd')}})
                p.content {{$t('C87')}}:
                    span.num {{item.availableBaoBalance | transNumToThousandMark}}
                    span.type {{item.currency === 1 ? $t('usd') : $t('hkd')}}
            .item__right(v-if="item.fundId === choosedFund[0].fundId")
                span.iconfont.icon-tick-
</template>
<script>
import NumberKeyboard from './number-keyboard'
import {
    getBaoCapitalTrade,
    getBaoPostionV2
} from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import { generateUUID, transNumToThousandMark } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
import { getCosUrl } from '@/utils/cos-utils'
import { getFundUserInfo } from '@/service/user-server.js'
import { Loading, Popup } from 'vant'
export default {
    components: {
        NumberKeyboard,
        Loading,
        [Popup.name]: Popup
    },
    computed: {
        HandlingFee() {
            if (
                isNaN(this.fundTradeInfoVO.fastRedemptionFee * this.amount) ||
                !Number(this.amount)
            ) {
                return '0.00'
            }
            if (
                Math.ceil(
                    this.fundTradeInfoVO.fastRedemptionFee * this.amount * 100
                ) /
                    100 ===
                0
            ) {
                return 0.01
            }
            return (
                Math.ceil(
                    this.fundTradeInfoVO.fastRedemptionFee * this.amount * 100
                ) / 100
            ).toFixed(2)
        },
        actulAmount() {
            if (
                isNaN(
                    this.amount -
                        this.fundTradeInfoVO.fastRedemptionFee * this.amount
                )
            ) {
                return '0.00'
            }
            return (this.amount - this.HandlingFee).toFixed(2)
        }
    },
    data() {
        return {
            baoPositionList: [],
            choosedFund: [],
            fundId: '',
            currencyType: 0,
            currencyText: '',
            showFundList: false,
            customerHkdDailyQuota: '',
            customerHkdRemainderQuota: '',
            customerUsdDailyQuota: '',
            customerUsdRemainderQuota: '',
            minFastRedemptionAmount: 0,
            loading: true,
            check: true,
            checkInfo: true,
            outType: '',
            amount: 0,
            placeholder: '',
            showAllSellBtn: {
                show: true,
                desc: 'allOut',
                maxAmount: ''
            },
            fundTradeInfoVO: {
                fastRedemptionFee: 0
            },
            positionMarketValue: '',
            availableBaoBalance: '',
            contentDesc: '',
            buyProfitLoss: '',
            isWhiteUserBit: false,
            customerDailyQuota: '',
            ProtocolFile: '',
            filePath: ''
        }
    },
    async created() {
        await this.getBaoPostionV2()
        await this.getFundDetail()
        this.getFundUserInfo()
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    watch: {
        minFastRedemptionAmount: function(val) {
            if (Number(this.availableBaoBalance) >= Number(val)) {
                this.showAllSellBtn.show = true
            } else {
                this.showAllSellBtn.show = false
            }
        }
    },
    methods: {
        async openProtocol(url) {
            url = await getCosUrl(url)
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        //灰度
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                this.loading = false
                //白名单
                let isWhiteUserBit = this.userInfo.grayStatusBit
                    .toString(2)
                    .split('')
                    .reverse()
                    .join('')[8]
                if (isWhiteUserBit == 1) {
                    this.isWhiteUserBit = true
                    return
                }
            } catch (e) {
                this.$toast(e.msg)
                this.loading = false
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        goTradeRule() {
            this.$router.push({
                name: 'trade-rule',
                query: { id: this.$route.query.id, displayLocation: 3, tab: 1 }
            })
        },
        //获取现金+持仓
        async getBaoPostionV2() {
            try {
                const {
                    baoPositionList,
                    customerHkdDailyQuota,
                    customerHkdRemainderQuota,
                    customerUsdDailyQuota,
                    customerUsdRemainderQuota
                } = await getBaoPostionV2()
                this.baoPositionList = baoPositionList
                this.choosedFund = this.baoPositionList.filter(item => {
                    return item.fundId === this.$route.query.id
                })
                this.fundId = this.choosedFund[0].fundId
                this.availableBaoBalance = this.choosedFund[0].availableBaoBalance
                this.showAllSellBtn.maxAmount = this.availableBaoBalance
                this.customerHkdDailyQuota = customerHkdDailyQuota / 10000
                this.customerHkdRemainderQuota = customerHkdRemainderQuota
                this.customerUsdDailyQuota = customerUsdDailyQuota / 10000
                this.customerUsdRemainderQuota = customerUsdRemainderQuota
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerAmount(amount) {
            this.amount = amount
        },
        chooseType(type) {
            this.check = type === 1
            this.minFastRedemptionAmount = this.check
                ? this.fundTradeInfoVO.minTradeAmount
                : this.fundTradeInfoVO.minFastRedemptionAmount
            this.placeholder = `${this.$t('minTrade')}${transNumToThousandMark(
                this.minFastRedemptionAmount
            )}${this.currencyText}`
        },
        chooseFund(info) {
            if (info.availableBaoBalance > 0) {
                this.showFundList = false
                if (this.fundId === info.fundId) return
                this.fundId = info.fundId
                this.choosedFund = this.baoPositionList.filter(item => {
                    return info.fundId === item.fundId
                })
                this.availableBaoBalance = this.choosedFund[0].availableBaoBalance
                this.showAllSellBtn.maxAmount = this.availableBaoBalance.toString()
                this.getFundDetail()
            }
        },
        async getFundDetail() {
            try {
                const {
                    fundTradeInfoVO,
                    buyProtocolFileList
                } = await getFundDetail({
                    displayLocation: 3,
                    fundId: this.fundId || this.$route.query.id
                })
                this.fundTradeInfoVO = fundTradeInfoVO
                this.currencyType = fundTradeInfoVO.currency.type
                let currencyText =
                    this.currencyType === 1 ? this.$t('usd') : this.$t('hkd')
                this.currencyText = currencyText
                let customerDailyQuota =
                    this.currencyType === 1
                        ? this.customerUsdDailyQuota
                        : this.customerHkdDailyQuota
                let customerRemainderQuota =
                    this.currencyType === 1
                        ? this.customerUsdRemainderQuota
                        : this.customerHkdRemainderQuota
                this.contentDesc = this.$t([
                    `赎回资金立即到达证券账户，手续费${(
                        this.fundTradeInfoVO.fastRedemptionFee * 100
                    ).toFixed(
                        2
                    )}%，每人每日限额${customerDailyQuota}万${currencyText}；您今日剩余额度：${customerRemainderQuota}${currencyText}`,
                    `贖回資金立即到達證券賬戶，手續費${(
                        this.fundTradeInfoVO.fastRedemptionFee * 100
                    ).toFixed(
                        2
                    )}%，每人每日限額${customerDailyQuota}萬${currencyText}；您今日剩餘額度：${customerRemainderQuota}${currencyText}`,
                    `The funds will deposit to your account immediately, Handling Fee: ${(
                        this.fundTradeInfoVO.fastRedemptionFee * 100
                    ).toFixed(
                        2
                    )}%, Limited: ${customerDailyQuota}${currencyText} Every Day/ Per person; Your remaining amount: ${currencyText} ${customerRemainderQuota}.`
                ])
                this.minFastRedemptionAmount = this.check
                    ? this.fundTradeInfoVO.minTradeAmount
                    : this.fundTradeInfoVO.minFastRedemptionAmount
                this.placeholder = `${this.$t(
                    'minTrade'
                )}${transNumToThousandMark(
                    this.minFastRedemptionAmount
                )}${currencyText}`
                this.ProtocolFile = buyProtocolFileList.length
                    ? buyProtocolFileList[0].fileName.split('.')[0]
                    : ''
                this.filePath = buyProtocolFileList.length
                    ? buyProtocolFileList[0].filePath
                    : ''
                let buyProfitLoss = this.$t([
                    `预计${fundTradeInfoVO.buyProfitLoss}10:00前到账，转出后可以立即认购新股和购买股票，无额度限制，期间正常享受收益`,
                    `預計${fundTradeInfoVO.buyProfitLoss}10:00前到賬，轉出後可以立即認購新股和購買股票，無額度限制，期間正常享受收益`,
                    `The funds will deposit to your account on ${fundTradeInfoVO.buyProfitLoss} (Estimated)，It can use to  IPO subscription and stock trading immediately after redemption. Unlimited amount. You can get the daily return befor the it deposit.`
                ])
                this.buyProfitLoss = buyProfitLoss
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getBaoCapitalTrade() {
            try {
                if (this.amount == 0 || this.amount === this.placeholder)
                    return this.$toast(this.$t('C40'), 'middle')
                if (this.amount > Number(this.availableBaoBalance)) {
                    return this.$toast(this.$t('C84'), 'middle')
                }
                if (
                    this.amount <
                    Number(
                        this.check
                            ? this.fundTradeInfoVO.minTradeAmount
                            : this.fundTradeInfoVO.minFastRedemptionAmount
                    )
                ) {
                    let minFastRedemptionAmount = this.check
                        ? this.fundTradeInfoVO.minTradeAmount
                        : this.fundTradeInfoVO.minFastRedemptionAmount

                    return this.$toast(
                        this.$t([
                            `最低转出${Number(minFastRedemptionAmount).toFixed(
                                2
                            )}${this.currencyType === 1 ? '美元' : '港币'}`,
                            `最低轉出${Number(minFastRedemptionAmount).toFixed(
                                2
                            )}${this.currencyType === 1 ? '美元' : '港幣'}`,
                            `Mini. Subs ${
                                this.currencyType === 1 ? 'USD' : 'HKD'
                            } ${Number(minFastRedemptionAmount).toFixed(2)}`
                        ]),
                        'middle'
                    )
                }
                let customerRemainderQuota =
                    this.fundTradeInfoVO.currency.type === 1
                        ? this.customerUsdRemainderQuota
                        : this.customerHkdRemainderQuota
                if (
                    this.amount > Number(customerRemainderQuota) &&
                    !this.check
                ) {
                    return this.$toast(this.$t('C85'), 'middle')
                }
                if (
                    this.amount <
                    this.amount * this.fundTradeInfoVO.fastRedemptionFee
                ) {
                    return this.$toast(this.$t('C41'), 'middle')
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
                let outType = this.check ? 1 : 2
                const res = await getBaoCapitalTrade({
                    amount: this.amount,
                    fundId: this.fundId || this.$route.query.id,
                    outType: outType,
                    recordType: 2,
                    requestId: generateUUID(),
                    tradeToken: data.token
                })
                this.$close()
                this.$router.push({
                    name: 'order-details',
                    params: { data: res }
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
h1 {
    font-size: 16px;
    font-family: yxFont;
    font-weight: 700;
}
.block__out__fund {
    padding: 15px 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    color: rgba(25, 25, 25, 0.5);
    .title {
        font-size: 16px;
        color: $text-color;
    }
    .num {
        padding-left: 4px;
    }
    .fund__left {
        width: 70%;
    }
}
.block__out--header {
    margin-top: 6px;
    padding: 20px 12px;
    background: #fff;
    .desc {
        font-size: 12px;
        margin: 9px 0;
        color: $text-color6;
    }
    .block__list {
        display: flex;
        flex-direction: column;
        .block__list--item {
            color: $text-color6;
            margin: 20px 0 0 0;
            .block__list--right {
                color: $text-color;
                font-size: 16px;
                .border-rotate {
                    position: relative;
                }
                .border-rotate:after {
                    content: '';
                    position: absolute;
                    background: #191919;
                    width: 100%;
                    height: 1px;
                    top: 10px;
                    left: 0;
                    transform: rotate(5deg);
                }
                span {
                    width: 65px;
                    font-size: 14px;
                    margin: 0 10px;
                    height: 20px;
                    background: #fb7123;
                    line-height: 20px;
                    border-radius: 5px;
                    color: #fff;
                    position: relative;
                    em {
                        font-style: normal;
                        font-size: 12px;
                        display: inline-block;
                        height: 100%;
                    }
                    .num {
                        // line-height: 20px;
                        font-size: 14px;
                        display: inline-block;
                        height: 100%;
                    }
                    &:after {
                        content: '';
                        border-top: 4px solid transparent;
                        border-bottom: 4px solid transparent;
                        border-left: 4px solid #fb7123;
                        width: 0;
                        height: 0;
                        right: -4px;
                        position: absolute;
                    }
                }
            }

            .expectedAmount {
                font-family: 'yxFontDINPro-Medium';
            }
        }
    }
}
.block__out--title {
    background: #fff;
    padding: 20px 12px 12px 12px;
    .tips {
        color: $text-color6;
        em {
            font-size: 15px;
            padding: 0 0 0 6px;
        }
    }
}
.icon-icon-checkbox-selected {
    color: #0d50d8;
}
.block__out--content {
    background: #fff;
    padding: 0 12px 14px 12px;
    .block__out--list {
        display: flex;
        padding: 14px 0 0 0;
        font-size: 12px;
        flex-direction: row;
        em {
            font-style: normal;
        }
        .left {
            width: 20px;
        }
        .right {
            flex: 1;
            .sub-title {
                font-size: 14px;
            }
            .desc {
                margin: 6px 0 0 0;
                color: $text-color6;
            }
        }
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
.fund__top {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    font-size: 12px;
    color: rgba(25, 25, 25, 0.65);
    line-height: 17px;
}
.fund__list--item {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid $text-color8;
    color: rgba(25, 25, 25, 0.5);
    .item__left {
        width: 80%;
    }
    .title {
        font-size: 16px;
        color: $text-color;
    }
    .num {
        padding-left: 4px;
    }
    .iconfont {
        color: #2f79ff;
    }
}
</style>
