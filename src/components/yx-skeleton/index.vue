<template lang="pug">
    .skeleton
        slot(name="loadingShow" v-if="loading")
            div
                img(src="./img/loading-data.png")
                .text(v-show="text") {{text}}
        slot(v-else)
</template>
<script>
export default {
    props: {
        loading: Boolean,
        text: {
            type: String,
            default: '数据加载中，请稍后'
        }
    }
}
</script>
<style lang="scss" scoped>
.skeleton {
    height: 250px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 98px;
        height: 65px;
    }
    .text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 25, 25, 0.3);
        line-height: 20px;
        margin-top: 12px;
    }
}
</style>
