<template lang="pug">
.home-fund-list
    .fund-title-name
        .title {{$t('title')}}
        .subtitle {{$t('subtitle')}}
    .fund-list-content
        .list-item(v-for="(item,index) in fundList" :key="index" @click="toFundDetails(item)")
            .block-left
                span.block-num(v-if="item.msg == 0 && item.apy > 0" :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{item.apy|filterThousand}}%
                span.block-num(v-else-if="item.msg == 0 && item.apy < 0" :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{item.apy|filterThousand}}%
                span.block-num(v-else-if="item.msg == 0") {{item.apy|filterThousand}}%
                span.block-black(v-if="item.msg == 1 && item.apy > 0" :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{item.apy|filterThousand}}%
                span.block-black(v-else-if="item.msg == 1 && item.apy <0"  :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{item.apy|filterThousand}}%
                span.block-black(v-else-if="item.msg == 1") {{item.apy}}%
                span.element-msg(v-if="item.msg == 2 && item.apy > 0" :class="stockColorType === 1 ? 'number-red' : 'number-green'") +{{item.apy|filterThousand}}%
                span.element-msg(v-else-if="item.msg == 2 && item.apy < 0" :class="stockColorType === 1 ? 'number-green' : 'number-red'") {{item.apy|filterThousand}}%
                span.element-msg(v-else-if="item.msg == 2") {{item.apy}}%
                span.block-p {{$t('oneYearRate')}}
            .block-right
                .block-top
                    p {{item.fundName}} 
                .block-content
                    van-tag(
                        color="#2177FF"
                        plain
                        ) {{item.fundRisk}} 
                    van-tag(
                        color="#2177FF"
                        plain
                        ) {{item.assetTypeName}}
                    van-tag(
                        color="#2177FF"
                        plain
                        ) {{item.earningsTypeName}}
                .block-bottom 
                    p {{item.feature}} 
                .block-position 
            .block-element-msg(v-if="item.havePosition") {{$t('holdPosition')}}
</template>
<script>
import { Tag } from 'vant'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { getStockColorType } from '@/utils/html-utils.js'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    components: {
        [Tag.name]: Tag
    },
    props: {
        fundList: {
            type: Array,
            default: () => {}
        }
    },
    i18n: {
        zhCHS: {
            title: '人气之选',
            subtitle: '众多投资者的选择',
            oneYearRate: '近一年收益率',
            holdPosition: '已持仓'
        },
        zhCHT: {
            title: '人氣之選',
            subtitle: '眾多投資者的選擇',
            oneYearRate: '近一年表現',
            holdPosition: '已持倉'
        },
        en: {
            title: 'Hot',
            subtitle: "Most investor's choices",
            oneYearRate: 'Change in This Year',
            holdPosition: 'Positioned'
        }
    },
    filters: {
        filterThousand: transNumToThousandMark
    },
    methods: {
        toFundDetails(item) {
            gotoNewWebView(
                `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${item.fundId}`
            )
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    }
}
</script>
<style lang="scss" scoped>
.home-fund-list {
    margin: 0 0 20px 0;
    float: left;
    width: 100%;
}
.fund-title-name {
    width: 96%;
    margin: 14px 2% 10px 2%;
    .title {
        font-size: 0.36rem;
        font-weight: 500;
        line-height: 25px;
        float: left;
    }
    .subtitle {
        font-size: 0.28rem;
        margin: 0 0 0 10px;
        float: left;
        line-height: 26px;
    }
}
.fund-list-content {
    float: left;
    // margin: 10px 0 0 0;
    width: 100%;
    .list-item {
        width: 96%;
        margin: 10px 2% 0 2%;
        padding: 20px 15px;
        background: #fff;
        border-radius: 4px;
        position: relative;
        display: flex;
        flex-direction: row;
        height: 110px;
        .block-left,
        .block-right {
            width: 40%;
            line-height: 30px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            .block-black,
            .block-num,
            .element-msg {
                font-size: 0.48rem;
                line-height: 31px;
            }
            .block-num {
                font-family: yxFontDINPro-Medium;
            }
            .block-black {
                color: #04ba60;
            }
            .number-red {
                color: rgba(234, 61, 61, 1);
            }
            .number-green {
                color: #04ba60;
            }
        }
        .block-right {
            width: 60%;
            line-height: 27px;
            .block-top {
                p {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                }
            }
            .block-bottom {
                p {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    line-height: 20px;
                    font-size: 12px;
                }
            }
        }
        .block-element-msg {
            position: absolute;
            background: $primary-color-line;
            bottom: 10px;
            right: 0;
            width: 43px;
            height: 20px;
            font-size: 10px;
            border-top-left-radius: 20px;
            color: #fff;
            text-align: center;
            line-height: 20px;
            border-bottom-left-radius: 20px;
        }
    }
}
</style>
