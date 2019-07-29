import Vue from 'vue'
import Vuex from 'vuex'
import jsBridge from '@/utils/js-bridge.js'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
import userService from '@/service/user-server.js'
import { isYouxinIos, isYouxinAndroid, isYouxinApp } from '@/utils/html-utils'

Vue.use(Vuex)

export default modules =>
    new Vuex.Store({
        modules,
        state: {
            user: {},
            openedAccount: false, // 是否开户
            // 是否是大陆用户
            isChUser: true,
            // 是否是初始状态（数据未请求到）
            isInit: true
        },
        mutations: {
            getUserInfoMutation(state, data) {
                state.user = { ...state.user, ...data }
            },
            openAccountAction(state, data) {
                state.openedAccount = data
            },
            setUserAttribution(state, data) {
                state.isChUser = data
            },
            setIsInit(state, data) {
                state.isInit = data
            }
        },
        actions: {
            async loginCommonAction(store) {
                try {
                    let user
                    if (!store.getters.isLogin) {
                        user = await jsBridge.callApp('command_user_login')
                        setToken(user.userToken)
                        store.commit('getUserInfoMutation', {
                            phoneNumber: user.phoneNum,
                            userId: user.userId,
                            userToken: user.userToken,
                            userName: user.userName
                        })
                    }
                    if (!store.getters.phoneNumber) {
                        user = await jsBridge.callApp(
                            'command_bind_mobile_phone'
                        )
                        store.commit('getUserInfoMutation', {
                            phoneNumber: user.phoneNum,
                            userId: user.userId,
                            userToken: user.userToken,
                            userName: user.userName
                        })
                    }
                } catch (e) {
                    throw e
                }
            },
            async getUserInfoAction({ commit }) {
                try {
                    // alert(2)
                    // alert(LS.get('userToken'))
                    let data = await userService.getCurrentUser()
                    data.userId = data.uuidStr || data.userId
                    commit('getUserInfoMutation', data)
                } catch (e) {
                    throw e
                }
            },
            async initAction(store) {
                try {
                    let userToken = LS.get('userToken')
                    if (isYouxinApp) {
                        // 如果是app进入页面的时候获取用户信息
                        let data = await jsBridge.callApp('get_user_info')
                        let user = data || {}
                        userToken = user.userToken
                        LS.put('userToken', user.userToken) // 保存信息到LocalStorage
                        setToken(userToken)
                        store.commit('getUserInfoMutation', {
                            phoneNumber: user.phoneNum,
                            userId: user.userId,
                            userToken: user.userToken,
                            userName: user.userName
                        })
                        store.commit('openAccountAction', data.openedAccount)
                        // alert(1)
                        // alert(LS.get('userToken'))
                        userToken && (await store.dispatch('getUserInfoAction'))
                    } else {
                        store.commit('getUserInfoMutation', {
                            userToken: LS.get('userToken')
                        })
                        userToken && (await store.dispatch('getUserInfoAction'))
                    }
                } catch (e) {
                    LS.remove('userToken')
                    store.commit('getUserInfoMutation', {
                        phoneNumber: '',
                        userId: '',
                        userToken: '',
                        userName: ''
                    })
                    throw e
                }
            },
            setIsChUser({ commit }, data) {
                commit('setUserAttribution', data)
            },
            setIsInit({ commit }, data) {
                commit('setIsInit', data)
            }
        },
        getters: {
            user: state =>
                Object.assign(state.user, {
                    openedAccount: state.openedAccount
                }),
            phoneNumber: state => state.user.phoneNumber,
            isLogin: state => !!state.user.userToken, // 有token 代表登录了
            isYouxinIos: () => isYouxinIos,
            isYouxinAndroid: () => isYouxinAndroid,
            isYouxinApp: () => isYouxinApp,
            isChUser: state => state.isChUser,
            isInit: state => state.isInit
        }
    })
