<template lang="pug">
    .block__fund
        .block__fund-title {{fundlist.masterTitle}}
        .block__fund--list(v-for="(item,index) in fundlist.data" :key="index")
                img(class="element--left--img" :src="item.iconUrl")
                .element--fund--content
                    span.title {{item.title}}
                    .element--content-sub-content
                        .number(v-if="Number(item.apy)>0") + {{(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.apy)<0") - {{Math.abs(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.pay) === 0") {{item.apy}}
                        .tag {{item.apyTypeName}}
                    .element--content-bottom
                        span 债券型
                        span {{item.initialInvestAmount}}{{item.tradeCurrency}}起購 
                        span {{item.fundSize}}億{{item.fundSizeCurrency}}
                .element--right
                    img(:src="item.imgUrl")
</template>
<script>
export default {
    props: {
        fundlist: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        fundlist() {
            console.log(this.fundlist)
        }
    }
}
</script>
<style lang="scss" scoped>
.block__fund {
    width: 100%;
    margin: 20px 0 0 0;
    padding: 10px 5%;
    background: #fff;
    .block__fund-title {
        font-size: 20px;
    }
    .block__fund--list {
        width: 100%;
        height: 70px;
        display: flex;
        margin: 20px 0 0 0;
        flex-direction: row;
        .element--left--img {
            width: 20px;
            height: 20px;
            margin: 4px 0 0 0;
        }
        .element--fund--content {
            display: flex;
            flex-direction: column;
            width: 90%;
            padding: 0 0 0 10px;
            .title {
                font-size: 16px;
            }
            .element--content-sub-content {
                display: flex;
                flex-direction: row;
                .number {
                    font-size: 18px;
                    color: rgba(0, 197, 141, 1);
                    line-height: 23px;
                }
                .tag {
                    font-size: 10px;
                    line-height: 25px;
                    padding: 0 0 0 10px;
                    color: $text-color5; // 次标题颜色
                }
            }
            .element--content-bottom {
                span {
                    padding: 0 3px 0 3px;
                    font-size: 10px;
                    color: $text-color6;
                    border-right: 1px solid #e1e1e1;
                }
                span:first-child {
                    padding: 0 3px 0 0;
                }
                span:last-child {
                    border: none;
                }
            }
        }
        .element--right {
            width: 80px;
            height: 70px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
