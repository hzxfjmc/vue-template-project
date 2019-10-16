<template lang="pug">
.fund-account-header
    .header-tab
        van-tabs(
            v-model="active" 
            background="#000" 
            color="#fff" 
            border=false
            title-inactive-color="#fff" 
            title-active-color="#fff")
            van-tab(title="港币基金" name="1")
            van-tab(title="美元基金" name="2")
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
// @import './index.scss';
.fund-account-header {
    background: #000;
    color: #fff;
    width: 100%;
    padding: 0 2%;
}
.header-tab {
    width: 50%;
    margin: 0 25%;
    .van-ellipsis {
        color: #fff !important;
    }
    .van-tabs__wrap {
        border-color: #000 !important;
    }
}
</style>
