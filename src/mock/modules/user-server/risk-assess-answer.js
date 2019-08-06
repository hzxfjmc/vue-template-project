import { host } from '../../utils/host'
import { formatMockData } from '../../utils/util'
import Mock from 'mockjs'
// 风险测评提交
const formatData = formatMockData({
    'assessResult|1': [1, 2],
    'createTime|1564577990837-2564577990837': 0,
    'validTime|1564577990837-2564577990837': 0
})
export default [
    host + '/user-server/api/risk-assess-answer/v1',
    'post',
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
