<template lang="pug">
    .hello
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getBondList } from '@/service/finance-server.js'
import BondCard from '../../biz-components/bond-card/index.vue'
export default {
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        BondCard
    },
    async created() {
        try {
            let { bondInfoAndCurrentPriceApiResponses } = await getBondList()
            this.bondList = bondInfoAndCurrentPriceApiResponses || []
            console.log(
                'getBondList:data:>>> ',
                bondInfoAndCurrentPriceApiResponses
            )
        } catch (e) {
            console.log('getBondList:error:>>>', e)
        }
    },
    data() {
        return {
            bondList: []
        }
    }
}
</script>

<style lang="scss" scoped></style>
