import { Row, Col } from 'vant'
import { calcCountDownDay, dateFormat } from '@/utils/tools.js'
import ColMsg from '@/biz-components/col-msg/index.vue'
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
                        d = d ? d.split('|') : ''
                        let suffix = d.length > 2 ? '等' : ''
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
