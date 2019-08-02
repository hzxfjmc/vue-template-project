<template lang="pug">
    van-row.col-column(type="flex" :justify="justify")
        van-col(v-for="(colItem, index) in colData" :key="index")
            .van-col__title(:style="titleStyle") {{ colItem.title }}
            .van-col__desc(:style="descStyle") {{ colItem.desc }}
</template>
<script>
import { Row, Col } from 'vant'
export default {
    name: 'ColMsg',
    components: {
        [Row.name]: Row,
        [Col.name]: Col
    },
    props: {
        colData: {
            type: Array,
            default: () => []
        },
        justify: {
            type: String,
            default: 'space-between'
        },
        titleStyle: {
            type: Object,
            default: () => {}
        },
        descStyle: {
            type: Object,
            default: () => {}
        }
    }
}
</script>
<style lang="scss" scoped>
.col-column {
    padding: 14px 16px;
    .van-col__title {
        color: #393939;
        font-size: 0.28rem;
        line-height: 20px;
    }
    .van-col__desc {
        margin-top: 2px;
        color: rgba(57, 57, 57, 0.4);
        font-size: 0.24rem;
        line-height: 17px;
    }
}
.col-column + .col-column {
    padding-top: 0;
}
</style>
