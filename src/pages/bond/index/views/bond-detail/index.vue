<template lang="pug">
    .bond-detail-wrapper
        detail-header
</template>
<script>
// import { Swipe, SwipeItem } from 'vant'
// import { getBondList } from '@/service/finance-server.js'
import DetailHeader from './components/detail-header/index.vue'
export default {
    name: 'BondList',
    components: {
        // [Swipe.name]: Swipe,
        // [SwipeItem.name]: SwipeItem,
        DetailHeader
    },
    async created() {},
    data() {
        return {
            bondList: []
        }
    }
}
</script>
<style lang="scss" scoped>
.bond-detail-wrapper {
    padding: 10px;
}
</style>
