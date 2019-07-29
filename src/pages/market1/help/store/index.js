import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        langType: ''
    },
    mutations: {
        getLangType(state, langType) {
            state.langType = langType
        }
    },
    actions: {
        async langTypeAction(store, langType) {
            store.commit('getLangType', langType)
        }
    },
    getters: {
        langType: state => state.langType
    }
})
