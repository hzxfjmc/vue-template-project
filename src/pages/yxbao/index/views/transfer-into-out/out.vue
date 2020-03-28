<template lang="pug">
.block__element-wrapper
    .block__out--header
        h1 转出金额
        NumberKeyboard(
            :placeholder="placeholder"
            :showAllSellBtn="showAllSellBtn"
            @handlerAmount="handlerAmount"
            @allSell= "allSell"
        )
        p.desc 预计{{fundTradeInfoVO.buySubmit}}开始收益
        .block__list(v-if="!check")
            .block__list--item.common-flex-space-between
                .block__list--left 手续费(预计)
                .block__list--right.common-flex-center
                    p.block__fee {{HandlingFee}}
                    p {{Number(fundTradeInfoVO.fastRedemptionFee*100).toFixed(2)}}%
                    //- span.block__tips.common-flex-center 
                    //-     em.num {{Number(fundTradeInfoVO.fastRedemptionFee*100).toFixed(2)}}%
                    //-     //- em 港币
                    //- p.border-rotate {{Number(fundTradeInfoVO.fastRedemptionFee*100+0.5).toFixed(2)}}%
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
                p.desc 赎回资金立即到达证券账户，手续费{{fundTradeInfoVO.fastRedemptionFee*100}}%，每人每日限额10万港币：您今日剩余额度：{{customerRemainderQuota}}港币
    van-button.btn(
        @click="getBaoCapitalTrade"
        :disabled="disabled") {{$t('C8')}}

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
                Number(this.fundTradeInfoVO.fastRedemptionFee * 100).toFixed(
                    2
                ) * this.expectedAmount
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
        disabled() {
            return this.amount == 0
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
            check: true,
            outType: '',
            amount: 0,
            placeholder: '',
            showAllSellBtn: {
                show: true,
                desc: '全部转出'
            },
            fundTradeInfoVO: {
                fastRedemptionFee: 0
            },
            customerRemainderQuota: '',
            positionMarketValue: ''
        }
    },
    async created() {
        await this.getBaoPostion()
        this.getFundDetail()
    },
    methods: {
        allSell() {
            if (this.positionMarketValue == 0) return
            this.placeholder = this.positionMarketValue
            this.amount = this.placeholder
        },
        //获取持仓数据
        async getBaoPostion() {
            try {
                const {
                    customerRemainderQuota,
                    positionMarketValue
                } = await getBaoPostion({
                    currency: 2
                })
                this.positionMarketValue = positionMarketValue
                this.placeholder = `最大可取金额${positionMarketValue || 0}`
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
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getBaoCapitalTrade() {
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                if (!data && !data.token) {
                    this.getBaoCapitalTrade()
                    return
                }
                let outType = this.check ? 1 : 2
                const res = await getBaoCapitalTrade({
                    amount: this.amount,
                    fundId: 58,
                    outType: outType,
                    recordType: 2,
                    requestId: generateUUID(),
                    tradeToken: data.token
                })
                this.$router.push({
                    name: 'order-details',
                    params: { data: res }
                })
            } catch (error) {
                if (error.desc.errorMessage)
                    return this.$toast(error.desc.errorMessage)
                if (error.msg) return this.$toast(error.msg)
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
