<template lang="pug">
    .detail-header
        media-box(
            :thumb="bondThumb"
            title="苹果"
            desc="苹果 3.651% 2022.03.22"
        )
        van-row.header-column(type="flex" justify="space-between")
            van-col
                .van-col__title 3.651%
                .van-col__desc 到期年化收益率
            van-col
                .van-col__title 3年192天
                .van-col__desc 剩余期限
            van-col
                .van-col__title 2000
                .van-col__desc 起购金额（美元/份
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
import { Row, Col } from 'vant'
import MediaBox from './media-box.vue'
export default {
    name: 'DetailHeader',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        MediaBox
    },
    data() {
        return {
            bondThumb: require('@/assets/img/bond/bond-avatar-demo.png'),
            featureThumbMedal: require('@/assets/img/bond/icon-medal.png'),
            featureThumbMoney: require('@/assets/img/bond/icon-money.png')
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-header {
    background-color: #2f79ff;
    border-radius: 4px;
    .header-column {
        padding: 0 14px 19px;
    }
    .van-col__title {
        color: #fff;
        font-size: 0.4rem;
        line-height: 26px;
    }
    .van-col__desc {
        margin-top: 2px;
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.24rem;
        line-height: 17px;
    }
}
</style>
<style lang="scss">
// 微调 media-box 样式
.header-features {
    background: rgba(0, 0, 0, 0.06);
    padding: 12px 0;
    .media-box {
        padding: 0;
        &.medal {
            margin-left: 13px;
            .media-box__header {
                .media-box__thumb {
                    width: 32px;
                    height: 32px;
                }
            }
        }
        &.money {
            margin-left: 7px;
            .media-box__header {
                .media-box__thumb {
                    width: 38px;
                    height: 38px;
                }
            }
        }
        .media-box__header {
            .media-box__thumb {
                margin-right: 17px;
            }
        }
        .media-box__title {
            font-size: 0.28rem;
            line-height: 20px;
        }
        .media-box__desc {
            color: rgba(255, 255, 255, 0.4);
        }
    }
    .media-box + .media-box {
        margin-top: 15px;
    }
}
</style>
