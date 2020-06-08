<template lang="pug">
    .fund-colunm
        .fund-colunm__header
            .col-left
                .iconfont.icon-iconEBshoucang
                .title 分析数据（3年）   
            .col-right
                span.title 查看更多
                span.iconfont.icon-iconEBgengduoCopy    
        .fund-colunm__content
</template>
<script>
/**
 * @description 基金详情页分析数据模块
 * @author Aaron Lam
 * @date 2020/06/03
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
.fund-colunm {
    margin-top: 6px;
    padding: 15px 10px;
    background-color: $background-color;
}
.fund-colunm__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    .col-left {
        display: flex;
        align-items: center;
        .title {
            font-size: 16px;
            padding-left: 10px;
        }
        .iconfont {
            font-size: 20px;
        }
    }
    .col-right {
        .title {
            font-size: 14px;
            color: #666;
        }
        text-align: right;
        .iconfont {
            font-size: 15px;
        }
    }
}
.fund-colunm__content {
    display: flex;
}
</style>
