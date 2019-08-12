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
                .rate-num {{ bondInfo && bondInfo.price && bondInfo.price.buyYtm || '--'}}
                .card-tips 到期年化收益率
            .flex-fixed-container
                .interest-num {{ bondInfo && bondInfo.paymentFrequency && bondInfo.paymentFrequency.name || '--'}}
                .card-tips 每半年付息
</template>

<script>
import { Tag } from 'vant'
import { mapGetters } from 'vuex'
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
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['lang']),
        limitTags() {
            // 最多只取三个标签
            let filterTag =
                (this.bondInfo &&
                    this.bondInfo.tags &&
                    this.bondInfo.tags.slice(0, 3)) ||
                []
            filterTag.forEach(tag => {
                // 每个标签最多展示8个字符
                tag.name &&
                    Object.keys(tag.name).forEach(key => {
                        tag.name[key] = tag.name[key].slice(0, 8)
                    })
            })
            return filterTag
        },
        issuerName() {
            return (this.bondInfo && this.bondInfo.issuerName) || '--'
        },
        h2Style() {
            // 发行人名称长度大于10个字，则字体大小变化
            if (this.issuerName.length > 3) {
                return {
                    fontSize: '0.2rem'
                }
            }
            return {}
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
            margin-right: 8px;
            font-size: 0.36rem;
            color: #272727;
            line-height: 25px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .van-tag--plain {
            min-width: 36px;
            height: 16px;
            margin-right: 9px;
            font-size: 0.2rem;
            text-align: center;
            line-height: 14px;
            white-space: nowrap;
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
