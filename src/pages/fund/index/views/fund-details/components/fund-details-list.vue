<template lang="pug">
.fund-details-list
    .vant-list(v-for="item of list" :key="item.label" @click="chooseItem(item)" class="border-bottom" v-if="item.itemShow")
        em.left(class="iconfont" :class="item.leftIcon")
        span.center {{item.label}}
        em.right(class="iconfont icon-iconEBgengduoCopy")
</template>
<script>
import { itemlist } from './fund-list'
export default {
    i18n: {
        zhCHS: {
            itemlist: {
                label: '交易记录4234'
            }
        },
        zhCHT: {
            itemlist: {
                label: '423423'
            }
        },
        en: {
            itemlist: {
                label: '54534'
            }
        }
    },
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
        },
        positionStatus: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            list: itemlist
        }
    },
    watch: {
        positionStatus() {
            if (this.positionStatus.type != -1) {
                this.list[0].itemShow = true
            }
            console.log(this.positionStatus)
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
            this.$router.push(data)
        }
    },
    mounted() {
        console.log(this.$t('itemlist.label'))
    }
}
</script>
<style lang="scss" scoped>
.fund-details-list {
    margin: 10px 0;
    background: $background-color;
    width: 100%;
    float: left;
    .vant-list {
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
