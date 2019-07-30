<template lang="pug">
    .bond-card
        .bond-card__header
            h2 {{ bondInfo.name }}
            van-tag(
                v-for="(item, index) in bondInfo.tag"
                :key="index"
                color="#2587EB" plain
            ) {{ item }}
        .bond-card__content
            .flex-fixed-container.bond-card-rate
                .rate-num {{ bondInfo.rate.value}}
                .card-tips {{ bondInfo.rate.desc}}
            .flex-fixed-container.bond-card-interest
                .interest-num {{ bondInfo.interest.value}}
                .card-tips {{ bondInfo.interest.desc}}
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
        // name: {
        //     type: String,
        //     default: ''
        // },
        // tag: {
        //     type: Array,
        //     default: () => []
        // },
        // rate: {
        //     type: Object,
        //     default: () => {}
        // },
        // interest: {
        //     type: Object,
        //     default: () => {}
        // }
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
            margin-right: 8px;
            font-size: 18px;
            color: #272727;
            line-height: 25px;
        }
        .van-tag--plain {
            min-width: 36px;
            height: 16px;
            margin-right: 9px;
            font-size: 10px;
            text-align: center;
            line-height: 14px;
        }
    }
    .bond-card__content {
        display: flex;
        margin-top: 9px;
        padding: 0 2px;
        .rate-num {
            margin-bottom: 4px;
            color: #f82648;
            font-size: 24px;
            line-height: 31px;
        }
        .interest-num {
            margin-top: 3px;
            margin-bottom: 7px;
            color: #393939;
            font-size: 18px;
            line-height: 25px;
        }
        .card-tips {
            color: rgba(57, 57, 57, 0.4);
            font-size: 12px;
            line-height: 17px;
        }
    }
}
</style>
