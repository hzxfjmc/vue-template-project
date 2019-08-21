<template lang="pug">
    .detail-header
        media-box(
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
                desc="苹果公司发行，公司稳健，违约风险低"
            )
            media-box.money(
                :thumb="featureThumbMoney"
                title="起购金额低xxxxxxx"
                desc="2000美元可购买xxxxxxxxxx"
            )

</template>
<script>
import detailHeaderMixin from '@/mixins/bond/bond-detail/detail-header.js'
export default {
    mixins: [detailHeaderMixin]
}
</script>
<style lang="scss" scoped>
.detail-header {
    background-color: #2f79ff;
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
