<template lang="pug">
    .fund-tag
        van-tag(
            color="#2177FF"
            plain
        ) {{ title }}

</template>
<script>
import { Tag } from 'vant'
export default {
    name: 'fond-tag',
    components: {
        [Tag.name]: Tag
    },
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss">
.fund-tag {
    .van-tag--plain {
        overflow: hidden;
        min-width: 36px;
        max-width: 89px;
        padding: 1px 4px 1px 5px;
        margin-right: 2px;
        font-size: 0.2rem;
        text-align: center;
        line-height: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $hk-text-line-color;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
