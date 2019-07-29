<template lang="pug">
    div
        general-header(:data="data" :symbols="symbols" :article-size="articleSize")
        general-article(:content="data.content" :article-size="articleSize")
        p.tips {{ $t('declare') }}
        news-share(v-if="shareData" :share-data="shareData")
        general-recommend(:list="recommendList")
</template>

<script>
import GeneralHeader from './general-header'
import GeneralArticle from './general-article'
import NewsShare from '../news-share'
import GeneralRecommend from './general-recommend'
import JSBridge from '@/utils/js-bridge'
import { getUrlParam } from '../../../0-utils'
import { getRelatedStock, getRelatedArticle } from '../../../0-service/market'
import { buringWebViewScreen } from '../../utils/burying-point'

export default {
    name: 'general-news',
    components: {
        GeneralHeader,
        GeneralArticle,
        NewsShare,
        GeneralRecommend
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        shareData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            symbols: [],
            recommendList: [],
            articleSize: getUrlParam('fontSize') || 'normal' // normal：正常字体，big：大号字体
        }
    },
    created() {
        // 注册app切换字体大小方法
        JSBridge.registerFn('changeArticleSize', data => {
            this.articleSize = data.size
        })
        if (this.$root.isMainland) {
            this.getRelatedStock()
            this.getRelatedArticle()
        }
    },
    methods: {
        // 获取相关个股
        async getRelatedStock() {
            try {
                const data = await getRelatedStock({
                    articleId: getUrlParam('newsid')
                })
                this.symbols = data.list
                const stocks = this.symbols
                    .map(item => item.market + item.symbol)
                    .join('|')
                buringWebViewScreen(stocks, this.data)
            } catch (e) {
                buringWebViewScreen('', this.data)
            }
        },

        // 获取相关文章
        async getRelatedArticle() {
            const data = await getRelatedArticle({
                articleId: getUrlParam('newsid'),
                pageSize: 3
            })
            this.recommendList = data.news_list.map(item => {
                item.reasons = []
                return item
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.tips {
    color: #cacace;
    margin: 0 14px 40px;
    line-height: 24px;
    text-align: justify;
}
</style>
