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
        padding: 1px 5px;
        color: $hk-text-line-color;
        // @media only screen and (min-resolution: 2dppx) {
        //     font-size: 0.2rem;
        // }
    }
}
</style>
