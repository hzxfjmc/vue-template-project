import { oauthRedirect, initOauth } from '@/utils/oauth2/wechat.js'
import { wechatShare } from '@/utils/share/wechat.js'

oauthRedirect()
initOauth()
console.log(1)
wechatShare({
    title: '测试',
    desc: '详情',
    link: '',
    imgUrl: 'http://m-sit.yxzq.com/webapp/open-account/img/succed.f40e7d31.png'
})
console.log(2)
