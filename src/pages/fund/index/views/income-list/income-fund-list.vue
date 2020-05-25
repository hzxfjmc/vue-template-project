<template lang="pug">
.block__fund-list--wrapper
    .block__header--apy
        .block__left--num
            span 港币持仓收益(港币)
            .num +2.33
        .block__right--num
            span 持有收益率
            .num 12.34%
    .block__hr
    .block__list--wrapper
        .block__list--item
            .block__item
                .fund-name 贝莱德全球基金-环球高收益
                .tag 持仓中
            .block__item
                .desc 收益
                .num -3000

</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__header--apy {
    padding: 0 12px;
    height: 92px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span {
        color: rgba(25, 25, 25, 0.45);
        font-size: 12px;
    }
    .num {
        font-size: 28px;
        font-family: yxFontDINPro-Bold;
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
</style>
