<template lang="pug">
.block__fund-list--wrapper
    .block__header--apy
        .block__left--num
            span {{activeName===0?$t('hkd'):$t('usd')}}{{$t('positionEarnings')}}({{activeName===0?$t('hkd'):$t('usd')}})
            .num(
                v-if="holdStateData.earnings>0"
                :class="stockColorType === 1 ? 'color-red' : 'color-green'") +{{holdStateData.earnings|transNumToThousandMark}} 
            .num(
                v-if="holdStateData.earnings<0"
                :class="stockColorType === 1 ? 'color-green' : 'color-red'") {{holdStateData.earnings|transNumToThousandMark}} 
            .num(v-if="holdStateData.earnings==0") {{holdStateData.earnings|transNumToThousandMark}} 
    .block__hr
    .block__list--wrapper
        .block__list--item.border-bottom(
            @click="goToHoldFundDetails(item)"
            v-for="(item,index) in holdStateData.fundGroupEarningsVOList")
            .block__item
                .fund-name.ellipse {{item.fundName}}
                .tag(v-if="item.havePosition") {{$t('hold')}}
                .tag(v-else) {{$t('ClosedPosition')}}
            .block__item
                .desc {{$t('C1')}}
                .num( 
                    v-if="item.earnings>0"
                    :class="stockColorType === 1 ? 'color-red' : 'color-green'") +{{item.earnings|transNumToThousandMark}}
                .num( 
                    v-if="item.earnings<0"
                    :class="stockColorType === 1 ? 'color-green' : 'color-red'") {{item.earnings|transNumToThousandMark}}
                .num(v-if="item.earnings==0") {{item.earnings|transNumToThousandMark}}
        .block-element-nomore(v-if="holdStateData.fundGroupEarningsVOList.length === 0")
            img.img(src="@/assets/img/fund/icon-norecord.png") 
            .no-record-box {{$t('nomore')}}

</template>
<script>
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    data() {
        return {
            noMoreShow: false,
            list: []
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    methods: {
        goToHoldFundDetails(item) {
            let url = `${window.location.origin}/wealth/fund/index.html#/hold-fund-details?id=${item.fundId}`
            jumpUrl(3, url)
        }
    },
    props: {
        holdStateData: {
            type: Object,
            default: () => {}
        },
        activeName: {
            type: Number,
            default: 0
        }
    },
    i18n: {
        zhCHS: {
            nomore: '暂无收益',
            positionEarnings: '持仓收益',
            C1: '收益',
            hold: '持仓中',
            ClosedPosition: '已清仓',
            NotSupport: '暂不支持'
        },
        zhCHT: {
            nomore: '暫無收益',
            positionEarnings: '持有收益',
            C1: '收益',
            hold: '持倉中',
            ClosedPosition: '已清倉',
            NotSupport: '暫不支持'
        },
        en: {
            nomore: 'No Return',
            positionEarnings: 'Total P/L',
            C1: 'Return',
            hold: 'Hold Position',
            ClosedPosition: 'Closed Position',
            NotSupport: 'Not Support'
        }
    }
}
</script>
<style lang="scss" scoped>
.block__header--apy {
    padding: 20px 12px 14px 12px;
    // height: 58px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span {
        color: rgba(25, 25, 25, 0.45);
        font-size: 12px;
        line-height: 20px;
    }
    .num {
        font-size: 28px;
        font-family: yxFontDINPro-Bold;
        line-height: 34px;
    }
    .block__left--num {
        text-align: left;
    }
    .block__right--num {
        text-align: right;
    }
}
.block__hr {
    width: 100%;
    height: 6px;
    background: #f3f3f3;
}
.block__list--wrapper {
    min-height: 400px;
    background: #fff;
}
.block__list--item {
    padding: 0 12px;
    height: 80px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .block__item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 12px 0 0 0;
        .desc {
            color: rgba(25, 25, 25, 0.65);
        }
        .fund-name {
            width: 72%;
        }
        .tag {
            border: 1px solid #2f79ff;
            font-size: 10px;
            border-radius: 3px;
            padding: 0 2px;
            line-height: 20px;
            color: #2f79ff;
        }
    }
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 150px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
</style>
