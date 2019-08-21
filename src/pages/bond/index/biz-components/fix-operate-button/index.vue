<template lang="pug">
    .fix-operate-btn(:disabled="disabled" @click="handleClick") {{ text }}
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
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e)
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
    color: rgb(255, 255, 255);
    font-size: 0.32rem;
    text-align: center;
    line-height: 48px;
    background-color: $primary-color;
    &[disabled='disabled'] {
        background-color: $disabled-color;
    }
}
</style>
