import Vue from 'vue'
import Vuex from 'vuex'
import LS from '@/utils/local-storage.js'

Vue.use(Vuex)

export default modules =>
    new Vuex.Store({
        modules,
        state: {
            user: {}
        },
        mutations: {
            getUserInfoMutation(state, data) {
                state.user = { ...state.user, ...data }
            }
        },
        actions: {
            async initAction(store) {
                store.commit('getUserInfoMutation', {
                    userToken: LS.get('userToken')
                })
            }
        },
        getters: {
            isLogin: state => !!state.user.userToken
        }
    })
