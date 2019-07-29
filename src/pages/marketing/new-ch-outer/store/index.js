import Vue from 'vue'
import Vuex from 'vuex'
import LS from '@/utils/local-storage.js'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userInfo: {
            userToken: '',
            inviteCode: ' ',
            uuid: ''
        },
        activityId: '' //活动id
    },
    mutations: {
        userInfo: (state, data) => {
            state.userInfo = { ...state.userInfo, ...data }
            LS.put('userInfo', state.userInfo)
        },
        activityId: (state, activityId) => {
            state.activityId = activityId
            LS.put('activityId', activityId)
        }
    },
    actions: {
        setUserInfo({ commit }, userInfo) {
            commit('userInfo', userInfo)
        },
        setActivityId({ commit }, activityId) {
            commit('activityId', activityId)
        },
        initDepositAction({ commit }) {
            let userInfo = LS.get('userInfo') || {}
            let activityId = LS.get('activityId') || ''
            userInfo.inviteCode && commit('userInfo', userInfo)
            activityId && commit('activityId', activityId)
        }
    },
    getters: {
        userInfo: state => state.userInfo,
        activityId: state => state.activityId
    }
})
export default store
