<template lang="pug">
    .detail-header
        media-box.bond-info(
            :title="headerTitle"
            :desc="headerDesc"
        )
        .check-stock(
            v-if="hasBindStock"
            @click="jumpToStock"
        ) 查看股票
        col-msg.header-column(
            :col-data="colData"
            :wrapperStyle="wrapperStyle"
            :titleStyle="titleStyle"
            :descStyle="descStyle"
        )
        .header-features(v-if="bondTitleInfo.length !== 0")
            media-box.medal(
                v-for="(titleItem, index) in bondTitleInfo"
                :key="index"
                :thumb="featureThumbList[index]"
                :title="titleItem.mainTitle"
                :desc="titleItem.subTitle"
            )
</template>
<script>
import detailHeaderMixin from '../mixins/detail-header.js'
import jsBridge from '@/utils/js-bridge'
import { enumMarketName } from '@/utils/common/global-enum'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    i18n: {
        zhCHS: {
            yieldToMaturity: '到期年化收益率',
            yieldToMaturityTips:
                '到期收益率指按買入價格買入債券並持有到期，獲得的全部利息和本金計算而來的年平均收益率。\n\n' +
                '到期收益率綜合考慮了購買價格、持有期限、票面利率等因素，是非常重要的參攷要素。\n\n' +
                '注：展示數值為已加入預估傭金、平臺使用費之後的到期收益率。',
            refAmountContract: '参考认购金额/份',
            annualInterestContract: '年税后派息/份',
            ok: '我知道了'
        },
        zhCHT: {
            yieldToMaturity: '到期年化收益率',
            yieldToMaturityTips:
                '到期收益率指按買入價格買入債券並持有到期，獲得的全部利息和本金計算而來的年平均收益率。\n\n' +
                '到期收益率綜合考慮了購買價格、持有期限、票面利率等因素，是非常重要的參考要素。\n\n' +
                '注：展示數值為已加入預估佣金、平台使用費之後的到期收益率。',
            refAmountContract: '參攷認購金額/份',
            annualInterestContract: '年稅後派息/份',
            ok: '我知道了'
        },
        en: {
            yieldToMaturity: 'Yield-to-Maturity',
            yieldToMaturityTips:
                'Yield to Maturity is the estimated annual average rate of return investors can expect to set aside to make this bond investment at the current market price (or the target price you entered). It includes accrued interest and the processing fee.',
            refAmountContract: 'Ref. Amount / Contract',
            annualInterestContract: 'Annual Interest / Contract',
            ok: 'OK'
        }
    },
    mixins: [detailHeaderMixin],
    data() {
        return {
            featureThumbList: [
                require('@/assets/img/bond-hk/icon-medal.png'),
                require('@/assets/img/bond-hk/icon-money.png'),
                require('@/assets/img/bond-hk/icon-house.png'),
                require('@/assets/img/bond-hk/icon-praise.png'),
                require('@/assets/img/bond-hk/icon-umbrella.png')
            ],
            titleStyle: {
                color: '#fff',
                'font-size': '0.4rem',
                'line-height': '0.4rem'
            },
            descStyle: {
                'margin-top': '0.12rem',
                color: 'rgba(255, 255, 255, 0.6)',
                'font-size': '0.24rem',
                'line-height': '0.4rem'
            },
            hasBindStock: false
        }
    },
    props: {
        paymentAfterTaxPerYear: {
            type: String,
            default: ''
        },
        bindStock: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 到期年化利率/參攷認購金額/年稅後派息
        colData() {
            let obj = [
                {
                    title: this.buyYtm,
                    desc: this.$t('yieldToMaturity'),
                    click: () => {
                        this.$dialog.alert({
                            message: this.$t('yieldToMaturityTips'),
                            messageAlign: 'left',
                            confirmButtonText: this.$t('ok')
                        })
                    },
                    class: 'icon-wenhao'
                },
                {
                    title: transNumToThousandMark(
                        this.subscriptionAmount.toString(),
                        3
                    ),
                    desc: this.$t('refAmountContract')
                },
                {
                    title: transNumToThousandMark(
                        this.solvePaymentAfterTaxPerYear.toString(),
                        3
                    ),
                    desc: this.$t('annualInterestContract')
                }
            ]
            return obj
        },
        // 參攷認購金額
        subscriptionAmount() {
            return (
                (this.minFaceValue * this.buyPrice &&
                    `${(this.minFaceValue * this.buyPrice).toFixed(3)}`) ||
                ''
            )
        },
        // 最小面额
        minFaceValue() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.minFaceValue - 0) ||
                0
            )
        },
        // 购买价格
        buyPrice() {
            return (
                (this.currentPrice &&
                    this.currentPrice.buyPrice &&
                    this.currentPrice.buyPrice - 0) ||
                0
            )
        },
        // // 货币单位
        // currencySymbol() {
        //     return (
        //         (this.bondUneditableInfo &&
        //             this.bondUneditableInfo.enumCurrency &&
        //             this.bondUneditableInfo.enumCurrency.symbol) ||
        //         ''
        //     )
        // },
        // 年稅後派息
        solvePaymentAfterTaxPerYear() {
            return (
                (this.paymentAfterTaxPerYear &&
                    `${(this.paymentAfterTaxPerYear - 0).toFixed(3)}`) ||
                ''
            )
        }
    },
    methods: {
        jumpToStock() {
            jsBridge.gotoNativeModule(
                `yxzq_goto://stock_quote?market=${
                    enumMarketName[this.bindStock.stockMarket.type]
                }&code=${this.bindStock.stockCode}`
            )
        }
    },
    watch: {
        bindStock() {
            if (
                this.bindStock.stockCode &&
                this.bindStock.stockMarket &&
                this.bindStock.stockMarket.type
            ) {
                this.hasBindStock = true
            } else {
                this.hasBindStock = false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-header {
    position: relative;
    background-color: rgba($color: #0055ff, $alpha: 0.6);
    border-radius: 10px;
    font-family: DINPro-Regular, DINPro;
    .header-column {
        padding: 0 10px 20px 14px;
        border-bottom: 1px solid #e6e6e6;
        >>> .van-col {
            flex-grow: 0;
        }
    }
    .check-stock {
        position: absolute;
        top: 24px;
        right: 10px;
        color: #fff;
        font-size: 16px;
    }
}
</style>
<style lang="scss">
// 微调 media-box 样式
.detail-header {
    .media-box.bond-info {
        padding: 20px 14px 18px;
        .media-box__content {
            .media-box__title {
                font-size: 0.5rem;
                font-weight: 500;
                line-height: 36px;
            }
            .media-box__desc {
                margin-top: 1px;
                color: rgba($color: #fff, $alpha: 0.6);
                font-size: 0.28rem;
                line-height: 20px;
            }
        }
    }
}
.header-features {
    padding: 14px 0 18px 0;
    .media-box {
        padding: 0;
        .media-box__header {
            .media-box__thumb {
                width: 30px;
                height: 30px;
                margin-right: 12px;
                margin-left: 18px;
            }
        }
        .media-box__content {
            .media-box__title {
                font-size: 0.32rem;
                line-height: 22px;
            }
        }
    }
    .media-box + .media-box {
        margin-top: 10px;
    }
}
</style>
