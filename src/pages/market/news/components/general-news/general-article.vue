<template lang="pug">
    article.general-article.js-article(v-html="content" :style="{ fontSize: articleSize === 'big' ? '22px' : '18px' }")
</template>

<script>
export default {
    name: 'general-article',
    props: {
        content: String,
        articleSize: String
    }
}
</script>

<!--此处不添加scope，需要对v-html内部的标签添加样式-->
<style lang="scss">
.general-article {
    color: #353547;
    margin: 20px 18px 30px;
    img {
        width: 100%;
        height: auto;
    }
    p,
    div {
        line-height: 32px;
        margin: 20px 0;
        text-align: justify;
    }
}
</style>
