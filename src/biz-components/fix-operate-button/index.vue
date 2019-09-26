<template lang="pug">
    .back-mask
        .fix-operate-btn(:style="customStyle" :disabled="disabled" @click="handleClick") {{ text }}
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
        },
        customStyle: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.back-mask {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background-color: #fff;
    color: rgb(255, 255, 255);
    font-size: 0.32rem;
    text-align: center;
    line-height: 48px;
    z-index: 10;
    .fix-operate-btn {
        width: 100%;
        height: 100%;
        background-color: $primary-color;
        &[disabled='disabled'] {
            background-color: $disabled-color;
        }
    }
}
</style>
