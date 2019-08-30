<template lang="pug">
.fund-details-list
    .vant-list(v-for="item of list" @click="chooseItem(item)")
        em.left(class="iconfont" :class="item.leftIcon")
        span.center {{item.label}}
        em.right(class="iconfont icon-iconEBgengduoCopy")
</template>
<script>
import { itemlist } from './fund-list'
export default {
    props: {
        fundOverviewInfoVO: {
            type: Object,
            default: () => {}
        },
        fundCorrelationFileList: {
            type: Array
        },
        fundTradeInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            list: itemlist
        }
    },
    methods: {
        chooseItem(item) {
            let data = {
                path: item.routerPath
            }
            if (item.routerPath == '/fund-introduce')
                data.query = this.fundOverviewInfoVO
            if (item.routerPath == '/fund-files')
                data.query = {
                    data: JSON.stringify(this.fundCorrelationFileList)
                }
            if (item.routerPath == '/trade-rule') {
                this.fundTradeInfoVO.tradeFrequency = this.fundTradeInfoVO.tradeFrequency.name
                data.query = this.fundTradeInfoVO
            }
            console.log(data)
            this.$router.push(data)
        }
    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
.fund-details-list {
    margin: 10px 0;
    background: $background-color;
    .vant-list {
        // width:92;
        margin: 0 10px;
        border-bottom: 1px solid #e1e1e1;
        height: 50px;
        line-height: 50px;
        em {
            font-style: normal;
            font-size: 0.4rem;
            line-height: 50px;
        }
        .left {
            margin: 0 20px 0 0;
            float: left;
        }
        .right {
            float: right;
        }
        span {
            font-size: 0.28rem;
        }
        .icon-iconEBgengduoCopy {
            font-size: 0.3rem;
        }
    }
    .vant-list:last-child {
        border: none;
    }
}
</style>
