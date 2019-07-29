<template lang="pug">
    .diy-panel-footer
        img.left(src="../img/stronger/hook@2x.png")
        img.right(src="../img/stronger/hook@2x.png")
</template>

<script>
export default {
    name: 'diy-panel-footer'
}
</script>

<style scoped lang="scss">
.diy-panel-footer {
    position: relative;
    height: 0;
    img {
        width: 10px;
        height: 54px;
        position: absolute;
        top: -15px;
        z-index: 10;
    }

    .left {
        left: 65px;
    }

    .right {
        right: 65px;
    }
}
</style>
