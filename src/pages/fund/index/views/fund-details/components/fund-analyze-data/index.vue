<template lang="pug">
    .fund-analyze-container.fund-container
        .fund-info__header
            .header__top
                .title Pimco 亚洲投资级债券基金-A2
                .desc ISIN:LU0538203018
            .header__bottom
                .item
                    .item__label 基金规模(美元)：
                    .item__value 1,234.89  
                .item
                    .item__label 数据更新时间：
                    .item__value 2020-10-23
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
}
</style>
