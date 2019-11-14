import { Row, Col } from 'vant'
import { selectProtocolInfo } from '@/service/config-manager.js'
import { calcCountDownDay, dateFormat } from '@/utils/tools.js'
import ColMsg from '@/biz-components/col-msg/index.vue'
export default {
    name: 'BondInfo',
    i18n: {
        zhCHS: {
            issuerName: '债券发行人',
            couponRate: '票面利率',
            paymentDate: '付息日',
            issueTime: '债券发行时间',
            dueTime: '到期时间',
            dueDay: '剩余年限',
            paymentTypeName: '付息类型',
            paymentFrequencyName: '付息频率',
            creditRatingAgency: '发行人评级'
        },
        zhCHT: {
            issuerName: '債券發行人',
            couponRate: '票面利率',
            paymentDate: '付息日',
            issueTime: '債券發行時間',
            dueTime: '到期時間',
            dueDay: '剩餘年限',
            paymentTypeName: '付息類型',
            paymentFrequencyName: '付息頻率',
            creditRatingAgency: '發行人評級'
        },
        en: {
            issuerName: '债券发行人',
            couponRate: '票面利率',
            paymentDate: '付息日',
            issueTime: '债券发行时间',
            dueTime: '到期时间',
            dueDay: '剩余年限',
            paymentTypeName: '付息类型',
            paymentFrequencyName: '付息频率',
            creditRatingAgency: '发行人评级'
        }
    },
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
    created() {
        this.handleSelectProtocolInfo()
    },
    data() {
        return {
            productOverview: '',
            raiseManual: '',
            showMore: false // 是否展示更多债券信息
        }
    },
    computed: {
        colData() {
            return [
                {
                    title: this.issuerName,
                    desc: this.$t('issuerName')
                },
                {
                    title: this.couponRate,
                    desc: this.$t('couponRate')
                },
                {
                    title: this.paymentDate,
                    desc: this.$t('paymentDate')
                }
            ]
        },
        moreBondMsg() {
            let obj = [
                [
                    {
                        title: this.issueTime,
                        desc: this.$t('issueTime')
                    },
                    {
                        title: this.dueTime,
                        desc: this.$t('dueTime')
                    },
                    {
                        title: this.dueDay,
                        desc: this.$t('dueDay')
                    }
                ],
                [
                    {
                        title: this.paymentTypeName,
                        desc: this.$t('paymentTypeName')
                    },
                    {
                        title: this.paymentFrequencyName,
                        desc: this.$t('paymentFrequencyName')
                    }
                ]
            ]
            // 有则展示，没有也增加一个空的，用来保持布局
            if (this.creditRatingRank) {
                obj[1].push({
                    title: this.creditRatingRank,
                    desc: `${this.$t('creditRatingAgency')}${
                        this.creditRatingAgency
                    }`
                })
            } else {
                obj[1].push({
                    title: '',
                    desc: ''
                })
            }
            return obj
        },
        // 发行人
        issuerName() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.name) ||
                '--'
            )
        },
        // 票面利率
        couponRate() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.couponRate &&
                    (this.bondUneditableInfo.couponRate * 100).toFixed(2) +
                        '%') ||
                '--'
            )
        },
        // 债券发行时间
        issueTime() {
            return (
                dateFormat(
                    this.bondUneditableInfo &&
                        this.bondUneditableInfo.issueTime &&
                        this.bondUneditableInfo.issueTime,
                    'YYYY.MM.DD'
                ) || '--'
            )
        },
        // 到期时间
        dueTime() {
            return (
                dateFormat(
                    this.bondUneditableInfo &&
                        this.bondUneditableInfo.dueTime &&
                        this.bondUneditableInfo.dueTime,
                    'YYYY.MM.DD'
                ) || '--'
            )
        },
        // 剩余年限
        dueDay() {
            return calcCountDownDay(
                this.bondUneditableInfo && this.bondUneditableInfo.dueTime
            )
        },
        // 付息类型
        paymentTypeName() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.paymentType) ||
                '--'
            )
        },
        // 付息频率
        paymentFrequencyName() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.paymentFrequency) ||
                '--'
            )
        },
        // 发行人评级
        creditRatingRank() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.creditRating &&
                    this.bondEditableInfo.creditRating.rank) ||
                ''
            )
        },
        // 发行人评级类型
        creditRatingAgency() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.creditRating &&
                    `（${this.bondEditableInfo.creditRating.agency}）`) ||
                ''
            )
        }
    },
    methods: {
        // 获取 产品概览、募集说明书
        async handleSelectProtocolInfo(key, pdfType) {
            try {
                let { protocolUrl } = await selectProtocolInfo(key)
                if (pdfType === 'product') {
                    this.productOverview = protocolUrl
                } else {
                    this.raiseManual = protocolUrl
                }
                console.log(
                    'handleSelectProtocolInfo:pdfType>>>data :',
                    protocolUrl
                )
            } catch (e) {
                console.log('handleSelectProtocolInfo:pdfType>>>error :', e)
            }
        },
        toggleShowMoreMsg() {
            this.showMore = !this.showMore
        }
    },
    watch: {
        bondEditableInfo() {
            if (this.bondEditableInfo.productOverview) {
                this.handleSelectProtocolInfo(
                    this.bondEditableInfo.productOverview,
                    'product'
                )
            }
            if (this.bondEditableInfo.raiseManual) {
                this.handleSelectProtocolInfo(
                    this.bondEditableInfo.raiseManual,
                    'raise'
                )
            }
        }
    }
}
