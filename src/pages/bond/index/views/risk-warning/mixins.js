import { Panel, Checkbox } from 'vant'
import YxContainerBetter from '@/components/yx-container-better'
import { bondRiskAutograph, getCurrentUser } from '@/service/user-server.js'
import { selectProtocolInfo } from '@/service/config-manager.js'
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage.js'
export default {
    name: 'RiskWarning',
    i18n: {
        zhCHS: {
            riskWarning: '债券购买风险提示',
            riskTipsList: [
                '1）由于企业违约等XXXXXXX可能，债券可能违约，损失部分或全部本金和利息.XXXXXX',
                '2）债券市场流动性差，友信提供流动性XXXXXXXX，价格点差XXXX。友信尽力撮合订单，但不保证订单一定能够成交。',
                '3）成交价格公司可能有损益。'
            ],
            signature: '确认签名',
            pleaseEnter: '请输入签名: ',
            bondRisk1: '我已阅读并知晓债券购买风险提示，及 ',
            bondRisk2:
                '中有关债券交易、场外交易、及在香港以外地方收取或持有的客户资产的相关条款及风险；本人电子签名代表对上述说明的同意，与本人手写签名具有相同的法律效力',
            confirm: '确认'
        },
        zhCHT: {
            riskWarning: '債券購買風險提示',
            riskTipsList: [
                '1）由于企业违约等XXXXXXX可能，债券可能违约，损失部分或全部本金和利息.XXXXXX',
                '2）债券市场流动性差，友信提供流动性XXXXXXXX，价格点差XXXX。友信尽力撮合订单，但不保证订单一定能够成交。',
                '3）成交价格公司可能有损益。'
            ],
            signature: '確認簽名',
            pleaseEnter: '請輸入簽名: ',
            bondRisk1: '我已閱讀並知曉債券購買風險提示，及 ',
            bondRisk2:
                '中有關債券交易、場外交易、及在香港以外地方收取或持有的客戶資產的相關條款及風險；本人電子簽名代表對上述說明的同意，與本人手寫簽名具有相同的法律效力',
            confirm: '確認'
        },
        en: {
            riskWarning: 'Risk warning of trading bonds',
            riskTipsList: [
                '1）由于企业违约等XXXXXXX可能，债券可能违约，损失部分或全部本金和利息.XXXXXX',
                '2）债券市场流动性差，友信提供流动性XXXXXXXX，价格点差XXXX。友信尽力撮合订单，但不保证订单一定能够成交。',
                '3）成交价格公司可能有损益。'
            ],
            signature: 'Signature',
            pleaseEnter: 'Please enter: ',
            bondRisk1:
                'I have read and are aware of related risks of trading bonds. I have read ',
            bondRisk2:
                '. My electronic signature, which has the same legal effect as my handwritten signature, indicate my consent to above content.',
            confirm: 'Confirm'
        }
    },
    components: {
        [Checkbox.name]: Checkbox,
        [Panel.name]: Panel,
        YxContainerBetter
    },
    async created() {
        this.id = this.$route.query.id - 0
        this.bondName = this.$route.query.bondName

        // 获取用户签名信息
        this.handleGetCurrentUser()

        // 拉取债券协议
        try {
            let data = await selectProtocolInfo('AGR001')
            this.agreementData = data || {}
            console.log('selectProtocolInfo:data:>>> ', data)
        } catch (e) {
            console.log('selectProtocolInfo:error:>>>', e)
        }
    },
    data() {
        return {
            signName: LS.get('signName') || '', // 签名
            agreementData: {}, // 债券协议
            id: 0,
            bondName: '',
            userAutograph: '',
            isReadBondInfo: true
        }
    },
    computed: {
        ...mapGetters(['appType']),
        prev() {
            return this.appType.Hk ? '/hk' : ''
        },
        // 签名占位符
        signNamePlaceholder() {
            return (
                (this.userAutograph &&
                    `${this.$t('pleaseEnter')}${this.userAutograph}`) ||
                this.$t('pleaseEnter')
            )
        },
        submitBtnDisabled() {
            if (this.signName && this.isReadBondInfo) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        // 提交债券风险签名
        async handleSubmitAutograph() {
            if (this.submitBtnDisabled) return

            try {
                let data = await bondRiskAutograph({
                    agreementName: this.agreementData.protocolName,
                    agreementUrl: this.agreementData.protocolUrl,
                    autograph: this.signName,
                    bondId: this.id,
                    bondName: this.bondName,
                    riskTips: this.$t('riskTipsList').join(',')
                })
                // 签名成功，本地设置标记，用与返回时候保留签名，刷新则清除
                LS.put('signName', this.signName)

                this.$router.push({
                    path: this.prev + '/risk-appropriate-result',
                    query: {
                        id: this.id,
                        bondName: this.bondName,
                        direction: this.$route.query.direction
                    }
                })
                console.log('bondRiskAutograph:data:>>> ', data)
            } catch (e) {
                console.log('bondRiskAutograph:error:>>> ', e)
                this.$dialog.alert({
                    message: e.msg || '请求失败'
                })
            }
        },
        //获取用户信息
        async handleGetCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userAutograph = res.userAutograph || ''
                console.log('getCurrentUser>>>data :', res)
            } catch (e) {
                console.log('getCurrentUser:error:>>>', e)
            }
        },
        // 失焦事件
        handleBlur() {
            // alert(1)
            // iOS中，输入法输入时，不切确选择某个词，输入框还保持选择状态
            // 这时候手指滑动界面，输入键盘回收，但是界面还处于上移状态
            // 初步调试，发现是 utils/common/index.js 最后的处理函数。在上面场景中 focus 事件
            // 先执行，导致 focusFlag 为 true，进而 延迟函数内部滚动逻辑不执行
            // 所以现在在当前页面进行处理
            setTimeout(() => {
                // alert(3)
                document.body.scrollTop = document.body.scrollHeight
                // 兼容 iOS 输入框失焦后，整体不下移动bug
                document.documentElement.scrollTop =
                    document.documentElement.scrollHeight
                // window.scrollTo(0, 1000)
            }, 300)
        }
    }
}
