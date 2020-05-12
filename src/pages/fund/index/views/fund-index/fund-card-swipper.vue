<template lang="pug">
.block--swipper--wrapper
     van-swipe(:autoplay="500000") 
        van-swipe-item(
            v-for="(item, index) in barnnarHkList" 
            :key="index"  
            @click="goBanner(item)") 
            .block--swipper--content
                .block__swipper--wrapper
                    span 23132
</template>
<script>
import { Swipe, SwipeItem } from 'vant'

export default {
    i18n: {},
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data() {
        return {
            barnnarHkList: [{}, {}, {}]
        }
    },
    methods: {},
    created() {}
}
</script>
<style lang="scss" scoped>
.block--swipper--wrapper {
    margin: 7px 0 0 0;
    .block--swipper--content {
        width: 100%;
        height: 220px;
        padding: 0 12px;
        border: 1px solid red;
    }
    // .van-swipe-item {
    //     width: 100% !important;
    // }
}
</style>
