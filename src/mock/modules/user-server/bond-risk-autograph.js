import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
import Mock from 'mockjs'
// 债券风险提示签名
const formatData = formatMockData({})
export default [
    host + '/user-server/api/bond-risk-autograph/v1',
    'post',
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
