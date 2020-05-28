<template lang="pug">
.block__income--wrapper
    van-tabs.border-bottom(
        v-model="activeName" 
        color="#2F79FF" 
        sticky
        :swipeable="true"
        :line-width="28"
        @change="changeTabNav"
        title-inactive-color="rgba(25,25,25,0.5)"
        title-active-color="#2F79FF")
            van-tab(title="港币基金" name="1")
                IncomeFundList(:holdStateData="holdStateData")
            van-tab(title="美元基金" name="2")
                IncomeFundList(:holdStateData="holdStateData")
               
</template>
<script>
import IncomeFundList from './income-fund-list'
import { getFundGroupEarnings } from '@/service/finance-server'
export default {
    components: {
        IncomeFundList
    },
    data() {
        return {
            activeName: 0,
            holdStateData: {
                fundGroupEarningsVOList: []
            }
        }
    },
    created() {
        this.getFundGroupEarnings()
    },
    methods: {
        changeTabNav() {
            this.getFundGroupEarnings()
        },
        async getFundGroupEarnings() {
            try {
                let currency = this.activeName + 1
                const res = await getFundGroupEarnings({
                    currency: currency
                })
                this.holdStateData = res
            } catch (e) {
                this.$toast(e.msg)
            }
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
