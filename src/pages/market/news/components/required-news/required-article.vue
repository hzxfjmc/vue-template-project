<template lang="pug">
    article.required-article.js-article(v-html="data.html_content")
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import { getStockDetail } from '../../../0-service/market'
import {
    buringWebViewScreen,
    buringGoToAppStock
} from '../../utils/burying-point'

export default {
    name: 'required-article',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            hkQuoteLevel: 0,
            usQuoteLevel: 0
        }
    },
    async mounted() {
        await this.getAuthLevel()
        this.updateStockRoc()
    },
    methods: {
        async getAuthLevel() {
            try {
                const user = await JSBridge.callApp('get_user_info')
                console.log('=====get_user_info', user)
                if (user.hkQuoteLevel !== undefined) {
                    this.hkQuoteLevel = user.hkQuoteLevel
                }
                if (user.usQuoteLevel !== undefined) {
                    this.usQuoteLevel = user.usQuoteLevel
                }
            } catch (e) {} // eslint-disable-line
        },
        // 更新股票涨跌幅，添加跳转到相关个股操作
        async updateStockRoc() {
            const els = document.getElementsByClassName('_stock')
            // 获取股票id列表
            let ids = []
            for (let i = 0; i < els.length; i++) {
                let market = els[i].dataset.market || ''
                let symbol = els[i].dataset.symbol || ''
                market = market.trim()
                symbol = symbol.trim()
                ids.push(market + symbol)
            }
            ids = [...new Set(ids)]
            // 埋点(APP外部统计)
            buringWebViewScreen(ids.join('|'), this.data)
            // 按权限获取行情数据
            if (ids.length > 0) {
                let list = []
                if (this.hkQuoteLevel === this.usQuoteLevel) {
                    const data = await getStockDetail({
                        ids,
                        level: this.hkQuoteLevel
                    })
                    list = data.list
                } else {
                    const hk_ids = ids.filter(item => /^hk/.test(item))
                    const us_ids = ids.filter(item => /^us/.test(item))
                    if (hk_ids.length > 0) {
                        const data = await getStockDetail({
                            ids: hk_ids,
                            level: this.hkQuoteLevel
                        })
                        list = list.concat(data.list)
                    }
                    if (us_ids.length > 0) {
                        const data = await getStockDetail({
                            ids: us_ids,
                            level: this.usQuoteLevel
                        })
                        list = list.concat(data.list)
                    }
                }
                // 展示相关个股
                list.forEach(item => {
                    for (let i = 0; i < els.length; i++) {
                        if (
                            els[i].dataset.market === item.market &&
                            els[i].dataset.symbol === item.symbol
                        ) {
                            // 相关个股 - 展示在底部，非框框样式
                            if (els[i].className.match('_stock__outside')) {
                                els[i].innerText =
                                    els[i].innerText +
                                    '  ' +
                                    item.roc / 100 +
                                    '%'
                                if (item.roc < 0) {
                                    els[i].style.color = 'rgba(16,186,112, 1)'
                                    els[i].style.backgroundColor =
                                        'rgba(16,186,112, 0.05)'
                                } else if (item.roc > 0) {
                                    els[i].style.color = 'rgba(231,38,83, 1)'
                                    els[i].style.backgroundColor =
                                        'rgba(231,38,83, 0.05)'
                                }
                                els[i].onclick = () =>
                                    this.gotoNativeModule(item)
                            } else {
                                // 相关个股 - 框框样式
                                let color = '#9a9aa3'
                                if (item.roc < 0) {
                                    color = 'rgba(16,186,112, 1)'
                                } else if (item.roc > 0) {
                                    color = 'rgba(231,38,83, 1)'
                                }
                                els[i].style.color = color
                                els[i].innerText = item.roc / 100 + '%'
                                els[i].parentElement.onclick = () =>
                                    this.gotoNativeModule(item)
                            }
                        }
                    }
                })
            }
        },
        // 跳转相关个股
        gotoNativeModule(item) {
            buringGoToAppStock(item.market + item.symbol, this.data)
            JSBridge.gotoNativeModule(
                `yxzq_goto://stock_quote?market=${item.market}&code=${item.symbol}`
            )
        }
    }
}
</script>

<!--此处不添加scope，需要对v-html内部的标签添加样式-->
<style lang="scss">
.required-article {
    color: #353547;
    margin: 30px 16px;
    text-align: justify;
    p {
        margin: 10px 0;
    }
}
</style>
