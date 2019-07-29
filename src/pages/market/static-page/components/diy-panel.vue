<template lang="pug">
    .diy-panel(:class="{texture: texture}")
        slot(name="header")
        .content
            slot
        slot(name="footer")
</template>

<script>
export default {
    name: 'diy-panel',
    props: {
        texture: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped lang="scss">
.diy-panel {
    width: 100%;
    position: relative;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 249, 249, 1) 100%
    );
    border-radius: 5px;

    &.texture {
        &:before,
        &:after {
            content: '';
            display: block;
            height: 20px;
            position: absolute;
            border-radius: 5px;
            background: url('../img/stronger/floor@2x.png') repeat center;
            background-size: cover;
        }

        &:before {
            width: calc(100% - 20px);
            left: 10px;
            bottom: -5px;
        }

        &:after {
            width: calc(100% - 40px);
            left: 20px;
            bottom: -10px;
        }
    }

    .content {
        padding: 20px 18px;
    }
}
</style>
