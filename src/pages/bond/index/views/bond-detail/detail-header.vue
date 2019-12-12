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
