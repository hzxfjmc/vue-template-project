<template lang="pug">
.block__income--wrapper
    van-tabs.border-bottom(
        v-model="active" 
        color="#2F79FF" 
        sticky
        :swipeable="true"
        :line-width="28"
        title-inactive-color="rgba(25,25,25,0.5)"
        title-active-color="#2F79FF")
            van-tab(title="港币基金" :name="0")
                IncomeFundList
            van-tab(title="美元基金" :name="1")
                IncomeFundList
               
</template>
<script>
import IncomeFundList from './income-fund-list'
export default {
    components: {
        IncomeFundList
    },
    data() {
        return {
            active: 0
        }
    }
}
</script>
<style lang="scss" scoped>
.block__income--wrapper {
    width: 100%;
    height: 100%;
    background: #fff;
}
</style>
