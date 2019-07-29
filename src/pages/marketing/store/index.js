import Vue from 'vue'
import Vuex from 'vuex'
import LS from '@/utils/local-storage.js'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userInfo: {
            inviteName: '', //邀请人昵称
            inviteCode: '', //邀请码
            uuid: '',
            userToken: ''
        },
        activityId: '', //活动id
        channelType: '', //渠道类型
        channelId: '' //渠道id
    },
    mutations: {
        userInfo: (state, data) => {
            state.userInfo = { ...state.userInfo, ...data }
            LS.put('userInfo', state.userInfo)
        },
        activityId: (state, activityId) => {
            state.activityId = activityId
            LS.put('activityId', activityId)
        },
        channelType: (state, channelType) => {
            state.channelType = channelType
            LS.put('channelType', channelType)
        },
        channelId: (state, channelId) => {
            state.channelId = channelId
            LS.put('channelId', channelId)
        }
    },
    actions: {
        setUserInfo({ commit }, userInfo) {
            commit('userInfo', userInfo)
        },
        setActivityId({ commit }, activityId) {
            commit('activityId', activityId)
        },
        setChannelType({ commit }, channelType) {
            commit('channelType', channelType)
        },
        setChannelId({ commit }, channelId) {
            commit('channelId', channelId)
        },
        initDepositAction({ commit }) {
            let userInfo = LS.get('userInfo') || {}
            let activityId = LS.get('activityId') || ''
            let channelType = LS.get('channelType') || ''
            let channelId = LS.get('channelId') || ''
            commit('userInfo', userInfo)
            activityId && commit('activityId', activityId)
            channelType && commit('channelType', channelType)
            channelId && commit('channelId', channelId)
        }
    },
    getters: {
        userInfo: state => state.userInfo,
        activityId: state => state.activityId,
        channelType: state => state.channelType,
        channelId: state => state.channelId
    }
})
export default store
