import { shallowMount } from '@vue/test-utils'
import bondIndex from '@/pages/bond/index/views/index/index.vue'
describe('test', () => {
    it('is a vue ins', () => {
        const wrapper = shallowMount(bondIndex)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})
