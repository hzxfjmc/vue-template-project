<template lang="pug">
    .kindly-reminder
        p.tit {{ $t('kindly') }}
        .tips(v-html="htmlText")
</template>

<script>
export default {
    name: 'kindly-reminder',
    props: {
        htmlText: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.kindly-reminder {
    margin: 12px 14px;
    padding: 9px 14px 10px;
    background: rgba(#3c78fa, 0.076);
}
.tit {
    color: #2f79ff;
    line-height: 24px;
    margin-bottom: 4px;
}
.tips {
    color: rgba(#353547, 0.65);
    font-size: 12px;
    line-height: 20px;
    word-break: break-all;
    text-align: justify;
}
</style>
<style lang="scss">
.kindly-reminder {
    p {
        margin: 6px 0;
    }
    img {
        max-width: 100%;
        height: auto;
    }
}
</style>
