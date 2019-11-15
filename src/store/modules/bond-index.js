import { getAppType } from '@/utils/html-utils'

export default {
    namespaced: true,
    state: {
        appType: getAppType() - 0 || 1
    },
    mutations: {},
    actions: {},
    getters: {}
}
