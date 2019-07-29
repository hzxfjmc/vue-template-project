<template lang="pug">
    div
        required-header(:data="data")
        required-article(:data="data")
        p.tips {{ $t('declare') }}
        news-share(v-if="shareData" :share-data="shareData")
</template>

<script>
import RequiredHeader from './required-header'
import RequiredArticle from './required-article'
import NewsShare from '../news-share'

export default {
    name: 'required-news',
    components: {
        RequiredHeader,
        RequiredArticle,
        NewsShare
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
