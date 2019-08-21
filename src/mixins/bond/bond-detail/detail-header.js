import { Row, Col } from 'vant'
import MediaBox from '@/biz-components/media-box/index.vue'
import ColMsg from '@/biz-components/col-msg/index.vue'
import { calcCountDownDay } from '@/utils/tools.js'
export default {
    name: 'DetailHeader',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        MediaBox,
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
        },
        currentPrice: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            featureThumbMedal: require('@/assets/img/bond/icon-medal.png'),
            featureThumbMoney: require('@/assets/img/bond/icon-money.png'),
            wrapperStyle: {
                flex: '0 0 auto'
            },
            titleStyle: {
                color: '#fff',
                'font-size': '0.4rem',
                'line-height': '0.52rem'
            },
            descStyle: {
                'margin-top': '0.04rem',
                color: 'rgba(255, 255, 255, 0.6)',
                'font-size': '0.24rem',
                'line-height': '0.34rem'
            }
        }
    },
    computed: {
        // 发行人
        headerTitle() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.name) ||
                '--'
            )
        },
        // 债券名称
        headerDesc() {
            return this.bondEditableInfo && this.bondEditableInfo.nameCn
        },
        colData() {
            let _this = this
            let obj = [
                {
                    title:
                        (this.currentPrice &&
                            this.currentPrice &&
                            this.currentPrice.buyYtm &&
                            (this.currentPrice.buyYtm - 0).toFixed(3) + '%') ||
                        '--',
                    desc: '到期年化收益率',
                    click: () => {
                        this.$dialog.alert({
                            message: `到期收益率指按买入价格买入债券并持有到期，获得的全部利息和本金计算而来的年平均收益率。\n
到期收益率综合考虑了购买价格、持有期限、票面利率等因素，是非常重要的参考要素。\n
注：展示数值为已加入预估佣金、平台使用费之后的到期收益率。`,
                            messageAlign: 'left',
                            confirmButtonText: '我知道了'
                        })
                    }
                },
                {
                    title: calcCountDownDay(
                        _this.bondUneditableInfo &&
                            _this.bondUneditableInfo.dueTime
                    ),
                    desc: '剩余期限'
                },
                {
                    title:
                        (this.bondUneditableInfo &&
                            this.bondUneditableInfo.minFaceValue &&
                            (this.bondUneditableInfo.minFaceValue - 0).toFixed(
                                3
                            )) ||
                        '--',
                    desc:
                        '起购金额(' +
                        ((this.bondUneditableInfo &&
                            this.bondUneditableInfo.enumCurrency &&
                            this.bondUneditableInfo.enumCurrency.name) ||
                            '美元') +
                        '/份)'
                }
            ]
            return obj
        }
    }
}
