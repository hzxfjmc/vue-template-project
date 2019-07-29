import Vue from 'vue'
import Vuex from 'vuex'
import LS from '@/utils/local-storage.js'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userInfo: {
            userToken: '',
            uuid: ''
        }
    },
    mutations: {
        userInfo: (state, data) => {
            state.userInfo = { ...state.userInfo, ...data }
            LS.put('userInfo', state.userInfo)
        }
    },
    actions: {
        setUserInfo({ commit }, userInfo) {
            commit('userInfo', userInfo)
        },
        initDepositAction({ commit }) {
            let userInfo = LS.get('userInfo') || {}
            userInfo.userToken && commit('userInfo', userInfo)
        }
    },
    getters: {
        userInfo: state => state.userInfo
    }
})
export default store
