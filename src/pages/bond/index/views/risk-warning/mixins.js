import { Panel, Checkbox } from 'vant'
import YxContainerBetter from '@/components/yx-container-better'
import { bondRiskAutograph, getCurrentUser } from '@/service/user-server.js'
import { selectProtocolInfo } from '@/service/config-manager.js'
import { openBondFeePackage } from '@/service/finance-server'
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage.js'
export default {
    name: 'RiskWarning',
    i18n: {
        zhCHS: {
            riskWarning: '债券购买风险提示',
            riskTipsList: [
                '友信证券在债券买卖中担任客户的代理',
                '债券买卖为场外交易，友信证券并不保证此等交易之结算',
                '客户进行场外交易须承受交易对手的信用及违约风险，并承担其违约所招致的损失及开支',
                '场外交易的债券一般在香港以外地方收取或持有，所受的监管和保障也可能与在香港收取或持有的客户资产不同',
                '场外交易不获投资者赔偿基金保障',
                '其他买卖债券的风险包括发行商失责、利率风险、汇率风险、流通量风险、再投资风险等'
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
                '友信證券在債券買賣中擔任客戶的代理',
                '債券買賣為場外交易，友信證券並不保證此等交易之結算',
                '客戶進行場外交易須承受交易對手的信用及違約風險，並承擔其違約所招致的損失及開支',
                '場外交易的債券一般在香港以外地方收取或持有，所受的監管和保障也可能與在香港收取或持有的客戶資產不同',
                '場外交易不獲投資者賠償基金保障',
                '其他買賣債券的風險包括發行商失責、利率風險、匯率風險、流通量風險、再投資風險等'
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
                'uSmart Securities Limited (“USL”) is acting as agent for the client in trading bonds',
                'Trading bonds are over-the-counter (“OTC”) transactions, and USL does not guarantee the settlement of such OTC transactions',
                'The client who conduct OTC transactions shall be subject to the credit and default risks of counterparties, and bear its own losses and expenses resulting from their defaults',
                'OTC traded bonds will usually be received or held outside Hong Kong, and the applicable regulation and protection may also be different from that conferred on the Client’s Assets received or held in Hong Kong',
                'OTC transactions are not covered by the Investor Compensation Fund',
                'Other risks of trading bonds include issuer default risk, interest rate risk, foreign exchange risk, liquidity risk, reinvestment risk, etc'
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
                this.$loading()
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

                // 开通用户债券佣金套餐,不关心是否开通，发起请求即可，后面会在产品适当性匹配页面再次判断
                openBondFeePackage()

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
            } finally {
                this.$close()
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
