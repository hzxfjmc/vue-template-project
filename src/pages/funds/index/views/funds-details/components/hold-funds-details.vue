<template lang="pug">
.hold-funds-details
    span 持仓详情
    van-row()
        van-col( 
            span="8"
            v-for="item of list" 
            :key="item.label"
            class="funds-row" 
            :class="item.layout") 
            span.holdSubtitle {{item.label}}
            p.holdNumber(:class="item.layout") {{item.value}}
</template>
<script>
import { Row, Col } from 'vant'
import { holdDetailsData } from './hold-funds-data'
export default {
    components: {
        Row,
        Col
    },
    data() {
        return {
            list: holdDetailsData
        }
    }
}
</script>
<style lang="scss" scoped>
.hold-funds-details {
    margin: 10px 0 0 0;
    background: $background-color;
    padding: 10px;
    height: 160px;
    .funds-row {
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
