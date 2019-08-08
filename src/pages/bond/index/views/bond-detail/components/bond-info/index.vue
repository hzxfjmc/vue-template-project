<template lang="pug">
    .detail-bond-info-wrapper
        .bond-info-header
            a.pdf(:href="bondEditableInfo && bondEditableInfo.productOverview")
                i.icon
                span 产品概览
            a.pdf(:href="bondEditableInfo && bondEditableInfo.raiseManual")
                i.icon
                span 募集说明
        col-msg(:colData="colData")
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
    props: {
        bondEditableInfo: {
            type: Object,
            default: () => {}
        },
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        colData() {
            let obj = [
                {
                    title:
                        (this.bondEditableInfo &&
                            this.bondEditableInfo.issuerInfo &&
                            this.bondEditableInfo.issuerInfo.name) ||
                        '--',
                    desc: '债券发行人'
                },
                {
                    title:
                        (this.bondUneditableInfo &&
                            this.bondUneditableInfo.couponRate + '%') ||
                        '--',
                    desc: '票面利率'
                },
                {
                    title:
                        (this.bondUneditableInfo &&
                            this.bondUneditableInfo.paymentDate &&
                            this.bondUneditableInfo.paymentDate
                                .replace(/月/, '.')
                                .replace(/日/, '')) ||
                        '--',
                    desc: '付息日'
                }
            ]
            return obj
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
        .pdf {
            display: flex;
            align-items: center;
            height: 22px;
            padding: 0 6px;
            border: 1px solid #ebebeb;
            color: #393939;
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
    .col-column:nth-child(2) {
        padding-top: 0;
    }
}
</style>
