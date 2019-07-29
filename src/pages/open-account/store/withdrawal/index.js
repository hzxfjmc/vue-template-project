import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
import LS from '@/utils/local-storage.js'
export default {
    namespaced: true,
    state: {
        hkOpenAccountInfo: {}
    },
    mutations: {
        hkOpenAccountInfo: (state, hkOpenAccountInfo) => {
            state.hkOpenAccountInfo = hkOpenAccountInfo
            LS.put(`withdrawal/hkOpenAccountInfo`, hkOpenAccountInfo)
        }
    },
    actions: {
        async initWithdrawalAction(context) {
            if (isNaN(context.getters.verifyType)) {
                let data = await getHKOpenAccountInfo()
                context.commit('hkOpenAccountInfo', data)
            }
        }
    },
    getters: {
        verifyType: state => state.hkOpenAccountInfo.verifyType
    }
}
