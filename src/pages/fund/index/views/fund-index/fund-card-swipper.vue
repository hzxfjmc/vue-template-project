<template lang="pug">
.block--swipper--wrapper
     van-swipe(:autoplay="5000") 
        van-swipe-item(
            v-for="(item, index) in barnnarHkList" 
            :key="index"  
            @click="goBanner(item)") 
            .block--swipper--content
                img(:src="item.picture_url") 
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
        width: 351px;
        height: 220px;
        margin: 0 12px;
        border: 1px solid red;
    }
}
</style>
