<template lang="pug">
    .sort-container
        img.primary(
            v-if="!isProApp"
            :class="{'icon-up': value === 2}"
            :src="require(`@/assets/img/fund/fund-list/${value === 0 ? 'default' : 'light'}.png`)" 
        )
        img.pro(
            v-else
            :class="{'icon-up': value === 2}"
            :src="require(`@/assets/img/fund/fund-list/${value === 0 ? 'default' : 'light_pro'}.png`)" 
        )
</template>

<script>
// 0=default， 1=up， 2=down
export default {
    name: 'sort-icon',
    data() {
        return {
            isProApp: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            let body = document.querySelector('body')
            if (body.getAttribute('data-theme') === 'pro-theme') {
                this.isProApp = true
            }
        })
    },
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
