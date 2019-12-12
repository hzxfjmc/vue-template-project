<template lang="pug">
    .detail-header
        media-box.bond-info(
            :class="{ bindstock: hasBindStock }"
            :title="headerTitle"
            :desc="headerDesc"
        )
        .check-stock(
            v-if="hasBindStock"
            @click="jumpToStock"
            :class="{ en: $i18n.lang === 'en' }"
        ) {{ $t('viewStocks') }}
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
export default {
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
                'font-size': '20px',
                'font-family': 'DINPro-Medium,DINPro',
                'line-height': '0.4rem'
            },
            descStyle: {
                'margin-top': '0.12rem',
                color: 'rgba(255, 255, 255, 0.6)',
                'font-size': '12px',
                'line-height': '0.4rem'
            },
            hasBindStock: false
        }
    },
    props: {
        bindStock: {
            type: Object,
            default: () => {}
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
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    border-radius: 10px;
    .header-column {
        padding: 0 10px 20px 14px;
        border-bottom: 1px solid #e6e6e6;
        >>> .van-col {
            flex-grow: 0;
        }
    }
    .check-stock {
        position: absolute;
        top: 21px;
        right: -1px;
        width: 70px;
        height: 30px;
        border: 1px solid #fff;
        padding-left: 10px;
        color: #fff;
        font-size: 13px;
        line-height: 29px;
        border-radius: 15px 0 0 15px;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
        &.en {
            padding-left: 6px;
            font-size: 10px;
        }
    }
}
</style>
<style lang="scss">
// 微调 media-box 样式
.detail-header {
    .media-box.bond-info {
        padding: 20px 14px 18px;
        &.bindstock {
            padding-right: 70px;
            .media-box__title {
                white-space: normal;
            }
        }
        .media-box__content {
            .media-box__title {
                font-size: 0.5rem;
                font-weight: 500;
                font-family: PingFangHK-Medium, PingFangHK;
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
    .icon-wenhao {
        color: #fff;
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
                font-family: PingFangHK-Medium, PingFangHK;
            }
        }
    }
    .media-box + .media-box {
        margin-top: 10px;
    }
}
</style>
