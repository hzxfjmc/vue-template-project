<template lang="pug">
.block--yxbao-desc
    .block--yxbao-nomre
        img(:src="imgUrl")
        p {{$t('nomore1')}}
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            nomore1: '无更多内容'
        },
        zhCHT: {
            nomore1: '無更多內容'
        },
        en: {
            nomore1: 'No More Content'
        }
    },
    data() {
        return {
            imgUrl: require(`@/assets/img/yxbao/No-position.png`)
        }
    }
}
</script>
<style lang="scss" scoped>
.block--yxbao-desc {
    width: 100%;
    height: 100%;
    background: #fff;
    .block--yxbao-nomre {
        display: flex;
        align-content: center;
        justify-content: center;
        padding: 180px 0 0 0;
        flex-direction: column;
        width: 100%;
        text-align: center;
    }
    img {
        width: 50%;
        margin: 0 25%;
    }
    p {
        margin: 20px 0 0 0;
    }
}
</style>
