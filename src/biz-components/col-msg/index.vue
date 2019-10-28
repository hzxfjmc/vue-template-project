<template lang="pug">
    van-row.col-column(type="flex" :justify="justify")
        van-col(
            v-for="(colItem, index) in colData"
            :key="index"
            :style="wrapperStyle"
            @click.native="emitHandle(index)"
        )
            .van-col__title(:style="titleStyle" :class="titleClass") {{ colItem.title }}
            .van-col__desc(:style="descStyle" :class="descClass") {{ colItem.desc }}
                i(v-if="colItem.class" class="iconfont" :class="colItem.class")
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
        wrapperStyle: {
            type: Object,
            default: () => {}
        },
        titleClass: {
            type: String,
            default: ''
        },
        titleStyle: {
            type: Object,
            default: () => {}
        },
        descClass: {
            type: String,
            default: ''
        },
        descStyle: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        emitHandle(index) {
            if (typeof this.colData[index].click === 'function') {
                this.colData[index].click()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.col-column {
    padding: 14px 16px;
    .van-col {
        flex: 1;
        min-width: 22%;
    }
    .van-col__title {
        color: $text-color;
        font-size: 0.28rem;
        line-height: 20px;
    }
    .van-col__desc {
        margin-top: 2px;
        color: $text-color5;
        font-size: 0.24rem;
        line-height: 17px;
        .iconfont {
            margin-left: 6px;
            font-size: 0.26rem;
            vertical-align: middle;
        }
    }
}
.col-column + .col-column {
    padding-top: 0;
}
</style>
