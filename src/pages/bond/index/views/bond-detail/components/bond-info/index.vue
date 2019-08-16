<template lang="pug">
    .detail-bond-info-wrapper
        .bond-info-header
            a.pdf(
                v-if="bondEditableInfo && bondEditableInfo.productOverview"
                :href="bondEditableInfo && bondEditableInfo.productOverview"
            )
                i.icon
                span 产品概览
            a.pdf(
                v-if="bondEditableInfo && bondEditableInfo.raiseManual"
                :href="bondEditableInfo && bondEditableInfo.raiseManual"
            )
                i.icon
                span 募集说明
        .con(@click="toggleShowMoreMsg")
            col-msg.hd-col(:colData="colData")
            .more-msg(v-show="showMore")
                col-msg(
                    v-for="(msgItem, index) in moreBondMsg"
                    :key="index"
                    :colData="msgItem"
                )

</template>
<script>
import { Row, Col } from 'vant'
import { calcCountDownDay, dateFormat } from '@/utils/tools.js'
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
    data() {
        return {
            showMore: false // 是否展示更多债券信息
        }
    },
    computed: {
        colData() {
            let obj = [
                {
                    title:
                        (this.bondEditableInfo &&
                            this.bondEditableInfo.issuer &&
                            this.bondEditableInfo.issuer.name) ||
                        '--',
                    desc: '债券发行人'
                },
                {
                    title:
                        (this.bondUneditableInfo &&
                            this.bondUneditableInfo.couponRate &&
                            (this.bondUneditableInfo.couponRate - 0).toFixed(
                                3
                            ) + '%') ||
                        '--',
                    desc: '票面利率'
                },
                {
                    title: (() => {
                        let d =
                            this.bondUneditableInfo &&
                            this.bondUneditableInfo.paymentDate
                        d = d ? d.split('|') : []
                        let suffix = d.length >= 2 ? '等' : ''
                        return d ? d.slice(0, 2).join('、') + suffix : '--'
                    })(),
                    desc: '付息日'
                }
            ]
            return obj
        },
        moreBondMsg() {
            let _this = this
            let obj = [
                [
                    {
                        title:
                            dateFormat(
                                this.bondUneditableInfo &&
                                    this.bondUneditableInfo.issueTime &&
                                    this.bondUneditableInfo.issueTime,
                                'YYYY年MM月DD日'
                            ) || '--',
                        desc: '债券发行时间'
                    },
                    {
                        title:
                            dateFormat(
                                this.bondUneditableInfo &&
                                    this.bondUneditableInfo.dueTime &&
                                    this.bondUneditableInfo.dueTime,
                                'YYYY年MM月DD日'
                            ) || '--',
                        desc: '到期时间'
                    },
                    {
                        title: calcCountDownDay(
                            _this.bondUneditableInfo &&
                                _this.bondUneditableInfo.dueTime
                        ),
                        desc: '剩余年限'
                    }
                ],
                [
                    {
                        title:
                            (this.bondUneditableInfo &&
                                this.bondUneditableInfo.enumPaymentType &&
                                this.bondUneditableInfo.enumPaymentType.name) ||
                            '--',
                        desc: '付息类型'
                    },
                    {
                        title:
                            (this.bondUneditableInfo &&
                                this.bondUneditableInfo.enumPaymentFrequency &&
                                this.bondUneditableInfo.enumPaymentFrequency
                                    .name) ||
                            '--',
                        desc: '付息频率'
                    },
                    {
                        title:
                            (this.bondEditableInfo &&
                                this.bondEditableInfo.creditRating &&
                                this.bondEditableInfo.creditRating.rank) ||
                            '--',
                        desc:
                            '发行人评级（' +
                            (this.bondEditableInfo &&
                                this.bondEditableInfo.creditRating &&
                                this.bondEditableInfo.creditRating.agency) +
                            '）'
                    }
                ]
            ]
            return obj
        }
    },
    methods: {
        toggleShowMoreMsg() {
            this.showMore = !this.showMore
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-info-wrapper {
    padding-top: 2px;
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
    .col-column:nth-child(1) {
        padding-top: 0;
    }
}
</style>
<style lang="scss">
.detail-bond-info-wrapper {
    .hd-col {
        &.col-column {
            .van-col:nth-child(3) {
                .van-col__title {
                    font-size: 0.22rem;
                }
            }
        }
    }
}
</style>
