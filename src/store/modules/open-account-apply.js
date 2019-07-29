import accountService from '@/service/user-account-server.js'
import LS from '@/utils/local-storage.js'

export default {
    namespaced: true,
    state: {
        initState: {
            ca: {
                certSN: '',
                certDN: '',
                privateKeyPem: '',
                errorSubmit: false,
                pending: false
            }
        },
        basicInfo: {
            realName: '',
            gender: '',
            infoEditStatus: 0
        },
        userId: 0,
        rejectReason: {
            // 开户审核驳回信息
            approvalOpinion: {},
            // 网上核实驳回信息
            identityOpinion: {}
        },
        // home页的视图
        currentView: 'home'
    },
    mutations: {
        getOpenAccountStatusMu(state, data) {
            state.accountStatus = data
        },
        setBasicInfo(state, basicInfo) {
            state.basicInfo = { ...state.basicInfo, ...basicInfo }
        },
        initMutation(state, initState) {
            state.initState = { ...state.initState, ...initState }
            LS.put(`${state.userId}-initState`, state.initState)
        },
        userIdMutation(state, userId) {
            state.userId = userId
        },
        setApprovalOpinion(state, data) {
            state.rejectReason.approvalOpinion = data
            LS.put(`${state.userId}-approvalOpinion`, data)
        },
        setIdentityOpinion(state, data) {
            state.rejectReason.identityOpinion = data
            LS.put(`${state.userId}-identityOpinion`, data)
        },
        setCurrentView(state, v) {
            state.currentView = v
        }
    },
    actions: {
        async getOpenAccountBasicInfo({ commit }) {
            try {
                let basicInfo = await accountService.getOpenAccountBasicInfo()
                commit('setBasicInfo', basicInfo)
            } catch (e) {
                commit('setBasicInfo', {
                    realName: '',
                    gender: '',
                    infoEditStatus: 0
                })
            }
        },
        async getOpenAccountStatus({ commit }) {
            try {
                await accountService.getOpenAccountStatus()
                commit('getOpenAccountStatusMu', true)
            } catch (e) {
                commit('getOpenAccountStatusMu', false)
            }
        },
        async initRejectReason(store) {
            let userId = store.rootGetters.user.userId
            if (userId) {
                let approvalOpinion = LS.get(`${userId}-approvalOpinion`) || {}
                let identityOpinion = LS.get(`${userId}-identityOpinion`) || {}
                store.commit('setApprovalOpinion', approvalOpinion)
                store.commit('setIdentityOpinion', identityOpinion)
            }
        },
        async initApplyAction(store) {
            try {
                await store.dispatch('initAction', null, { root: true })
                store.rootGetters.isLogin &&
                    (await store.dispatch('getOpenAccountBasicInfo'))
                // 数据持久化
                let userId = store.rootGetters.user.userId
                store.commit('userIdMutation', userId)
                if (userId) {
                    let initState = LS.get(`${userId}-initState`) || {}
                    store.commit('initMutation', initState)
                }
            } catch (e) {
                throw e
            }
        },
        setCurrentView(store, v) {
            store.commit('setCurrentView', v)
        }
    },
    getters: {
        approvalOpinion: state => state.rejectReason.approvalOpinion,
        identityOpinion: state => state.rejectReason.identityOpinion,
        basicInfo: state => state.basicInfo,
        initState: state => state.initState,
        infoEditStatus: state => state.basicInfo.infoEditStatus,
        routerStatus: state => {
            let infoStatus = state.basicInfo.infoEditStatus
            let sum = 1
            let map = {}
            for (let i = 1; i <= 8; i++) {
                // 当前完成第几位
                map[i] = (infoStatus & sum) !== 0
                sum *= 2
            }
            return map
        },
        stepStatus: state => {
            let infoStatus = state.basicInfo.infoEditStatus
            let sum = 1
            for (let i = 1; i <= 8; i++) {
                // 当前完成第几位
                if ((infoStatus & sum) === 0) {
                    return i
                }
                sum *= 2
            }
            return 0
        },
        currentView: state => state.currentView
    }
}
