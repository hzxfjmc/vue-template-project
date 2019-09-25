<template lang="pug">
.hold-fund-details
    span {{$t('holdFundTitle')}}
    van-row()
        van-col( 
            span="8"
            v-for="(item,index) of list" 
            :key="item.label"
            class="fund-row" 
            :class="item.layout") 
            span.holdSubtitle {{item.label}}
            p.holdNumber(
                :class="stockColorType === 1 ? 'active_red' : 'active-green'"
                v-if="item.flag == 1 && (index == 'yesterdayEarnings' || index === 'positionEarnings')") +{{item.value}}
            p.holdNumber(
                :class="stockColorType === 1 ? 'active-green' : 'active_red'"
                v-else-if="item.flag == 2 && (index == 'yesterdayEarnings' || index === 'positionEarnings')") {{item.value}}
             p.holdNumber(v-else) {{item.value}}
            //- p.holdNumber(
            //-     :class="item.value >= 0 && (index == 'yesterdayEarnings' || index === 'positionEarnings') ? 'active_red' : item.value<0 ? 'active-green' : ''") 
            //-     em(v-if="item.value>0") {{item.cname}}
            //-     em {{item.value}}
</template>
<script>
import { Row, Col } from 'vant'
import { holdDetailsData, i18nHoldDetailsData } from './hold-fund-data'
import { getStockColorType } from '@/utils/html-utils.js'
import { transNumToThousandMark } from '@/utils/tools.js'
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
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    methods: {
        initPropState() {
            for (let key in this.list) {
                this.list[key].flag =
                    this.initState[key] > 0
                        ? 1
                        : this.initState[key] < 0
                        ? 2
                        : 3
                this.list[key].value = transNumToThousandMark(
                    this.initState[key]
                )
            }
        },
        initI18nState() {
            for (let key in this.list) {
                this.list[key].label = this.$t('holdDetailsData')[key].label
            }
        }
    },
    mounted() {
        this.initPropState()
        this.initI18nState()
    },
    data() {
        return {
            list: JSON.parse(JSON.stringify(holdDetailsData))
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
    .center {
        text-align: center;
    }
    .right {
        text-align: right;
    }
    .fund-row {
        margin: 10px 0 0 0;
        // text-align: center;
        .holdSubtitle {
            font-size: 0.24rem;
        }
        .holdNumber {
            font-size: 0.36rem;
            font-family: DINPro;
            // font-weight: bolder;
            em {
                font-style: normal;
                font-size: 0.36rem;
            }
        }
        .active_red {
            color: rgba(234, 61, 61, 1);
        }
        .active-green {
            color: #04ba60;
        }
    }
}
</style>
