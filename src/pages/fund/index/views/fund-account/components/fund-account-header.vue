<template lang="pug">
.fund-account-header
    .header-tab
        van-tabs(
            v-model="active" 
            background="#000" 
            color="#fff" 
            title-inactive-color="#fff" 
            title-active-color="#fff")
            van-tab(title="标签1" name="1")
            van-tab(title="标签2" name="2")
    .header-content
        span fhsjfhsdjfhdj hjfhsdjfh dfdjhfhsdjfhsdjhfjsdh
</template>
<script>
import { Tab, Tabs } from 'vant'
export default {
    data() {
        return {
            active: '1'
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    }
}
</script>
<style lang="scss" scoped>
.header-tab {
    width: 50%;
    background: #000;
    margin: 0 25%;
    .van-ellipsis {
        color: #fff !important;
    }
}
</style>
