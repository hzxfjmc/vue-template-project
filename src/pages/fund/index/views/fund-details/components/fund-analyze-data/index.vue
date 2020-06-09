<template lang="pug">
    .fund-analyze-container.fund-container
        .fund-info__header
            .header__top
                .title Pimco 亚洲投资级债券基金-A2
                .desc ISIN:LU0538203018
            .header__bottom
                .item
                    span.item__label 基金规模(美元)：
                    span.item__value 1,234.89
                .item
                    span.item__label 数据更新时间：
                    span.item__value 2020-10-23    
        .fund-block
            .fund-block__header
                .title 风险指标
                .link 指标说明 
            .fund-block__content                             
        .fund-block
            .fund-block__header
                .title 投资风格箱（大盘平衡型）
                .link 风格箱说明 
            .fund-block__content  
        .fund-block
             .fund-block__content
                p.text *本页面资料来源于基金管理公司、晨星资讯（深圳）有限公司（“晨星”）、其他基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,友信对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。                                
                p.text 相关数据仅供参考，本页面非任何法律文件，投资前请阅读基金合同，招募说明书。基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。                               
</template>
<script>
/**
 * @description 基金详情页分析数据模块
 * @author Aaron Lam
 * @date 2020/06/08
 */
export default {
    i18n: {},
    components: {},
    props: {},
    computed: {},
    data() {
        return {}
    },
    methods: {},
    created() {}
}
</script>
<style lang="scss" scoped>
.fund-container {
    background-color: $background-bottom-color;
}
.fund-info__header {
    background-color: $background-color;
    .header__top {
        padding: 20px 12px 14px;
        border-bottom: 1px solid $text-color8;
        .title {
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
            color: $text-color;
        }
        .desc {
            font-size: 12px;
            font-weight: 400;
            color: $text-color5;
            line-height: 18px;
        }
    }
    .header__bottom {
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        .item__label {
            color: $text-color5;
        }
    }
}
.fund-block {
    margin-top: 6px;
    background-color: $background-color;
    .fund-block__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 10px;
        .title {
            font-size: 16px;
            font-weight: 500;
        }
        .link {
            font-weight: 400;
            color: $primary-color-line;
        }
    }
    .fund-block__content {
        .text {
            padding: 12px;
            color: $text-color5;
        }
    }
}
</style>
