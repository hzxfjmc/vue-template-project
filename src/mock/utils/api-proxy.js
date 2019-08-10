import Mock from 'mockjs'
import modules from '../modules'

export default function(url, method, data) {
    // console.log('url :', url)
    // console.log('method :', method)
    Object.keys(modules).forEach(key => {
        let ele = modules[key][3]
        if (ele && ele.url === url && ele.method === method) {
            console.group(url.replace(/http:\/\//, ''))
            console.log('valid response data :>>> url: ', url)
            console.log(
                'valid response data :>>> validMsg: ',
                Mock.valid(ele.formatData, data)
            )
            console.groupEnd()
        }
    })
}
