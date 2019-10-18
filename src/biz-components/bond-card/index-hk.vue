<template lang="pug">
    .bond-card
        .bond-card__header
            h2(:style="h2Style") {{ issuerName }}
            div(class="tag-box flex")
                van-tag(
                    v-for="(tagItem, index) in limitTags"
                    :key="index"
                    color="#2177FF"
                    plain
                ) {{ tagItem }}
        .bond-card__content
            div
                .text {{ buyYtm }}
                .card-tips 到期年化收益表
            div
                .text {{ buyYtm }}
                .card-tips 參考金額/份
            div
                .text.interest-num
                    span {{ buyYtm }}
                .card-tips 年稅後派息/份
</template>

<script>
import mixin from './mixin'
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
.bond-card {
    margin-bottom: 14px;
    padding: 20px 14px 19px;
    border: 1px solid #f7f7f7;
    background-color: #fff;
    line-height: 1;
    border-radius: 10px;
    box-shadow: 0px 2px 4px 0px rgba($color: $hk-text-color, $alpha: 0.05);
    .bond-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h2 {
            overflow: hidden;
            margin-right: 20px;
            font-size: 0.4rem;
            color: $hk-text-color;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .tag-box {
            margin-right: 8px;
            .van-tag--plain {
                overflow: hidden;
                min-width: 45px;
                max-width: 89px;
                padding: 2px 7px 2px 8px;
                margin-right: 5px;
                font-size: 0.2rem;
                text-align: center;
                line-height: 18px;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-radius: 4px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
    .bond-card__content {
        display: flex;
        margin-top: 25px;
        justify-content: space-between;
        .text {
            color: $hk-text-color;
            font-size: 0.4rem;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .interest-num {
            height: 0.4rem;
            font-size: 0.32rem;
            span {
                vertical-align: sub;
            }
        }
        .card-tips {
            color: rgba($color: $hk-text-color, $alpha: 0.4);
            font-size: 0.24rem;
            line-height: 20px;
        }
    }
}
</style>
