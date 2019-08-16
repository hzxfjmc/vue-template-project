<template lang="pug">
    .bond-card
        .bond-card__header
            h2(:style="h2Style") {{ issuerName }}
            van-tag(
                v-for="(tagItem, index) in limitTags"
                :key="index"
                color="#2587EB"
                plain
            ) {{ tagItem.name && tagItem.name.zhCn }}
        .bond-card__content
            .flex-fixed-container
                .rate-num {{ buyYtm }}
                .card-tips 到期年化收益率
            .flex-fixed-container
                .interest-num {{ paymentDates }}
                .card-tips {{ paymentFrequency }}
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
                    this.bondInfo.issuerName.zhCn &&
                    this.bondInfo.issuerName.zhCn.slice(0, 18)) ||
                '--'
            )
        },
        h2Style() {
            // 发行人名称字体变化策略
            let issuerName = this.issuerName || ''
            let tags = (this.bondInfo && this.bondInfo.tags) || []
            let tagLen = 0
            tags.forEach(tag => {
                tagLen += ((tag.name && tag.name.zhCn) || '').length
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
                    this.bondInfo.paymentFrequency.name) ||
                '--'
            )
        },
        // 付息日
        paymentDates() {
            let d = this.bondInfo && this.bondInfo.paymentDates
            d = d ? d.split('|') : []
            let suffix = d.length >= 2 ? '等' : ''
            return d ? d.slice(0, 2).join('、') + suffix : '--'
        }
    }
}
</script>

<style lang="scss" scoped>
.bond-card {
    margin-top: 10px;
    padding: 15px 12px 22px;
    background-color: white;
    border-radius: 4px;
    .bond-card__header {
        display: flex;
        align-items: center;
        h2 {
            overflow: hidden;
            margin-right: 3px;
            font-size: 0.36rem;
            color: #272727;
            line-height: 25px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .van-tag--plain {
            overflow: hidden;
            min-width: 36px;
            max-width: 89px;
            padding: 1px 4px 1px 5px;
            margin-right: 6px;
            font-size: 0.2rem;
            text-align: center;
            line-height: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .bond-card__content {
        display: flex;
        margin-top: 9px;
        padding: 0 2px;
        .rate-num {
            margin-bottom: 4px;
            color: #f82648;
            font-size: 0.48rem;
            line-height: 31px;
        }
        .interest-num {
            margin-top: 3px;
            margin-bottom: 7px;
            color: #393939;
            font-size: 0.36rem;
            line-height: 25px;
        }
        .card-tips {
            color: rgba(57, 57, 57, 0.4);
            font-size: 0.24rem;
            line-height: 17px;
        }
    }
}
</style>
