<template lang="pug">
    .detail-header
        media-box.sp(
            :title="headerTitle"
            :desc="headerDesc"
        )
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
import detailHeaderMixin from './mixins/detail-header.js'
import { calcCountDownDay } from '@/utils/tools.js'
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
            featureThumbMedal: require('@/assets/img/bond/icon-medal.png'),
            featureThumbMoney: require('@/assets/img/bond/icon-money.png'),
            titleStyle: {
                color: '#fff',
                'font-size': '20px',
                'line-height': '0.52rem'
            },
            descStyle: {
                'margin-top': '0.04rem',
                color: 'rgba(255, 255, 255, 0.6)',
                'font-size': '12px',
                'line-height': '0.34rem'
            }
        }
    },
    computed: {
        // 到期年化利率/剩余期限/起购金额
        colData() {
            return [
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
                    title: this.dueDay,
                    desc: '剩余期限'
                },
                {
                    title: this.minFaceValue,
                    desc: `起购金额(${this.currencyShortSymbol}/份)`
                }
            ]
        },
        // 剩余期限
        dueDay() {
            return calcCountDownDay(
                this.bondUneditableInfo && this.bondUneditableInfo.dueTime
            )
        },
        // 货币单位
        currencyShortSymbol() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.shortSymbol) ||
                ''
            )
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-header {
    overflow: hidden;
    background-color: $primary-color-line;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    border-radius: 4px;
    .header-column {
        padding: 0 10px 14px 14px;
        >>> .van-col {
            flex-grow: 0;
        }
    }
}
</style>
<style lang="scss">
.detail-header {
    .icon-wenhao {
        color: rgba($color: #fff, $alpha: 0.6);
    }
}
.detail-header {
    .media-box.sp {
        .media-box__content {
            .media-box__desc {
                margin-top: 2px;
            }
        }
    }
}
// 微调 media-box 样式
.header-features {
    background: rgba(0, 0, 0, 0.06);
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
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
    .media-box + .media-box {
        margin-top: 12px;
    }
}
</style>
