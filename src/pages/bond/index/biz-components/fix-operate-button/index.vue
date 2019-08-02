<template lang="pug">
    .fix-operate-btn(:disabled="disabled") {{ text }}
</template>

<script>
export default {
    name: 'FixedOperateBtn',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.fix-operate-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    color: #fff;
    font-size: 0.32rem;
    text-align: center;
    line-height: 48px;
    background-color: #0d50d8;
    &[disabled='disabled'] {
        background-color: #dadada;
    }
}
</style>
