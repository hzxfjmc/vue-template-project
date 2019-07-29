import LS from '@/utils/local-storage.js'
import accountService from '@/service/user-account-server.js'
export default {
    namespaced: true,
    state: {
        conversionForm: {
            stockInfo: []
        },
        basicInfo: {
            lastName: '',
            firstName: ''
        }
    },
    mutations: {
        updateForm(state, conversionForm) {
            state.conversionForm = {
                ...state.conversionForm,
                ...conversionForm
            }
            LS.put('conversion/form', state.conversionForm)
        },
        initBasicInfo(state, data) {
            state.basicInfo = { ...state.basicInfo, ...data }
        }
    },
    actions: {
        async initState({ commit }) {
            commit('updateForm', LS.get('conversion/form'))
            let data = await accountService.getOpenAccountBasicInfo()
            commit('initBasicInfo', data)
        }
    },
    getters: {
        curName: state => {
            if (state.basicInfo.lastName) {
                return (
                    state.basicInfo.lastName + ' ' + state.basicInfo.firstName
                )
            }
            return state.basicInfo.realNameEn
        }
    }
}
