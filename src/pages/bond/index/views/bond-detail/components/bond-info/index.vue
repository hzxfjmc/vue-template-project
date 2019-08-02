<template lang="pug">
    .detail-bond-info-wrapper
        .bond-info-header
            .part
                i.icon
                span 产品概览
            .part
                i.icon
                span 募集说明
        col-msg(:col-data="colData" style="padding-top:0")
        col-msg(:col-data="colData")
        col-msg(:col-data="colData")
</template>
<script>
import { Row, Col } from 'vant'
import ColMsg from '@/pages/bond/index/biz-components/col-msg/index.vue'
export default {
    name: 'BondInfo',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        ColMsg
    },
    data() {
        return {
            colData: [
                {
                    title: '苹果',
                    desc: '债券发行人'
                },
                {
                    title: '3.651%',
                    desc: '票面利率'
                },
                {
                    title: '3.22、9.22',
                    desc: '付息日'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-info-wrapper {
    padding-bottom: 15px;
    .bond-info-header {
        position: absolute;
        top: 14px;
        right: 14px;
        display: flex;
        .part {
            display: flex;
            align-items: center;
            height: 22px;
            padding: 0 6px;
            border: 1px solid #ebebeb;
            border-radius: 1px;
            &:first-child {
                margin-right: 10px;
            }
            i {
                display: inline-block;
                width: 12px;
                height: 13px;
                margin-right: 7px;
                background: url('~@/assets/img/bond/icon-pdf.png') center
                    no-repeat;
                background-size: 100% 100%;
            }
            span {
                font-size: 12px;
            }
        }
    }
}
</style>
