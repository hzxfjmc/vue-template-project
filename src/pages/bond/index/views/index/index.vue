<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(:autoplay="3000" indicator-color="white")
            van-swipe-item 1
            van-swipe-item 2

</template>
<script>
import { Swipe, SwipeItem } from 'vant'
export default {
    name: 'index',
    data() {
        return {}
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.bond-index-wrapper {
    .banner {
        width: 375px;
        height: 150px;
    }
}
</style>
