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
            riskTipsTitle: '债劵购买风险提示',
            riskTipsList: [
                '1) 由於企業違約等XXXXXXX可能，債券可能違約，損失部分或全部本金和利息.XXXXXX',
                '2) 債券市場流動性差，友信提供流動性XXXXXXXX，價格點差XXXX。友信盡力撮合訂單，但不保證訂單一定能夠成交。',
                '3) 成交價格公司可能有損益。'
            ]
        },
        zhCHT: {
            riskTipsTitle: '債劵購買風險提示',
            riskTipsList: [
                '1）由于企业违约等XXXXXXX可能，债券可能违约，损失部分或全部本金和利息.XXXXXX',
                '2）债券市场流动性差，友信提供流动性XXXXXXXX，价格点差XXXX。友信尽力撮合订单，但不保证订单一定能够成交。',
                '3）成交价格公司可能有损益。'
            ]
        },
        en: {
            riskTipsTitle: '债劵购买风险提示'
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
            let data = await selectProtocolInfo('BOND001')
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
                (this.userAutograph && `请输入签名: ${this.userAutograph}`) ||
                '请输入签名:'
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
                    riskTips: `为了降低您的投资风险，请您完整阅读风险披露内容
                                正文：CFD 是不适合各类投资者的复杂产品，因此您应该始终确保您了解您所购买的产品是如何运作的，它是否能够满足您的需求，您是否能在亏损时拥有头寸以承担损失。
                                在做出交易决定之前，您应仔细阅读这些条款和产品说明。
                                在交易 CFD 之前，您务必确信了解所涉及的风险。您是否能在亏损时拥有头寸以承担损失。
                            `
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
            // iOS中，输入法输入时，不切确选择某个词，输入框还保持选择状态
            // 这时候手指滑动界面，输入键盘回收，但是界面还处于上移状态
            // 初步调试，发现是 utils/common/index.js 最后的处理函数。在上面场景中 focus 事件
            // 先执行，导致 focusFlag 为 true，进而 延迟函数内部滚动逻辑不执行
            // 所以现在在当前页面进行处理
            setTimeout(() => {
                document.body.scrollTop = document.body.scrollHeight
            }, 300)
        }
    }
}
