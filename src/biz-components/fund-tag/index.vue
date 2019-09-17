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
        font-size: 0.2rem;
        color: $hk-text-line-color;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
