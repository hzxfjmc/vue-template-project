import { Row, Col } from 'vant'
import { handleSelectProtocolInfo } from '@/pages/bond/index/tools'
import { calcCountDownDay, dateFormat } from '@/utils/tools.js'
import ColMsg from '@/biz-components/col-msg/index.vue'
import { isYouxinAndroid } from '@/utils/html-utils'
import jsBridge from '@/utils/js-bridge'
export default {
    name: 'BondInfo',
    i18n: {
        zhCHS: {
            bondOverview: '产品概览书',
            prospectus: '募集说明书',
            issuerName: '债券发行人',
            couponRate: '票面利率',
            paymentDate: '付息日',
            issueTime: '首次付息日',
            dueTime: '到期时间',
            dueDay: '剩余期限',
            infoYear: '年',
            infoDay: '天',
            paymentTypeName: '付息类型',
            paymentFrequencyName: '付息频率',
            creditRatingAgency: '债券评级(标普)',
            issuerRankAgency: '发行人评级(标普)'
        },
        zhCHT: {
            bondOverview: '產品概覽書',
            prospectus: '募集說明書',
            issuerName: '債券發行人',
            couponRate: '票面利率',
            paymentDate: '付息日',
            issueTime: '首次付息日',
            dueTime: '到期時間',
            dueDay: '剩余期限',
            infoYear: '年',
            infoDay: '天',
            paymentTypeName: '付息類型',
            paymentFrequencyName: '付息頻率',
            creditRatingAgency: ' 債券評級(標普)',
            issuerRankAgency: '發行人評級(標普)'
        },
        en: {
            bondOverview: 'Overview',
            prospectus: 'Prospectus',
            issuerName: 'Bond Issuer',
            couponRate: 'Annual Coupon Rate',
            paymentDate: 'Interest Payment Date',
            issueTime: 'start Payment Date',
            dueTime: 'Maturity Date',
            dueDay: 'Time to Maturity',
            infoYear: 'Y ',
            infoDay: 'D',
            paymentTypeName: 'Coupon Type',
            paymentFrequencyName: 'Coupon Frequency',
            creditRatingAgency: 'Credit Rating(S&P)',
            issuerRankAgency: 'Bond Issuer Rating(S&P)'
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
            // 有则展示，没有也增加空的，用来保持布局
            // 如果有发行人评级 没有则不展示
            // 如果有债券评级 没有则不展示
            // creditRatingRank
            if (this.issuerRank) {
                obj[1].push({
                    title: this.issuerRank,
                    desc: `${this.$t('issuerRankAgency')}`
                })
                if (this.creditRatingRank) {
                    obj[2] = [
                        {
                            title: this.creditRatingRank,
                            desc: `${this.$t('creditRatingAgency')}`
                        },
                        {
                            title: '',
                            desc: ''
                        },
                        {
                            title: '',
                            desc: ''
                        }
                    ]
                }
            } else {
                if (this.creditRatingRank) {
                    obj[1].push({
                        title: this.creditRatingRank,
                        desc: `${this.$t('creditRatingAgency')}`
                    })
                } else {
                    obj[1].push({
                        title: '',
                        desc: ''
                    })
                }
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
                .replace(/年/g, this.$t('infoYear'))
                .replace(/天/g, this.$t('infoDay'))
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
        issuerRank() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.rankInfo &&
                    this.bondEditableInfo.issuer.rankInfo.rank) ||
                ''
            )
        },
        // 债券评级
        creditRatingRank() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.creditRating &&
                    this.bondEditableInfo.creditRating.rank) ||
                ''
            )
        }
    },
    methods: {
        // 跳转pdf ios 部分使用原生 href 跳转不了
        jumpPdf(url) {
            // 安卓不能新开 webview，会跳出 webview下载pdf，导致新开的 webview 页面空白
            if (isYouxinAndroid) {
                window.location.href = url
            } else {
                // ios 可以直接打开 pdf，但是会影响 查看股票按钮的逻辑显示，所以要新开
                jsBridge.gotoNewWebview(url)
            }
        },
        toggleShowMoreMsg() {
            this.showMore = !this.showMore
        }
    },
    watch: {
        // 获取 产品概览、募集说明书
        bondEditableInfo() {
            if (this.bondEditableInfo.productOverview) {
                handleSelectProtocolInfo(
                    this.bondEditableInfo.productOverview,
                    res => {
                        this.productOverview = (res && res.protocolUrl) || ''
                    }
                )
            }
            if (this.bondEditableInfo.raiseManual) {
                handleSelectProtocolInfo(
                    this.bondEditableInfo.raiseManual,
                    res => {
                        this.raiseManual = (res && res.protocolUrl) || ''
                    }
                )
            }
        }
    }
}
