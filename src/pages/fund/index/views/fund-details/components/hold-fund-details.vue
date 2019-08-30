<template lang="pug">
.hold-fund-details
    span 持仓详情
    van-row()
        van-col( 
            span="8"
            v-for="item of list" 
            :key="item.label"
            class="fund-row" 
            :class="item.layout") 
            span.holdSubtitle {{item.label}}
            p.holdNumber(:class="item.layout") {{item.value}}
</template>
<script>
import { Row, Col } from 'vant'
import { holdDetailsData } from './hold-fund-data'
export default {
    props: {
        initState: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        Row,
        Col
    },
    watch: {
        initState() {
            console.log(this.initState)
        }
    },
    data() {
        return {
            list: holdDetailsData
        }
    }
}
</script>
<style lang="scss" scoped>
.hold-fund-details {
    margin: 10px 0 0 0;
    background: $background-color;
    padding: 10px;
    height: 160px;
    .fund-row {
        margin: 10px 0 0 0;
        .holdNumber {
            font-size: 0.36rem;
        }
        .active-color {
            color: rgba(234, 61, 61, 1);
        }
    }
}
</style>
