<template lang="pug">
    .fund-income-container(:class="lang")
        .fund-income__body
            .body-item.body-item__left
                .item  
                    .title 年化收益           
                    .label 本基金          
                    .label 同类平均          
                    .label 同类排名          
            .body-item.body-item__right
                .item  
                    .title 近一年           
                    .label +1.1          
                    .label +22.32          
                    .label +22.32  
                .item  
                    .title 近三年           
                    .label +1.1          
                    .label +22.32          
                    .label +22.32  
                .item  
                    .title 近五年           
                    .label +1.1          
                    .label +22.32          
                    .label +22.32  
                .item  
                    .title 近十年           
                    .label +1.1          
                    .label +22.32          
                    .label +22.32  
                .item  
                    .title 今年来           
                    .label +1.1          
                    .label +22.32          
                    .label +22.32  

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
<style lang="scss" scoped>
.fund-income-container {
    margin: 6px 0;
    background-color: $background-color;
}
.fund-income__body {
    display: flex;
    padding: 13px 0 13px 12px;
    .body-item {
        .item {
            .title {
                font-weight: 400;
            }
            .label {
                padding-top: 13px;
            }
        }
    }
    .body-item__left {
        width: 25%;
        text-align: left;
        .item {
            .label {
                color: $text-color5;
            }
        }
    }
    .body-item__right {
        width: 75%;
        overflow-x: scroll;
        display: flex;
        text-align: center;
        .item {
            flex-shrink: 0;
            width: 76px;
            .title {
                color: $text-color5;
            }
            .label {
                font-family: yxFontDINPro-Medium;
            }
        }
    }
}
</style>
