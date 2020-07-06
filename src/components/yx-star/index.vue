<template lang="pug">
    .star(v-if="score")
        span(v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index")
</template>
<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_OFF = 'off'
export default {
    name: 'star',
    props: {
        score: {
            type: String
        }
    },
    computed: {
        itemClasses() {
            let result = []
            const score = Math.floor(this.score * 2) / 2
            for (let i = 0; i < score; i++) {
                result.push(CLS_ON)
            }
            while (result.length < LENGTH) {
                result.push(CLS_OFF)
            }
            return result
        }
    }
}
</script>
<style lang="scss" scoped>
.star {
    display: flex;
    align-items: center;
    justify-content: center;
    .star-item {
        width: 13px;
        height: 13px;
        margin-right: 2px;
        background-size: 13px 13px;
        &.last-child {
            margin-right: 0;
        }
        &.on {
            background-image: url('~@/assets/img/fund/icon_star_on.png');
        }
        &.off {
            background-image: url('~@/assets/img/fund/icon_star_off.png');
        }
    }
}
</style>
