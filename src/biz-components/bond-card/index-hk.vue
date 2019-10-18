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
import { Tag } from 'vant'
export default {
    name: 'BondCard',
    components: {
        [Tag.name]: Tag
    },
    props: {
        bondInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 发行人
        issuerName() {
            // 发行人名称长度最长展示18个字符
            return (
                (this.bondInfo &&
                    this.bondInfo.issuerName &&
                    this.bondInfo.issuerName.slice(0, 18)) ||
                '--'
            )
        },
        h2Style() {
            // 发行人名称字体变化策略
            let issuerName = this.issuerName || ''
            let tags = (this.bondInfo && this.bondInfo.tags) || []
            let tagLen = 0
            tags.forEach(tag => {
                tagLen += tag.toString().length
            })
            // 极限条件 issuerName 发行人名称超过 13 个字符
            // 标签有三个，每个三个字符，共 9 个字符
            // 此时按设计稿看，刚好充满一个整行
            // 这里统一设置一个模糊边界策略，只要大于 13 + 9 = 22 就缩小字体
            if (issuerName.length + tagLen > 22) {
                return {
                    flex: 1,
                    fontSize: '0.32rem',
                    lineHeight: '0.44rem'
                }
            }
            return {}
        },
        // 标签
        limitTags() {
            // 最多只取三个标签
            let filterTag =
                (this.bondInfo &&
                    this.bondInfo.tags &&
                    this.bondInfo.tags.slice(0, 3)) ||
                []
            return filterTag
        },
        // 到期年化收益率
        buyYtm() {
            return (
                (this.bondInfo &&
                    this.bondInfo.price &&
                    this.bondInfo.price.buyYtm &&
                    (this.bondInfo.price.buyYtm - 0).toFixed(3) + '%') ||
                '--'
            )
        },
        // 付息频率
        paymentFrequency() {
            return (
                (this.bondInfo &&
                    this.bondInfo.paymentFrequency &&
                    this.bondInfo.paymentFrequency.name &&
                    this.bondInfo.paymentFrequency.name + '付息') ||
                '--'
            )
        },
        // 付息日
        paymentDates() {
            let d = this.bondInfo && this.bondInfo.paymentDates
            d = d ? d.split('|') : ''
            let suffix = d.length > 2 ? '等' : ''
            return d ? d.slice(0, 2).join('、') + suffix : '--'
        }
    }
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
