<template lang="pug">
    .detail-header
        media-box.bond-info(
            :title="headerTitle"
            :desc="headerDesc"
        )
        col-msg.header-column(
            :col-data="colData"
            :wrapperStyle="wrapperStyle"
            :titleStyle="titleStyle"
            :descStyle="descStyle"
        )
        .header-features
            media-box.medal(
                v-for="(titleItem, index) in bondTitleInfo"
                :key="index"
                :thumb="featureThumbList[index]"
                :title="titleItem.mainTitle"
                :desc="titleItem.subTitle"
            )
</template>
<script>
import detailHeaderMixin from '@/mixins/bond/bond-detail/detail-header.js'
export default {
    mixins: [detailHeaderMixin],
    data() {
        return {
            featureThumbList: [
                require('@/assets/img/bond/icon-medal.png'),
                require('@/assets/img/bond/icon-money.png'),
                require('@/assets/img/bond/icon-house.png'),
                require('@/assets/img/bond/icon-praise.png'),
                require('@/assets/img/bond/icon-umbrella.png')
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
            }
        }
    },
    props: {
        paymentAfterTaxPerYear: {
            type: String,
            default: ''
        }
    },
    computed: {
        // 到期年化利率/參攷認購金額/年稅後派息
        colData() {
            let obj = [
                {
                    title: this.buyYtm,
                    desc: '到期年化收益率',
                    click: () => {
                        this.$dialog.alert({
                            message:
                                '到期收益率指按买入价格买入债券并持有到期，获得的全部利息和本金计算而来的年平均收益率。\n\n' +
                                '到期收益率综合考虑了购买价格、持有期限、票面利率等因素，是非常重要的参考要素。\n\n' +
                                '注：展示数值为已加入预估佣金、平台使用费之后的到期收益率。',
                            messageAlign: 'left',
                            confirmButtonText: '我知道了'
                        })
                    },
                    class: 'icon-wenhao'
                },
                {
                    title: this.subscriptionAmount,
                    desc: '參攷認購金額/份'
                },
                {
                    title: this.solvePaymentAfterTaxPerYear,
                    desc: '年稅後派息/份'
                }
            ]
            return obj
        },
        // 到期年化利率
        buyYtm() {
            return (
                (this.currentPrice &&
                    this.currentPrice.buyYtm &&
                    (this.currentPrice.buyYtm - 0).toFixed(3) + '%') ||
                '--'
            )
        },
        // 參攷認購金額
        subscriptionAmount() {
            return (
                (this.minFaceValue * this.buyPrice &&
                    `${this.currency}${(
                        this.minFaceValue * this.buyPrice
                    ).toFixed(3)}`) ||
                '--'
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
        // 货币单位
        currency() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.symbol) ||
                ''
            )
        },
        // 年稅後派息
        solvePaymentAfterTaxPerYear() {
            return (
                (this.paymentAfterTaxPerYear &&
                    `${this.currency}${(
                        this.paymentAfterTaxPerYear - 0
                    ).toFixed(3)}`) ||
                '--'
            )
        },
        // 债券特性列表
        bondTitleInfo() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.bondTitleInfo) ||
                []
            )
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-header {
    background-color: rgba($color: #0055ff, $alpha: 0.6);
    border-radius: 10px;
    .header-column {
        padding: 0 10px 20px 14px;
        border-bottom: 1px solid #e6e6e6;
        >>> .van-col {
            flex-grow: 0;
        }
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
                width: 40px;
                height: 40px;
                margin-right: 20px;
                margin-left: 12px;
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
