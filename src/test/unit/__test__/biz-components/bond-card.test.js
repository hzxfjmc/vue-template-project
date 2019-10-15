import { shallowMount } from '@vue/test-utils'
import bondCard from '@/biz-components/bond-card/index.vue'
describe('bond-card', () => {
    it('is a vue ins', () => {
        const wrapper = shallowMount(bondCard)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
    it('props', () => {
        const wrapper = shallowMount(bondCard, {
            propsData: {
                bondInfo: 0
            }
        })
        console.log('wrapper.props() :', wrapper.props())
        expect(wrapper.props().bondInfo).toBe(0)
    })
})
