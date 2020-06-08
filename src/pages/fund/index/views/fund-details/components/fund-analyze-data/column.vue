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
            .content__item
                .item-title 夏普比率
                .item-value(
                    :class="stockColorTypeClass"
                ) +2.33   
            .content__item
                .item-title 上行捕获率
                .item-value(
                    :class="stockColorTypeClass"
                ) +2.33
            .content__item
                .item-title 最大回撤
                .item-value(
                    :class="stockColorTypeClass"
                ) -2.33
</template>
<script>
/**
 * @description 基金详情页分析数据模块
 * @author Aaron Lam
 * @date 2020/06/03
 */
import { mapGetters } from 'vuex'
export default {
    i18n: {},
    components: {},
    props: {},
    computed: {
        ...mapGetters(['stockColorTypeClass'])
    },
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
    padding: 0 10px;
    background-color: $background-color;
}
.fund-colunm__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(25, 25, 25, 0.05);
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
            font-size: 12px;
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
    padding: 14px 0;
    justify-content: space-between;
    .content__item {
        text-align: center;
        flex: 1;
        .item-title {
            color: $text-color5;
        }
        .item-value {
            font-size: 20px;
        }
        &:nth-child(2) {
            border-left: 1px solid rgba(25, 25, 25, 0.05);
            border-right: 1px solid rgba(25, 25, 25, 0.05);
        }
    }
}
</style>
