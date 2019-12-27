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
                    v-if="item.apy>0") +{{item.apy}}%
                .fund_number(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    v-else-if="item.apy<0") {{item.apy}}%
                .fund_number(v-else) {{item.apy}}%
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
                    

    .fund___list--p
        p 以上資料來源於基金公司及第三方數據商，相關數據僅供參考本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書基金過往業績不預示未來表現，不構成投資建議，市場有風險投資需謹慎。
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
            oneYear: '近一年',
            more: '更多基金'
        },
        zhCHT: {
            oneYear: '近一年',
            more: '更多基金'
        },
        en: {
            oneYear: 'Last 1 year',
            more: 'More'
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
    background: #fff;
    padding: 4px 10px 10px 10px;
    .block__left {
        width: 38%;
        .fund_time {
            font-size: 12px;
            color: #999999;
            line-height: 20px;
            // padding: 8px 0 0 0;
        }

        .fund_number {
            font-size: 26px;
            font-family: yxFontDINPro-Medium;
            // line-height: 40px;
            padding: 8px 0 0 0;
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
            line-height: 17px;
        }
        .fund__list--tag {
            display: flex;
            font-size: 10px;
            color: #666666;
            margin: 5px 0;
            flex-direction: row;
            .fund_tag {
                margin: 0 3px 0 0;
                display: flex;
                flex-direction: row;
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
.fund__details--list {
    width: 90%;
    margin: 0 5%;
    .fund___list--p {
        margin: 10px 0;
        p {
            font-size: 12px;
            line-height: 17px;
            color: #999999;
        }
    }
}
.fund__list--title {
    line-height: 50px;
    text-align: center;
}
</style>
