<template lang="pug">
.hold-fund-details
    span {{$t('holdFundTitle')}}
    van-row()
        van-col( 
            span="8"
            v-for="item of list" 
            :key="item.label"
            class="fund-row" 
            :class="item.layout") 
            span.holdSubtitle {{item.label}}
            p.holdNumber(:class="item.layout") 
                em(v-if="item.value>0") {{item.cname}} 
                em {{item.value}}
</template>
<script>
import { Row, Col } from 'vant'
import { holdDetailsData, i18nHoldDetailsData } from './hold-fund-data'
export default {
    i18n: i18nHoldDetailsData,
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
    methods: {
        initPropState() {
            for (let key in this.list) {
                this.list[key].value = Number(this.initState[key]).toFixed(2)
            }
        }
    },
    mounted() {
        this.initPropState()
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
    float: left;
    width: 100%;
    .fund-row {
        margin: 10px 0 0 0;
        // text-align: center;
        .holdNumber {
            font-size: 0.36rem;
            font-weight: bolder;
            em {
                font-style: normal;
                font-size: 0.36rem;
            }
        }
        .active-color {
            color: rgba(234, 61, 61, 1);
        }
    }
}
</style>
