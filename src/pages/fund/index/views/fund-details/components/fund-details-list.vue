<template lang="pug">
.fund-details-list
    .vant-list(v-for="item of list" :key="item.label" @click="chooseItem(item)" class="border-bottom" v-if="item.itemShow")
        em.left(class="iconfont" :class="item.leftIcon")
        span.center {{item.label}}
        em.right(class="iconfont icon-iconEBgengduoCopy")
</template>
<script>
import { itemList } from './fund-list'
export default {
    i18n: {
        zhCHS: {
            itemList: {
                trade: { label: '交易记录' },
                survey: { label: '基金概况' },
                rule: { label: '交易规则' },
                files: { label: '相关文件' },
                tips: { label: '风险提示' }
            }
        },
        zhCHT: {
            itemList: {
                trade: { label: '交易记录' },
                survey: { label: '基金概况' },
                rule: { label: '交易规则' },
                files: { label: '相关文件' },
                tips: { label: '风险提示' }
            }
        },
        en: {
            itemList: {
                trade: { label: '交易记录' },
                survey: { label: '基金概况' },
                rule: { label: '交易规则' },
                files: { label: '相关文件' },
                tips: { label: '风险提示' }
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
        },
        fondCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            list: itemList
        }
    },

    methods: {
        positionStatusShow() {
            if (this.positionStatus.type != -1) {
                this.list['trade'].itemShow = true
            } else {
                this.list['trade'].itemShow = false
            }
        },
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
            if (item.routerPath == '/generator') {
                window.location.href = `/webapp/market/generator.html?key=${this.fondCode}`
            } else {
                this.$router.push(data)
            }
        },
        InitI18nState() {
            for (let key in this.list) {
                this.list[key].label = this.$t('itemList')[key].label
            }
        }
    },
    mounted() {
        this.positionStatusShow()
        this.InitI18nState()
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
