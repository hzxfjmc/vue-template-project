<template lang="pug">
    .no-data(:class="{black: color === 'black'}")
        img(src="../0-images/no-data.png" v-if="color !== 'black'")
        img(src="../0-images/no-data-1.png" v-else)
        p {{ text }}
        slot
</template>

<script>
export default {
    name: 'no-data',
    props: {
        color: {
            type: String,
            default: 'white' // white,black
        },
        text: {
            type: String,
            default: '暂无记录'
        }
    }
}
</script>

<style lang="scss" scoped>
.no-data {
    text-align: center;
    img {
        width: 130px;
        margin-top: 160px;
    }
    p {
        margin-top: 14px;
        color: rgba(#393939, 0.4);
    }
    &.black {
        p {
            color: #58687f;
        }
    }
}
</style>
