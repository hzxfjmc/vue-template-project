<template lang="pug">
    .rich-text(v-html="htmlText")
</template>

<script>
export default {
    name: 'rich-text',
    props: {
        htmlText: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">
.rich-text {
    margin: 18px 14px;
    word-break: break-all;
    text-align: justify;
    p {
        margin: 10px 0;
    }
    img {
        max-width: 100%;
        height: auto;
    }
}
</style>
