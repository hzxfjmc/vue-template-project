//港版
import quan from '@/assets/img/marketing/award-center/quan.png'
import gupiao from '@/assets/img/marketing/award-center/gupiao.png'
import yongjin from '@/assets/img/marketing/award-center/yongjin.png'
import hangqing from '@/assets/img/marketing/award-center/hangqing.png'
import starbucks from '@/assets/img/marketing/award-center/starbucks.png'

import quanhui from '@/assets/img/marketing/award-center/quanhui.png'
import gupiaohui from '@/assets/img/marketing/award-center/gupiaohui.png'
import yongjinhui from '@/assets/img/marketing/award-center/yongjinhui.png'
import hangqinghui from '@/assets/img/marketing/award-center/hangqinghui.png'
import starbuckshui from '@/assets/img/marketing/award-center/starbuckshui.png'

import quanblue from '@/assets/img/marketing/award-center/quanblue.png'
import gupiaoblue from '@/assets/img/marketing/award-center/gupiaoblue.png'
import yongjinblue from '@/assets/img/marketing/award-center/yongjinblue.png'
import hangqingblue from '@/assets/img/marketing/award-center/qushi.png'
import starbucksblue from '@/assets/img/marketing/award-center/starbucks.png'

import yishixiao from '@/assets/img/marketing/award-center/yishixiao.png'
import yishiyong from '@/assets/img/marketing/award-center/yishiyong.png'
import redeemed from '@/assets/img/marketing/award-center/redeemed.png'
import invalid from '@/assets/img/marketing/award-center/invalid.png'
import clock from '@/assets/img/marketing/award-center/clock.png'
import right from '@/assets/img/marketing/award-center/right.png'
import Vue from 'vue'
let pro = Vue.prototype
//大陆版
const map = new Map()
const keyList = [1, 2, 3, 4, 5]
const list = [
    {
        type: 1, //返现券
        image: quan,
        imageGray: quanhui,
        imageBlue: quanblue,
        color: '#FF6678',
        colorCh: '#FF5A5A',
        tips: pro.$t('tips1'),
        backChColor: '#FF5A5A',
        backChImage: '/webapp/marketing/images/quan.png',
        backChGray: '/webapp/marketing/images/quan2.png',
        background:
            'linear-gradient(315deg,rgba(255,140,114,1) 0%,rgba(255,126,98,1) 1%,rgba(255,92,114,1) 100%)'
    },
    {
        type: 2, //送股券
        image: gupiao,
        imageGray: gupiaohui,
        imageBlue: gupiaoblue,
        color: '#6982FF',
        colorCh: '#415DFF',
        tips: pro.$t('tips2'),
        backChColor: '#415DFF',
        backChImage: '/webapp/marketing/images/gupiaoka.png',
        backChGray: '/webapp/marketing/images/gupiaoka2.png',
        background:
            'linear-gradient(135deg,rgba(98,121,255,1) 0%,rgba(85,169,255,1) 100%)'
    },
    {
        type: 3, //免佣券
        image: yongjin,
        imageGray: yongjinhui,
        imageBlue: yongjinblue,
        color: '#916EFE',
        colorCh: '#A678FF',
        tips: pro.$t('tips3'),
        backChColor: '#A678FF',
        backChImage: '/webapp/marketing/images/mianyongka.png',
        backChGray: '/webapp/marketing/images/mianyongka2.png',
        background:
            'linear-gradient(133deg,rgba(137,100,255,1) 0%,rgba(170,136,255,1) 100%)'
    },
    {
        type: 4, //行情券
        image: hangqing,
        imageGray: hangqinghui,
        imageBlue: hangqingblue,
        color: '#FFA056',
        colorCh: '#FF8815',
        tips: pro.$t('tips4'),
        backChColor: '#FF8815',
        backChImage: '/webapp/marketing/images/hangqingka.png',
        backChGray: '/webapp/marketing/images/hangqingka2.png',
        background:
            'linear-gradient(135deg,rgba(255,146,61,1) 0%,rgba(255,144,58,1) 0%,rgba(255,164,86,1) 100%)'
    },
    {
        type: 5, //礼品券
        image: starbucks,
        imageGray: starbuckshui,
        imageBlue: starbucksblue,
        color: '#036D48',
        colorCh: '#FF5A5A',
        tips: pro.$t('tips5'),
        backChColor: '#2DA278',
        backChImage: '/webapp/marketing/images/starbucks.png',
        backChGray: '/webapp/marketing/images/starbucks2.png',
        background:
            'linear-gradient(136deg,rgba(28,152,104,1) 0%,rgba(91,188,118,1) 100%)'
    }
]
keyList.forEach((el, index) => {
    map.set(el, list[index])
})
export default {
    map,
    yishixiao,
    yishiyong,
    redeemed,
    invalid,
    clock,
    right
}
