<template lang="pug">
.fund-details-list
    .vant-list(v-for="item of list" :key="item.label" @click="chooseItem(item)" :class="[item.borderBottom ? 'border-bottom' :'']" v-if="item.itemShow")
        em.left(class="iconfont" :class="item.leftIcon")
        span.center {{item.label}}
        em.right(class="iconfont icon-iconEBgengduoCopy")
</template>
<script>
import { itemList } from './fund-list'
import localStorage from '../../../../../../utils/local-storage'
import jsBridge from '@/utils/js-bridge'
export default {
    i18n: {
        zhCHS: {
            itemList: {
                trade: { label: '交易记录' },
                survey: { label: '基金概况' },
                rule: { label: '交易规则' },
                history: { label: '基金历史' },
                files: { label: '相关文件' },
                tips: { label: '风险提示' }
            }
        },
        zhCHT: {
            itemList: {
                trade: { label: '交易記錄' },
                survey: { label: '基金概況' },
                rule: { label: '交易規則' },
                history: { label: '基金历史' },
                files: { label: '相關文件' },
                tips: { label: '風險提示' }
            }
        },
        en: {
            itemList: {
                trade: { label: 'Transaction Records' },
                survey: { label: 'Fund Overview' },
                rule: { label: 'Trading Rules' },
                history: { label: '基金历史' },
                files: { label: 'Related Documents' },
                tips: { label: 'Risk Disclosure' }
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
        },
        scroll: {
            type: Number
        },
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            list: JSON.parse(JSON.stringify(itemList))
        }
    },
    methods: {
        chooseItem(item) {
            let data = {
                path: item.routerPath
            }
            localStorage.put('scroll', this.scroll)
            localStorage.put('scrollFlag', 2)
            if (item.routerPath == '/fund-introduce')
                data.query = {
                    id: this.$route.query.id
                }
            if (item.routerPath == '/fund-files')
                data.query = {
                    data: JSON.stringify(this.fundCorrelationFileList)
                }
            if (item.routerPath == '/trade-rule') {
                data.query = {
                    id: this.$route.query.id
                }
            }
            if (item.routerPath == '/order-record') {
                data.query = {
                    id: this.$route.query.id,
                    currencyType: this.fundTradeInfoVO.currency.type
                }
            }
            if (item.routerPath == '/generator') {
                window.location.href = `/webapp/market/generator.html?key=${this.fondCode}`
            } else {
                // console.log(JSON.stringify(data.query))
                let routerquery = ''
                for (let key in data.query) {
                    routerquery += `${key}=${data.query[key]}&`
                }
                this.openProtocol(
                    window.location.origin +
                        '/wealth/fund/index.html#' +
                        data.path +
                        '?' +
                        routerquery
                )
                // this.$router.push(data)
            }
        },
        //App页面跳转
        async openProtocol(url) {
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        InitI18nState() {
            for (let key in this.list) {
                if (key != 'history') {
                    this.list[key].label = this.$t('itemList')[key].label
                }
            }
        }
    },
    mounted() {
        this.InitI18nState()
    }
}
</script>
<style lang="scss" scoped>
.fund-details-list {
    margin: 10px 0 10px 0;
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
            margin: 0 20px 0 11px;
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
