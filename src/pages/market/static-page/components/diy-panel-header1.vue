<template lang="pug">
    .diy-panel-header
        img.left(src="../img/big-data/decorate@2x.png" width="30")
        | {{title}}
        img.right(src="../img/big-data/decorate@2x.png" width="30")
</template>

<script>
export default {
    name: 'diy-panel-header1',
    props: {
        title: String
    }
}
</script>

<style scoped lang="scss">
.diy-panel-header {
    width: 100%;
    height: 62px;
    line-height: 62px;
    text-align: center;

    font-size: 20px;
    font-weight: 500;
    color: rgba(31, 31, 108, 1);

    img {
        margin: 0 7px;
        vertical-align: middle;

        &.right {
            transform: rotate(180deg);
        }
    }
}
</style>
