<template lang="pug">
    .title-header-box
        .title(:style="titleStyleObj") {{title}}
        .sub-title(:style="subTitleStyleObj") {{subTitle}}
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
        titleStyleObj: {
            type: Object,
            default: () => {
                return {}
            }
        },
        subTitleStyleObj: {
            type: Object,
            default: () => {
                return {}
            }
        }
    }
}
</script>

<style scoped lang="scss">
.title-header-box {
    padding: 13px 18px 20px;
    .title {
        font-size: 28px;
        font-weight: 500;
        line-height: 40px;
        padding-left: 4px;
    }
    .sub-title {
        color: $hk-text-color;
        opacity: 0.4;
        line-height: 20px;
        margin-top: 4px;
    }
}
</style>
