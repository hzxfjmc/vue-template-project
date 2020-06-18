<template lang="pug">
    .fund-manager__container
        .fund-manager__header
            .header__title {{this.$t('overview')}}
            .header__content
                .content__left {{this.$t('fundManager')}}
                .content__center {{this.$t('tenure')}}
                .content__right {{this.$t('return')}}
        .fund-manager__content 
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            fundManager: '基金经理',
            overview: '基金经理概览',
            tenure: '任期',
            return: '任期回报',
            upToNow: '至今',
            manageInfo: '基金经理简介'
        },
        zhCHT: {
            fundManager: '基金經理',
            overview: '基金經理概覽',
            tenure: '任期',
            return: '任期回報',
            upToNow: '至今',
            manageInfo: '基金經理簡介'
        },
        en: {
            fundManager: 'Fund Manager',
            overview: 'Fund Manager Overview',
            tenure: 'Tenure',
            return: 'Return',
            upToNow: 'Up To Now',
            manageInfo: 'Fund Manager Info'
        }
    }
}
</script>
<style lang="scss">
.fund-manager__header {
    padding: 12px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}
.header__content {
    display: flex;
    justify-content: space-between;
}
</style>
