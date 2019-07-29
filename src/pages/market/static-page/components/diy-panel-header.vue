<template lang="pug">
    .diy-panel-header
        img(src="../img/stronger/quotation@2x.png" width="38")
        | {{title}}
        img.right(src="../img/stronger/quotation@2x.png" width="38")
</template>

<script>
export default {
    name: 'diy-panel-header',
    props: {
        title: String
    }
}
</script>

<style scoped lang="scss">
.diy-panel-header {
    width: 100%;
    height: 62px;
    /*position: relative;*/
    line-height: 62px;
    text-align: center;
    border-bottom: 2px dashed #ffcbcf;

    font-size: 22px;
    font-weight: 500;
    color: rgba(194, 2, 23, 1);

    img {
        position: relative;
        top: -3px;
        margin: 0 8px;
        vertical-align: text-bottom;

        &.right {
            visibility: hidden;
        }
    }

    /*img {*/
    /*    position: absolute;*/
    /*    top: 13px;*/
    /*    left: 83px;*/
    /*}*/

    /*@media screen and (max-width: 320px) {*/
    /*    img {*/
    /*        left: 70px;*/
    /*        top: 9px;*/
    /*    }*/
    /*}*/
}
</style>
