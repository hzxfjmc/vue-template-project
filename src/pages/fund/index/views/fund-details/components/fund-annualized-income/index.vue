<template lang="pug">
 .fund-income-container.fund-container(:class="lang")
    span 年化收益
</template>
<script>
/**
 * @description 基金详情页年化收益模块
 * @author Aaron Lam
 * @date 2020/06/16
 */

import { mapGetters } from 'vuex'
import { getFundReturnV1 } from '@/service/finance-info-server.js'
export default {
    i18n: {},
    components: {},
    props: {
        fundId: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        ...mapGetters(['lang'])
    },
    data() {
        return {}
    },
    methods: {
        async getFundReturn() {
            const params = {
                fundId: this.fundId
            }
            await getFundReturnV1(params)
        },
        init() {
            this.getFundReturn()
        }
    },
    created() {
        this.init()
    }
}
</script>
<style lang="scss" scoped></style>
