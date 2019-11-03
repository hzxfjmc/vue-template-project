import store from '@/store'
import actions from '@/store/actions'

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
        // 此处本来不应该测试 state 的变化，本来需要测试的是 commit 了某个函数，是否执行以及携带了正确的参数
        // 但是按照目前的 store 构造格式，以下测试方法行不通，因为 commit 被内置传入了，我们调用的时候传入的是无效的
        // 正确测试方式应该是这样
        let commit = jest.fn()
        actions.getUserInfoAction({ commit }, 'h5').then(() => {
            expect(commit).toHaveBeenCalledWith('getUserInfoMutation', {
                uuid: 1,
                userId: 1
            })
        })
    })
})
