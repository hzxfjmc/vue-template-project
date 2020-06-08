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
</style>
