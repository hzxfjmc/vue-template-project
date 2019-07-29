import userAccountServer from '@/service/user-account-server.js'
import LS from '@/utils/local-storage.js'
export default {
    namespaced: true,
    state: {
        accountType: '', // 入金银行账户类型1-港币 2-美元账户 9-综合账户
        currency: '', // 币种：0-人民币;1-美元;2-港币
        bankAttribute: '', // 银行归属地：1-香港银行卡 2-大陆银行卡
        transferMethod: '', // 入金方式：1-汇款 2-fps 3-跨境汇款
        baseInfo: {} // 用户基本信息
    },
    mutations: {
        accountType: (state, accountType) => {
            state.accountType = accountType
            LS.put(`deposit/accountType`, accountType)
        },
        currency: (state, currency) => {
            state.currency = currency
            LS.put(`deposit/currency`, currency)
        },
        bankAttribute: (state, bankAttribute) => {
            state.bankAttribute = bankAttribute
            LS.put(`deposit/bankAttribute`, bankAttribute)
        },
        transferMethod: (state, transferMethod) => {
            state.transferMethod = transferMethod
            LS.put(`deposit/transferMethod`, transferMethod)
        },
        baseInfo: (state, baseInfo) => {
            state.baseInfo = baseInfo
            LS.put(`deposit/baseInfo`, baseInfo)
        }
    },
    actions: {
        setAccountType({ commit }, accountType) {
            commit('accountType', accountType)
        },
        setCurrency({ commit }, currency) {
            commit('currency', currency)
        },
        setBankAttribute({ commit }, bankAttribute) {
            commit('bankAttribute', bankAttribute)
        },
        setTransferMethod({ commit }, transferMethod) {
            commit('transferMethod', transferMethod)
        },
        async getOpenAccountBasicInfo({ commit }) {
            let data = await userAccountServer.getOpenAccountBasicInfo()
            commit('baseInfo', data)
        },
        initDepositAction({ commit }) {
            let accountType = LS.get('deposit/accountType') || ''
            let currency = LS.get('deposit/currency') || ''
            let bankAttribute = LS.get('deposit/bankAttribute') || ''
            let transferMethod = LS.get('deposit/transferMethod') || ''
            let baseInfo = LS.get('deposit/baseInfo') || {}
            accountType && commit('accountType', accountType)
            currency && commit('currency', currency)
            bankAttribute && commit('bankAttribute', bankAttribute)
            transferMethod && commit('transferMethod', transferMethod)
            baseInfo && commit('baseInfo', baseInfo)
        }
    },
    getters: {
        currency: state => state.currency,
        bankAttribute: state => state.bankAttribute,
        transferMethod: state => state.transferMethod,
        accountType: state => state.accountType,
        baseInfo: state => state.baseInfo
    }
}
