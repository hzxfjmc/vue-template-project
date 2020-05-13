<template lang="pug">
.block--article--wrapper
    .block--article__title  
        p 基金看点
        span 查看更多
            em.iconfont.icon-iconEBgengduoCopy
    .block--article--swipper
        slot(name="swipper")
    .block--article--list
        .block--item(
            v-for="(item,index) in news_list" 
            :class="[index != news_list.length-1?'border-bottom':'']")
            p.title {{item.title}}
            template(v-if="item.stocks.length>0")
                .content(
                    v-if="item.stocks[0].pctchng>0"
                    :class="stockColorType == 1 ? 'color-red' : 'color-green'"
                    )
                    span.name {{item.stocks[0].name}}
                    span.pctchng +{{Number(item.stocks[0].pctchng).toFixed(2)}}%
                .content(
                    v-if="item.stocks[0].pctchng<0"
                    :class="stockColorType == 1 ? 'color-green' : 'color-red'"
                    )
                    span.name {{item.stocks[0].name}}
                    span.pctchng {{Number(item.stocks[0].pctchng).toFixed(2)}}%
                .content.color-black(
                    v-if="item.stocks[0].pctchng===0"
                    )
                    span.name {{item.stocks[0].name}}
                    span.pctchng {{Number(item.stocks[0].pctchng).toFixed(2)}}%
            .bottom 
                span {{item.source}}
                span 08-27  10:18
</template>
<script>
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    props: {
        news_list: {
            type: Array,
            default: () => {}
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    mounted() {
        console.log(this.stockColorType)
    }
}
</script>
<style lang="scss" scoped>
.block--article--wrapper {
    width: 351px;
    border-radius: 6px;
    background: #fff;
    margin: 0 auto;
    padding: 14px 12px;
    .block--article__title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        p {
            font-size: 18px;
            line-height: 25px;
            font-weight: 500;
        }
        span {
            font-weight: 400;
            line-height: 25px;
            color: rgba(25, 25, 25, 0.65);
            em {
                font-size: 15px;
            }
        }
    }
}

.block--item {
    padding: 14px 0 13px 0;
    .title {
        font-size: 16px;
        font-weight: 400;
    }
    .content {
        margin: 10px 0 0 0;
        font-size: 12px;
        display: inline-block;
        padding: 0px 4px;
        .pctchng {
            margin: 0 0 0 7px;
        }
    }
    .bottom {
        margin: 6px 0 0 0;
        color: rgba(25, 25, 25, 0.65);
        font-size: 12px;
        line-height: 17px;
    }
}
.block--item:last-child {
    padding: 14px 0 0 0;
}

.color-green {
    background: #04ba60;
}
.color-red {
    background: #ea3d3d;
}
.color-black {
    background: rgba(186, 186, 186, 0.3);
    color: #979797;
}
</style>
