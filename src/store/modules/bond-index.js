import config from '@/pages/market/0-config'
console.log('config', config)
export default {
    namespaced: true,
    state: {
        // 当前语言环境
        lang: 'zhCHS'
    },
    mutations: {
        setLang(state) {
            state.lang = config.lang
        }
    },
    actions: {},
    getters: {}
}
