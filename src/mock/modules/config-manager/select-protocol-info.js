import { host } from '../../utils/host'
import { formatMockData } from '../../utils/util'
import Mock from 'mockjs'
// 债券风险提示签名
const formatData = formatMockData({
    protocolName: '@cword(5,8)',
    protocolUrl: '@url(http)'
})
export default [
    host + '/config-manager/api/select-protocol-info/v1?serviceCode=BOND001',
    'post',
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
