<template lang="pug">
    .block__fund(
        :class="[appType.hk ? 'block__fund-hk' : 'block__fund-ch']")
        .block__fund-title.ellipse(:style="{background:bgColor}") {{title}}
        .block__fund--list.border-bottom(
            @click="goNext(item)"
            v-for="(item,index) in fundlist.data" 
            :key="index")
                .element--fund--content
                    span.title.ellipse {{item.title}}
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
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['appType'])
    },
    props: {
        bgColor: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        fundlist: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        goNext(item) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${item.fundId}`
            gotoNewWebView(url)
        }
    }
}
</script>
<style lang="scss" scoped>
.block__fund {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .block__fund-title {
        width: 100%;
        height: 57px;
        padding: 0 14px;
        border-top-left-radius: 5px;
        color: #fff;
        line-height: 57px;
        border-top-right-radius: 5px;
        font-size: 20px;
    }
    .block__fund--list {
        width: 100%;
        display: flex;
        margin: 20px 0 0 0;
        padding: 0 14px 10px 14px;
        flex-direction: row;
        .element--fund--content {
            display: flex;
            flex-direction: column;
            width: 75%;
            .title {
                font-size: 16px;
                width: 100%;
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
.block__fund-hk {
    width: 90%;
    margin: 20px 5% 0 5%;
}
.block__fund-ch {
    width: 96%;
    margin: 20px 2% 0 2%;
}
</style>
