import { mount } from '@vue/test-utils'
import bondCard from '@/biz-components/bond-card/index.vue'
describe('bond-card', () => {
    // 目前只考虑中文版
    // 一开始不知道要测试什么，怎么测试
    // 我们可以把需要测试的情况罗列出来，然后一一编码，先思考后动手
    // 1、issuerName           1、截取18个字符 2、没有值时为'--'
    // 2、h2Style              1、发行人+标签长度如果大于22，则改变字体大小
    // 3、limitTags            1、最多截取三个标签 2、没有值时为[]
    // 4、buyYtm               1、精确到小数后3位 2、没有值时为'--'
    // 5、paymentFrequency     1、有值时后续加上'付息' 2、没有值时位'--'
    // 6、paymentDates         1、付息日超过2个（不包含）则在后面加上'等'，并且只截取前两个展示 2、没有值时为'--'
    it('正常预期数据 bondInfo', () => {
        const wrapper = mount(bondCard, {
            propsData: {
                bondInfo: {
                    issuerName: {
                        zhCn: '1234567890123456789'
                    },
                    paymentDates: '8月3日|8月3日|8月3日',
                    paymentFrequency: { type: 1, name: '每月' },
                    price: {
                        buyYtm: '2.2'
                    },
                    tags: [
                        {
                            name: { zhCn: '稳健1', zhHk: '穩健', en: 'steady' }
                        },
                        {
                            name: { zhCn: '稳健2', zhHk: '穩健', en: 'steady' }
                        },
                        {
                            name: { zhCn: '稳健3', zhHk: '穩健', en: 'steady' }
                        },
                        {
                            name: { zhCn: '稳健4', zhHk: '穩健', en: 'steady' }
                        }
                    ]
                }
            }
        })
        // Q：直接使用 wrapper.vm 获取数据进行对比还是取页面上展示的文本进行对比？
        // A：我比较倾向于第二种，取页面上展示的文本进行对比
        // 组件中可能因为各种原因，不敢修改之前的变量数据。
        // 此时新增变量替换原先模板中的变量，页面上展示改变了，但是脚本中原有变量还在，测试正常通过，这是不对的
        // 所以应该以实际页面展示为准。
        // 只有在页面上无法测试到的时候，直接拿 wrapper.vm 上的数据对比
        // 1、issuerName
        expect(wrapper.find('h2').text()).toBe('123456789012345678')
        // 2、h2Style
        expect(wrapper.vm.h2Style).toEqual({
            flex: 1,
            fontSize: '0.32rem',
            lineHeight: '0.44rem'
        })
        // 3、limitTags
        let tagList = wrapper.findAll('.van-tag')
        let tagLen = tagList.length
        expect(tagLen).toBe(3)
        expect(tagList.at(0).text()).toBe('稳健1')
        expect(tagList.at(1).text()).toBe('稳健2')
        expect(tagList.at(2).text()).toBe('稳健3')
        // 4、buyYtm
        expect(wrapper.find('.rate-num').text()).toBe('2.200%')
        // 5、paymentFrequency
        expect(
            wrapper
                .findAll('.card-tips')
                .at(1)
                .text()
        ).toBe('每月付息')
        // 6、paymentDates
        expect(wrapper.find('.interest-num').text()).toBe('8月3日、8月3日等')
    })

    it('异常预期数据 bondInfo', () => {
        const wrapper = mount(bondCard, {
            propsData: {
                bondInfo: {
                    issuerName: {
                        zhCn: '--'
                    },
                    paymentDates: '',
                    paymentFrequency: { type: 1, name: '' },
                    price: {
                        buyYtm: ''
                    },
                    tags: []
                }
            }
        })
        // Q：直接使用 wrapper.vm 获取数据进行对比还是取页面上展示的文本进行对比？
        // A：我比较倾向于第二种，取页面上展示的文本进行对比
        // 组件中可能因为各种原因，不敢修改之前的变量数据。
        // 此时新增变量替换原先模板中的变量，页面上展示改变了，但是脚本中原有变量还在，测试正常通过，这是不对的
        // 所以应该以实际页面展示为准。
        // 只有在页面上无法测试到的时候，直接拿 wrapper.vm 上的数据对比
        // 1、issuerName
        expect(wrapper.find('h2').text()).toBe('--')
        // 2、h2Style
        expect(wrapper.vm.h2Style).toEqual({})
        // 3、limitTags
        let tagList = wrapper.findAll('.van-tag')
        let tagLen = tagList.length
        expect(tagLen).toBe(0)
        expect(wrapper.vm.limitTags).toEqual([])
        // 4、buyYtm
        expect(wrapper.find('.rate-num').text()).toBe('--')
        // 5、paymentFrequency
        expect(
            wrapper
                .findAll('.card-tips')
                .at(1)
                .text()
        ).toBe('--')
        // 6、paymentDates
        expect(wrapper.find('.interest-num').text()).toBe('--')
    })
})
