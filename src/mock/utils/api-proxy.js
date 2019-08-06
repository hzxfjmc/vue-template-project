import Mock from 'mockjs'
import { fromatData as getBondListData } from '../modules/get-bond-list.js'
const mapUrlList = {
    '/finance-info-server/api/get-bond-list/v1': getBondListData
}
export const proxy = function(url, data) {
    console.log('Mock.valid message:>>>', Mock.valid(mapUrlList[url], data))
    return data
}
