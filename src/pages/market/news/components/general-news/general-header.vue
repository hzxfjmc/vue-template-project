<template lang="pug">
    header.general-header
        h1.title(:style="{ fontSize: articleSize === 'big' ? '28px' : '24px' }") {{ data.title }}
        p.sub-info
            span(v-if="data.source") {{ data.source | cutByteLen(20) }}
            | {{ $timeFormat(data.release_time * 1000) }}
            template(v-if="data.language === 'en' && !isEnLang")
                img(src="../../images/en.png" v-if="translated" @click="translate")
                img(src="../../images/zh.png" v-else @click="translate")
        .symbols(v-if="symbols.length > 0")
            template(v-for="(item, index) in symbols")
                p.stock(
                    :key="item.name"
                    v-if="index < 4"
                    :class="{fall: item.roc < 0, rise: item.roc > 0}"
                    @click="gotoNativeModule(item)"
                )
                    span.stock__name {{ item.name }}({{ item.symbol }}.{{ item.market | toUpper }})
                    span.stock__roc {{ item.roc | formatChangeRate }}
                    span.stock__price {{ item | priceFormat }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import cutByteLen from '../../../0-filters/cut-byte-len'
import { buringGoToAppStock } from '../../utils/burying-point'
import { translateEnNews } from '../../../0-service/market'
import { getUrlParam } from '../../../0-utils'
import { Toast } from 'vant'
import config from '../../../0-config'

export default {
    name: 'general-header',
    props: {
        data: Object,
        symbols: Array,
        articleSize: String
    },
    data() {
        return {
            isEnLang: config.isLangEn,
            translated: false
        }
    },
    methods: {
        // 跳转相关个股
        gotoNativeModule(item) {
            buringGoToAppStock(item.market + item.symbol, this.data)
            JSBridge.gotoNativeModule(
                `yxzq_goto://stock_quote?market=${item.market}&code=${item.symbol}`
            )
        },
        // 翻译
        async translate() {
            const hasReminder = localStorage.NEWS_REMINDER === 'true'
            const isAllowDate = Date.now() > localStorage.NEWS_REMINDER_TIME
            if (!hasReminder || isAllowDate) {
                await this.$dialog({
                    title: this.$t('reminder'),
                    message: this.$t('reminderContent'),
                    confirmButtonText: this.$t('reminderButton')
                })
                localStorage.NEWS_REMINDER = 'true'
                localStorage.NEWS_REMINDER_TIME = Date.now() + 604800000 // 7天提示一次
            }

            if (!this.data.newsEn) {
                this.data.newsEn = {
                    title: this.data.title,
                    content: this.data.content
                }
            }
            if (!this.data.newsZh) {
                try {
                    const data = await translateEnNews({
                        newsid: getUrlParam('newsid')
                    })
                    if (!data.title || !data.content) {
                        Toast('暂无翻译')
                        return
                    }
                    this.data.newsZh = data
                } catch (e) {
                    Toast('暂无翻译')
                    return
                }
            }
            const key = this.translated ? 'newsEn' : 'newsZh'
            this.data.title = this.data[key].title
            this.data.content = this.data[key].content
            this.translated = !this.translated
        }
    },
    filters: {
        formatChangeRate(val) {
            if (typeof val !== 'number') {
                return '0.00%'
            }
            let value = (Math.floor(val) / 100).toFixed(2) + '%'
            if (val > 0) {
                value = '+' + value
            }
            return value
        },
        priceFormat(stock) {
            const price = stock.now / Math.pow(10, stock.price_base)
            return price.toFixed(3)
        },
        toUpper(str) {
            return str.toUpperCase()
        },
        cutByteLen
    }
}
</script>

<style lang="scss" scoped>
.general-header {
    margin: 0 8px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(#e1e1e1, 0.5);
    .title {
        line-height: 33px;
        margin: 18px 7px 0;
        color: #353547;
        text-align: justify;
        font-weight: bold;
        letter-spacing: 0.2px;
    }
    .sub-info {
        position: relative;
        margin: 8px 9px 0;
        color: #aaaab4;
        font-size: 12px;
        span {
            margin-right: 14px;
        }
        img {
            width: 32px;
            height: 32px;
            position: absolute;
            right: 0;
            top: -8px;
        }
    }
    .symbols {
        position: relative;
        margin: 20px 9px 0;
    }
    .stock {
        + .stock {
            margin-top: 10px;
        }
        span {
            color: #9a9aa3;
            display: inline-block;
            vertical-align: top;
            &.stock__name {
                color: #2f79ff;
            }
        }
        &__name {
            width: 190px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        &__price {
            float: right;
            text-align: right;
        }
        &__roc {
            float: right;
            text-align: right;
            min-width: 76px;
        }
        &.fall {
            .stock__price,
            .stock__roc {
                color: #10ba70;
            }
        }
        &.rise {
            .stock__price,
            .stock__roc {
                color: #e72653;
            }
        }
    }
    .symbols img {
        width: 12px;
        height: 7px;
        position: absolute;
        right: -22px;
        bottom: 12px;
        padding: 10px;
        box-sizing: content-box;
        &.rotate {
            transform: rotate(180deg);
        }
    }
}
</style>
