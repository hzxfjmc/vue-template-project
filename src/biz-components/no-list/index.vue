<template lang="pug">
.yx-no-list.full-height
    img(:src="imgSrc")
    p {{ showText}}
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            noDataTip: '暂无数据'
        },
        zhCHT: {
            noDataTip: '暫無數據'
        },
        en: {
            noDataTip: 'No Data'
        }
    },
    computed: {
        showText() {
            return (
                this.text || ((this.$t && this.$t('noDataTip')) || '暂无数据')
            )
        }
    },
    props: {
        imgSrc: {
            type: String,
            default: '/webapp/open-account/open-account/no-list.png'
        },
        text: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="less">
.yx-no-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    color: #b4ceec;
    img {
        width: 130px;
    }
    p {
        padding-top: 10px;
    }
}
</style>
