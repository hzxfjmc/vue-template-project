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
                :thumb="featureThumbMedal"
                title="安全性高xxxxxxx"
                desc="蘋果公司發行，公司穩健，違約風險低"
            )
            media-box.money(
                :thumb="featureThumbMoney"
                title="起購金額低xxxxxxx"
                desc="2000美元可購買xxxxxx"
            )
</template>
<script>
import detailHeaderMixin from '@/mixins/bond/bond-detail/detail-header.js'
import { calcCountDownDay } from '@/utils/tools.js'
export default {
    mixins: [detailHeaderMixin],
    data() {
        return {
            featureThumbMedal: require('@/assets/img/bond/icon-medal.png'),
            featureThumbMoney: require('@/assets/img/bond/icon-money.png'),
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
    computed: {
        colData() {
            let _this = this
            let obj = [
                {
                    title:
                        (this.currentPrice &&
                            this.currentPrice &&
                            this.currentPrice.buyYtm &&
                            (this.currentPrice.buyYtm - 0).toFixed(3) + '%') ||
                        '--',
                    desc: '到期年化收益率',
                    click: () => {
                        this.$dialog.alert({
                            message: `到期收益率指按买入价格买入债券并持有到期，获得的全部利息和本金计算而来的年平均收益率。\n
到期收益率综合考虑了购买价格、持有期限、票面利率等因素，是非常重要的参考要素。\n
注：展示数值为已加入预估佣金、平台使用费之后的到期收益率。`,
                            messageAlign: 'left',
                            confirmButtonText: '我知道了'
                        })
                    },
                    class: 'icon-wenhao'
                },
                {
                    title: calcCountDownDay(
                        _this.bondUneditableInfo &&
                            _this.bondUneditableInfo.dueTime
                    ),
                    desc: '剩餘限期'
                },
                {
                    title:
                        (this.bondUneditableInfo &&
                            this.bondUneditableInfo.enumPaymentFrequency &&
                            this.bondUneditableInfo.enumPaymentFrequency
                                .name) ||
                        '--',
                    desc: '付息頻率'
                }
            ]
            return obj
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-header {
    background-color: rgba($color: #0055ff, $alpha: 0.6);
    border-radius: 10px;
    .header-column {
        padding: 0 10px 14px 14px;
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
                line-height: 17px;
            }
        }
    }
}
.header-features {
    padding: 13px 0;
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
                font-size: 0.28rem;
                line-height: 20px;
            }
        }
    }
    .media-box + .media-box {
        margin-top: 12px;
    }
}
</style>
