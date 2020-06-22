<template lang="pug">
    .fund-manager__container
        .fund-manager__header
            .header__title {{this.$t('overview')}}
            .header__roof
                .roof__left {{this.$t('fundManager')}}
                .roof__center {{this.$t('tenure')}}
                .roof__right {{this.$t('return')}}
            .content__wrap
                .header__content
                    .content__left
                        .name JUNJIE
                        .now 2009-04-20 {{this.$t('upToNow')}}
                    .content__center R5高风险
                    .content__right
                        span(
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                        ) +140.57%
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
            .content__title {{this.$t('manageInfo')}}
            .fund-manager__content
                .content__name JUNJIE
                .content_desc__wrap
                    span.content_desc(
                        :class="{all: showMore}"
                    ) PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理资管理有限公司由被称为业界称作债券之王的
                .more(
                    v-if="!showMore"
                    @click="showMore = true"
                ) 查看更多
                .more(
                    v-else
                    @click="showMore = false"
                ) 收起
            .fund-manager__content
                .content__name JUNJIE
                .content_desc__wrap
                    span.content_desc PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司
                    span.more 查看更多
            .fund-manager__content
                .content__name JUNJIE
                .content_desc__wrap
                    span.content_desc PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司
                    span.more 查看更多
</template>
<script>
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    data() {
        return {
            showMore: false
        }
    },
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
.fund-manager__container {
    display: flex;
    flex-direction: column;
}
.fund-manager__header {
    padding: 12px;
    flex-direction: column;
    background-color: $background-color;
}
.header__title {
    font-size: 16px;
    margin-bottom: 14px;
}
.content__wrap {
    & :last-child {
        border-bottom: 0;
    }
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
    border-bottom: $text-color8 solid 1px;
    font-size: 14px;
    padding: 5px 0;
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
.fund-manager__wrap {
    flex: 1;
    margin-top: 6px;
    padding: 12px;
    background-color: $background-color;
    .content__title {
        font-size: 16px;
    }
    & :last-child {
        border-bottom: 0;
    }
}
.fund-manager__content {
    padding: 14px 0;
    border-bottom: $text-color8 solid 1px;
    .content__name {
        margin-bottom: 10px;
        font-size: 14px;
    }
    .content_desc {
        height: 120px;
        overflow: hidden;
        line-height: 24px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
        &.all {
            height: 200px;
        }
    }
    .more {
        color: $primary-color-line;
    }
}
</style>
