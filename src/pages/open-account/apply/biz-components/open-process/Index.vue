<template lang="pug">
.open-process
    p 开户进度{{process}}%
    .p-block(:style="`width:${process}%;`")
</template>

<script>
export default {
    props: {
        process: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.open-process {
    width: 100%;
    height: 24px;
    background: linear-gradient(
        270deg,
        rgba(34, 109, 221, 0.4) 0%,
        rgba(40, 90, 200, 0.4) 100%
    );
    position: relative;
    .p-block {
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
            270deg,
            rgba(34, 109, 221, 1) 0%,
            rgba(40, 90, 200, 1) 100%
        );
        position: absolute;
    }
    p {
        text-align: center;
        line-height: 24px;
        color: #fff;
        z-index: 100;
        width: 100%;
        position: absolute;
    }
}
</style>
