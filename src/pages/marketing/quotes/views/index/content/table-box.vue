<template lang="pug">
    .table-box
        .title {{$t(`index.tableTitle${tabType}`)}}
        .table-content
            ul(
            v-for="(line, index) in $t(`index.tableContent${tabType}`)"
            :key="index"
            )
                li(
                v-for="(item, itemIndex) in line"
                :key="itemIndex"
                v-html="item"
                )
        .intro(v-if="!isChUser && !usStockTradeClose")
            .intro-title {{$t('index.introduce.title')}}
            ul
                li {{$t('index.introduce.first')}}
                li {{$t('index.introduce.second')}}
                li {{$t('index.introduce.third')}}
                li {{$t('index.introduce.fourth')}}
</template>
<script>
import { usStockTradeClose } from '@/utils/html-utils'

export default {
    props: ['tabType'],
    data: () => ({
        usStockTradeClose
    }),
    computed: {
        isChUser() {
            return this.$store.getters.isChUser
        }
    }
}
</script>
<style lang="scss" scoped>
.table-box {
    margin-top: 30px;
    .title {
        text-align: center;
        margin-bottom: 10px;
        font-size: 16px;
        color: $hk-text-color;
    }
    .table-content {
        margin-top: 10px;
        ul {
            display: flex;
            font-size: 12px;
            border-bottom: 1px solid #fff;
            li {
                flex: 1;
                border-right: 1px solid #fff;
                background-color: rgba(47, 121, 255, 0.0645);
                color: $hk-text-color;
                min-height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                &:first-child {
                    border-top-left-radius: 4px;
                    background-color: rgba(204, 223, 250, 0.2971);
                }
                &:last-child {
                    border-top-right-radius: 4px;
                    border-right: none;
                }
            }
            &:first-child {
                li {
                    background-color: rgba(0, 92, 229, 0.1975);
                }
            }
        }
    }
    .intro {
        margin-top: 20px;
        font-size: 14px;
        .intro-title {
            color: #000;
            font-weight: bold;
        }
        ul {
            line-height: 22px;
            margin-top: 6px;
            color: $hk-text-color;
            word-break: break-word;
        }
    }
}
</style>
