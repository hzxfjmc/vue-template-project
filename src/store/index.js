import Vue from 'vue'
import Vuex from 'vuex'
import {
    isYouxinIos,
    isYouxinAndroid,
    isYouxinApp,
    appType,
    lang
} from '@/utils/html-utils'

import actions from './actions'

Vue.use(Vuex)

export default modules =>
    new Vuex.Store({
        modules,
        state: {
            user: {},
            accountStatus: false // 是否开户
        },
        mutations: {
            getUserInfoMutation(state, data) {
                state.user = { ...state.user, ...data }
            }
        },
        actions,
        getters: {
            user: state => state.user,
            phoneNumber: state => state.user.phoneNumber,
            isLogin: state => !!state.user.userToken, // 有token 代表登录了
            isYouxinIos: () => isYouxinIos,
            isYouxinAndroid: () => isYouxinAndroid,
            isYouxinApp: () => isYouxinApp,
            appType: () => appType,
            lang: () => lang // ['1', 'zhCHS'](简体), ['2', 'zhCHT']（繁体）, ['3', 'en']
        }
    })
