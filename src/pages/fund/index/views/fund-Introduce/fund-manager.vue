<template lang="pug">
    .fund-manager__container(v-if="managerList.length")
        .fund-manager__header
            .header__title {{$t('overview')}}
            .header__roof
                .roof__left {{$t('fundManager')}}
                .roof__center {{$t('tenure')}}
                .roof__right {{$t('return')}}
            .content__wrap
                .header__content(v-for="(item, index) in managerList" :key="index")
                    .content__left
                        .name {{item.managerName}}
                        span.now {{item.startDate | formatDate}}
                    .content__center {{item.days | formatDays}}
                    .content__right
                        span(
                            v-if="+item.inReturn > 0"
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                        ) +{{item.inReturn | formatRtn}}%
                        span(
                            v-else 
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                        ) {{item.inReturn}}%
        .fund-manager__wrap
            .content__title {{$t('manageInfo')}}
            .fund-manager__content(
                v-for="(item, index) in managerList2" 
                :key="index"
                )
                .content__name {{item.managerName}}
                .content_desc__wrap( v-if="item.managerProvidedBiography")
                    .content_desc(
                        :class="{all: item.showMore}"    
                    ) {{item.managerProvidedBiography || ''}}
                    .show-wrap
                        .more(
                            v-if="!item.showMore"
                            @click="item.showMore = true"
                        ) {{$t('more')}}
                        .less(
                            v-else
                            @click="item.showMore = false"
                        ) {{$t('less')}}
                .no-data(v-else) {{$t('noIntroduction')}}
</template>
<script>
import { getStockColorType } from '@/utils/html-utils.js'
import Vue from 'vue'
const $t = Vue.prototype.$t
export default {
    props: {
        managerList: {
            type: Array,
            default: () => []
        }
    },
    i18n: {
        zhCHS: {
            fundManager: '基金经理',
            overview: '基金经理概览',
            tenure: '任期',
            return: '任期回报',
            upToNow: '至今',
            manageInfo: '基金经理简介',
            more: '查看更多',
            less: '收起',
            noIntroduction: '暂无简介',
            years: '年零',
            days: '天'
        },
        zhCHT: {
            fundManager: '基金經理',
            overview: '基金經理概覽',
            tenure: '任期',
            return: '任期回報',
            upToNow: '至今',
            manageInfo: '基金經理簡介',
            more: '查看更多',
            less: '收起',
            noIntroduction: '暂无简介',
            years: '年零',
            days: '天'
        },
        en: {
            fundManager: 'Fund Manager',
            overview: 'Fund Manager Overview',
            tenure: 'Tenure',
            return: 'Return',
            upToNow: 'Up To Now',
            manageInfo: 'Fund Manager Info',
            more: 'More',
            less: 'Less',
            noIntroduction: 'No Introduction',
            years: 'years and',
            days: 'days'
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        managerList2() {
            this.managerList.forEach(item => {
                this.$set(item, 'showMore', false)
            })
            return this.managerList
        }
    },
    filters: {
        formatDate(value) {
            return `${value} ${$t('upToNow')}`
        },
        formatDays(value) {
            let year = Math.floor(value / 365)
            let days = value % 365
            return `${year} ${$t('years')} ${days} ${$t('days')}`
        },
        formatRtn(value) {
            let rtn = Number.parseFloat(value).toFixed(2)
            return rtn
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
        width: 30%;
        .now {
            color: $text-color5;
        }
        overflow: hidden;
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
    }
    .content_desc {
        height: 120px;
        overflow: hidden;
        line-height: 24px;
        color: $text-color6;
        // text-align: justify;
        // white-space: pre-line;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        &.all {
            display: inline-block;
            height: auto;
        }
    }

    .more {
        color: $primary-color-line;
    }
    .less {
        color: $primary-color-line;
    }
}
.no-data {
    text-align: center;
    padding: 10px;
    color: $text-color5;
}
</style>
