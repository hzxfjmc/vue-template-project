import { Panel, Checkbox } from 'vant'
import FixedOperateBtn from '@/biz-components/fix-operate-button/index.vue'
import { bondRiskAutograph } from '@/service/user-server.js'
import { selectProtocolInfo } from '@/service/config-manager.js'
import LS from '@/utils/local-storage.js'
import { mapState } from 'vuex'
export default {
    name: 'RiskWarning',
    components: {
        [Checkbox.name]: Checkbox,
        [Panel.name]: Panel,
        FixedOperateBtn
    },
    async created() {
        this.id = this.$route.query.id - 0
        this.bondName = this.$route.query.bondName
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
            isReadBondInfo: true
        }
    },
    computed: {
        ...mapState(['user']),
        // 签名占位符
        signNamePlaceholder() {
            return (
                (this.user &&
                    this.user.userAutograph &&
                    '请输入签名:' + this.user.userAutograph) ||
                '请输入签名'
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
                    path: '/risk-appropriate-result',
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
        }
    }
}
