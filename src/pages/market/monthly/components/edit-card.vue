<template lang="pug">
    .edit-card
        .item
            .item__label {{ $t('other.stock') }}
            .item__value
                | {{ data.stockName }}
                .item__code {{ data.stockCode }}
        .item
            .item__label {{ $t('other.withholdMethod') }}
            .item__value {{ $t('edit.canUseCash') }}
        // 暂时隐藏.tips
            | {{ $t('edit.createTips') }}
            a(href="/webapp/market/generator.html?key=XY0041") {{ $t('edit.autoTrans') }}
</template>

<script>
export default {
    name: 'edit-card',
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
.edit-card {
    margin: 14px 18px 44px;
    padding: 20px 14px 15px;
    background: #6e9dff;
    border-radius: 10px;
}
.item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    font-size: 16px;
    color: #fff;
}
.item__label {
    color: rgba(#fff, 0.7);
}
.item__value {
    position: relative;
}
.item__code {
    position: absolute;
    right: 0;
    top: 100%;
    font-size: 12px;
    color: rgba(#fff, 0.4);
}
.tips {
    text-align: right;
    font-size: 12px;
    color: rgba(#fff, 0.4);
    a {
        color: #fff;
        margin-left: 2px;
    }
}
</style>
