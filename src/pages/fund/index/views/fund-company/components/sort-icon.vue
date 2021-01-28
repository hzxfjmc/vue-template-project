<template lang="pug">
    .sort-container
        img(
            :class="{'icon-up': value === 2}"
            :src="require(`@/assets/img/fund/fund-list/${value === 0 ? 'default' : 'light'}.png`)" 
        )
</template>

<script>
// 0=default， 1=up， 2=down
export default {
    name: 'sort-icon',
    props: {
        value: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.sort-container {
    display: flex;
    height: 40px;
    align-items: center;
    img {
        height: 20px;
        width: 20px;
    }
    .icon-up {
        transform: rotate(180deg);
    }
}
</style>
