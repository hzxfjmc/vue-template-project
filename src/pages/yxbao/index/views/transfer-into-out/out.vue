<template lang="pug">
.block__element-wrapper
    .block__out--header
        h1 转出金额
        NumberKeyboard(
            :placeholder="placeholder"
            :showAllSellBtn="showAllSellBtn"
            @handlerAmount="handlerAmount"
        )
        .block__list(v-if="!check")
            .block__list--item.common-flex-space-between
                .block__list--left 手续费(预计)
                .block__list--right.common-flex-center
                    p.block__fee {{HandlingFee}}
                    p {{Number(fundTradeInfoVO.fastRedemptionFee*100).toFixed(2)}}%
            .block__list--item.common-flex-space-between
                .block__list--left 预计到账金额
                .block__list--right.expectedAmount {{actulAmount}}

    .block__out--title.common-flex-space-between.border-bottom.common-marge-top
        h1 {{$t('C37')}}
        p.tips {{$t('C42')}}
            em.iconfont.icon-iconEBgengduoCopy
    .block__out--content
        .block__out--list(@click="chooseType")
            .left.iconfont(
                :class="[check ?'icon-icon-checkbox-selected':'icon-unchecked']")
            .right
                p {{$t('C18')}}
                p.desc 预计
                    em {{fundTradeInfoVO.buyProfitLoss}}10:00
                    em 点前到账，转出后可立即购买股票，无额度限制，期间正常享受收益
        .block__out--list(@click="chooseType")
            .left.iconfont(
                :class="[check ?'icon-unchecked':'icon-icon-checkbox-selected']"
                )
            .right
                p {{$t('C19')}}
                p.desc {{contentDesc}}
    van-button.btn(
        @click="getBaoCapitalTrade") {{$t('C8')}}

</template>
<script>
import NumberKeyboard from './number-keyboard'
import { getBaoCapitalTrade, getBaoPostion } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import { generateUUID, transNumToThousandMark } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
export default {
    components: {
        NumberKeyboard
    },
    computed: {
        HandlingFee() {
            return (
                this.fundTradeInfoVO.fastRedemptionFee * this.amount
            ).toFixed(2)
        },
        actulAmount() {
            return (
                this.expectedAmount -
                Number(this.fundTradeInfoVO.fastRedemptionFee * 100).toFixed(
                    2
                ) *
                    this.expectedAmount
            ).toFixed(2)
        },
        expectedAmount() {
            if (
                isNaN(
                    this.amount -
                        this.amount * this.fundTradeInfoVO.fastRedemptionFee
                )
            ) {
                return '0.00'
            }
            return (
                this.amount -
                this.amount * this.fundTradeInfoVO.fastRedemptionFee
            ).toFixed(2)
        }
    },
    data() {
        return {
            check: false,
            outType: '',
            amount: 0,
            placeholder: '',
            showAllSellBtn: {
                show: true,
                desc: '全部转出',
                maxAmount: ''
            },
            fundTradeInfoVO: {
                fastRedemptionFee: 0
            },
            customerRemainderQuota: '',
            positionMarketValue: '',
            contentDesc: ''
        }
    },
    async created() {
        await this.getBaoPostion()
        this.getFundDetail()
    },
    methods: {
        async getBaoPostion() {
            try {
                const {
                    customerRemainderQuota,
                    positionMarketValue
                } = await getBaoPostion({
                    currency: 2
                })
                this.positionMarketValue = positionMarketValue
                this.showAllSellBtn.maxAmount = positionMarketValue
                this.placeholder = `可转出${positionMarketValue || 0}港币`
                this.customerRemainderQuota = transNumToThousandMark(
                    customerRemainderQuota
                )
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerAmount(amount) {
            this.amount = amount
        },
        chooseType() {
            this.check = !this.check
        },
        async getFundDetail() {
            try {
                const { fundTradeInfoVO } = await getFundDetail({
                    displayLocation: 3,
                    fundId: this.$route.query.id || this.id
                })
                this.fundTradeInfoVO = fundTradeInfoVO
                this.contentDesc = this.$t([
                    `赎回资金立即到达证券账户，手续费${this.fundTradeInfoVO
                        .fastRedemptionFee *
                        100}%，每人每日限额10万港币；您今日剩余额度：${
                        this.customerRemainderQuota
                    }港币`,
                    `贖回資金立即到達證券賬戶，手續費${this.fundTradeInfoVO
                        .fastRedemptionFee *
                        100}%，每人每日限額10萬港幣；您今日剩餘額度：${
                        this.customerRemainderQuota
                    }港幣`,
                    `The funds will deposit to your account immediately, Handling Fee: ${this
                        .fundTradeInfoVO.fastRedemptionFee *
                        100}%, Limited: 10,000.00HKD Every Day/ Per person; Your remaining amount: HKD ${
                        this.customerRemainderQuota
                    }.`
                ])
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getBaoCapitalTrade() {
            try {
                if (this.amount == 0 || this.amount === this.placeholder)
                    return this.$toast('请输入金额', 'middle')
                if (this.amount < this.fundTradeInfoVO.minFastRedemptionAmount)
                    return this.$toast(
                        [
                            `最低转出${this.fundTradeInfoVO.minFastRedemptionAmount}港币`,
                            `最低轉出${this.fundTradeInfoVO.minFastRedemptionAmount}港幣`,
                            `Mini. Subs HKD ${this.fundTradeInfoVO.minFastRedemptionAmount}`
                        ],
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
                    fundId: this.$route.query.id,
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
.block__out--header {
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
                .block__fee {
                    padding: 0 10px 0 0;
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
        }
    }
}
</style>
