<template lang="pug">
    .fund-manager__container
        .fund-manager__header
            .header__title {{this.$t('overview')}}
            .header__roof
                .roof__left {{this.$t('fundManager')}}
                .roof__center {{this.$t('tenure')}}
                .roof__right {{this.$t('return')}}
            .header__content
                .content__left
                    .name JUNJIE
                    .now 2009-04-20 {{this.$t('upToNow')}}
                .content__center R5高风险
                .content__right
                    span(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    ) +140.57%
            .line
            .header__content
                .content__left
                    .name JUNJIE
                    .now 2009-04-20 {{this.$t('upToNow')}}
                .content__center R5高风险
                .content__right
                    span(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    ) +140.57%
        .fund-manager__wrap
            .fund-manager__content
                .content__title {{this.$t('manageInfo')}}
                .content__middle JUNJIE
                .content_desc PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理有…
            .fund-manager__content
                .content__title {{this.$t('manageInfo')}}
                .content__middle JUNJIE
                .content_desc PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理有…
</template>
<script>
import { getStockColorType } from '@/utils/html-utils.js'
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
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    }
}
</script>
<style lang="scss">
.fund-manager__header {
    padding: 12px;
    display: flex;
    flex-direction: column;
    background-color: $background-color;
}
.header__title {
    font-size: 16px;
    margin-bottom: 14px;
}
.header__roof,
.header__content {
    display: flex;
    justify-content: space-between;
}
.header__roof {
    font-size: 12px;
    color: $text-color5;
    margin-bottom: 10px;
}
.header__content {
    font-size: 14px;
    .number-red {
        color: rgba(234, 61, 61, 1);
    }
    .number-green {
        color: #04ba60;
    }
    .content__left {
        .now {
            color: $text-color5;
        }
    }
    .content__center,
    .content__right {
        padding-top: 8px;
    }
    .content__right {
        font-size: 16px;
    }
}
.line {
    margin: 10px 0;
    border-bottom: $text-color8 solid 1px;
}
.fund-manager__wrap {
    margin-top: 6px;
    padding: 12px;
    background-color: $background-color;
    & :first-child {
        border-bottom: $text-color8 solid 1px;
    }
}
.fund-manager__content {
    .content__title {
        margin-bottom: 10px;
        font-size: 16px;
    }
    .content__middle {
        margin-bottom: 10px;
        font-size: 14px;
    }
}
</style>
