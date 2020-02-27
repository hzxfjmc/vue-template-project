<template lang="pug">
.fund__details--list   
    .fund__list--title {{$t('more')}}
    .fund__list--content
        .fund__list--item(
            @click="goNext(item.fundId)"
            v-for="(item,index) in recommendList" 
            :key="item.fundId")
            .block__left
                .fund_time {{$t('oneYear')}}
                .fund_number(
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    v-if="item.apy>0") +{{Number(item.apy).toFixed(2)}}%
                .fund_number(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    v-else-if="item.apy<0") {{Number(item.apy).toFixed(2)}}%
                .fund_number(v-else) {{Number(item.apy).toFixed(2)}}%
            .block__right
                .fund_name {{item.fundName}}
                .fund__list--tag
                    .fund_tag
                        em.iconfont.icon-iconsjijinfengxiancopy-copy 
                        span {{item.assetType}}
                    .fund_tag
                        em.iconfont.icon-iconsjijinfengxian
                        span {{item.fundRisk}}
                    .fund_tag
                        em.iconfont.icon-iconsjijinfengxiancopy-copy1
                        span {{item.earningsTypeName}}
                p {{item.feature}}
                    

    
</template>
<script>
import { getStockColorType } from '@/utils/html-utils.js'
import { jumpUrl } from '@/utils/tools.js'
export default {
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        isMonetaryFund() {
            return Number(this.fundHeaderInfoVO.assetType) === 4 // 货币型基金
        }
    },
    props: {
        recommendList: {
            type: Array,
            default: () => {}
        }
    },
    i18n: {
        zhCHS: {
            oneYear: '近一年涨跌幅',
            more: '更多基金',
            msg:
                '以上资料来源于基金公司及第三方数据商，相关数据仅供参考本页面非任何法律文件，投资前请阅读基金合同，招募说明书基金过往业绩不预示未来表现不构成投资建议，市场有风险投资需谨慎'
        },
        zhCHT: {
            oneYear: '近一年表現',
            more: '更多基金',
            msg:
                '以上資料基金會基金公司及第三方數據商，相關數據另有參考本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書基金過往業績不預示未來表現不構成投資建議，市場有風險投資需謹慎'
        },
        en: {
            oneYear: 'Past Year',
            more: 'More',
            msg:
                'The above information comes from the fund company and third-party data providers.This page is not a legal document. Please read the fund contract and prospectus before investing.Past performance is not indicative of future performance.All investments involve risk. Investors should consult all available information,before making any investment.'
        }
    },
    methods: {
        goNext(fundId) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${fundId}`
            jumpUrl(3, url)
        }
    }
}
</script>
<style lang="scss" scoped>
.number-red {
    color: rgba(234, 61, 61, 1);
}

.number-green {
    color: #04ba60;
}
.fund__list--item {
    display: flex;
    flex-direction: row;
    margin: 10px 0 0 0;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 4px 10px 10px 10px;
    .block__left {
        width: 38%;
        .fund_time {
            font-size: 12px;
            color: #999999;
            line-height: 20px;
            margin: 10px 0 0 0;
        }
        .fund_number {
            font-size: 26px;
            font-family: yxFontDINPro-Medium;
            padding: 2px 0 0 0;
        }
    }
    .block__right {
        width: 62%;
        display: flex;
        flex-direction: column;
        .fund_name {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 10px 0 0 0;
        }
        .fund__list--tag {
            display: flex;
            font-size: 10px;
            color: #666666;
            margin: 5px 0;
            flex-wrap: wrap;
            .fund_tag {
                margin: 0 3px 0 0;
                display: flex;
                span {
                    line-height: 25px;
                }
            }
            .iconfont {
                font-size: 16px;
            }
            .icon-iconsjijinfengxiancopy-copy {
                color: #b38c23;
            }
            .icon-iconsjijinfengxian {
                color: #d0524a;
            }
            .icon-iconsjijinfengxiancopy-copy1 {
                color: #f8d61c;
            }
        }
        p {
            font-size: 12px;
            color: #666666;
        }
    }
}
.fund__list--item:first-child {
    margin: 0;
}
.fund__details--list {
    width: 100%;
    margin: 6px 0 0 0;
    padding: 0 5% 20px 5%;

    background: #fff;
}
.fund__list--title {
    line-height: 50px;
    text-align: center;
}
</style>
