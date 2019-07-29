<template lang="pug">
    .header-cell(:class="{'mainland-component': $ua.isMainland}") {{title}}
        slot
</template>

<script>
// 短线策略详情面板头部
export default {
    name: 'header-cell',
    props: ['title']
}
</script>

<style scoped lang="scss">
.header-cell {
    position: relative;
    font-size: 20px;
    font-weight: 400;
    color: rgba(57, 57, 57, 1);
    line-height: 28px;

    &:before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        position: relative;
        top: 2.5px;
        margin-right: 14px;
        background: rgba(57, 57, 57, 1);
    }

    .right {
        height: auto;
        line-height: normal;
        position: absolute;
        top: 50%;
        right: 18px;
        transform: translateY(-50%);
    }
}

.mainland-component {
    padding: 0 12px;
    color: #ebebeb;
    font-size: 16px;

    &:before {
        display: none;
    }

    .right {
        right: 12px;
    }
}
</style>
