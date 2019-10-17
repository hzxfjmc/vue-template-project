import store from '@/store'

// 模拟 api 全局变量 需要在头部引入
// 不能在 beforeAll describe beforeEach it 等钩子里面
// 否则不生效
jest.mock('@/service/user-server.js', () => ({
    getCurrentUser: () => {
        return new Promise(resolve => {
            resolve({
                uuid: 1
            })
        })
    }
}))
describe('store', () => {
    it('mutations', () => {
        let { commit, state } = store()
        commit('getUserInfoMutation', { test: 1 })
        expect(state).toEqual({
            user: {
                test: 1
            },
            accountStatus: false
        })
    })

    it('actions', async () => {
        let { _actions } = store()
        let commit = jest.fn()
        // console.log('action', _actions.getUserInfoAction[0]())
        await _actions.getUserInfoAction[0]({ commit })
        // dispatch('getUserInfoAction').then(() => {
        //     expect(state.user.userId).toBe(1)
        //     expect(state.user.uuid).toBe(1)
        //     done()
        // })
        expect(commit).toHaveBeenCalledWith('getUserInfoMutation', {
            uuid: 1,
            userId: 1
        })
    })
})
