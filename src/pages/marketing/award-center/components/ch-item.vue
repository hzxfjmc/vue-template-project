<template lang="pug">
    .wrap
        .stamp.stamp01(:class="{'isEn':isEn}")
            .par()
                .icon(
                    :style="{backgroundImage:index=='0'? `url(${list.map.get(cardData.couponType).backChImage})`:`url(${list.map.get(cardData.couponType).backChGray})`, backgroundColor: index=='0'?list.map.get(cardData.couponType).backChColor:'#B0B0B0'}"
                    )
                    //免佣金
                    div(v-if="cardData.couponType == 3")
                        .main-text.isEnMain {{cardData.feeCommissionDays|feeDaysFilter(this)}}
                             span.sub {{cardData.feeCommissionDays<36500 ?$t('day') :''}}
                        .sub-text {{$t('freecommission')}}
                    //行情
                    div(v-else-if="cardData.couponType == 4")
                        .main-text.isEnMain {{cardData.marketQuotationDays|feeDaysFilter(this)}}
                            span.sub {{units}}
                        .sub-text {{cardData.marketType|priceFilter(this)}}
                    //礼品
                    div(v-else-if="cardData.couponType == 5")
                        .main-text {{cardData.offerAmount}}
                            span.sub {{cardData.currencyCode|currencyCodeFilter}}
                        .sub-text Starbucks
                    //送股
                    div(v-else-if="cardData.couponType == 2")
                        div(v-if="index!='0'")
                            img(:src="gupiao2" class="empty")
                        div(v-else)
                            .main-text {{cardData.stockPrice|stockPriceFilter(cardData)}}
                                span.sub 
                            .sub-text {{cardData.stockMarket|stockMarketFilter}}
                    div(v-else)
                        .main-text {{cardData.offerAmount|offerAmountFilter}}
                            span.sub 
                        .sub-text {{cardData.currencyCode|currencyCodeFilter}}
                .texts
                    span.doller {{cardData.couponName}}
                    //礼品卡独有
                    .date(v-if='cardData.couponType===5') {{$t('redemptionCode')}}:{{cardData.giftSerialNo}}
                    //免佣卡
                    div(v-if="cardData.couponType == 3")
                        .date {{cardData.marketType|marketFilter(this)}}{{$t('freecommission')}}
                        //使用条件
                        .date(v-if="cardData.conditionType!=1") {{$t('conditionOfUse')}}{{cardData.conditionType|conditionTypeFilter(this)}}
                           span(v-if='cardData.conditionType!=8') {{cardData.conditionAmount|offerAmountFilter}}{{cardData.conditionCurrencyCode|currencyCodeFilter}}
                    div(v-else)
                        .date(v-if="cardData.couponType == 2") {{cardData.stockName}} {{cardData.stockCode}} {{cardData.stockCount}}{{$t('share')}}
                         //使用条件
                        .date(v-if="cardData.conditionType!=1") {{$t('conditionOfUse')}}{{cardData.conditionType|conditionTypeFilter(this)}}
                           span(v-if='cardData.conditionType!=8') {{cardData.conditionAmount|offerAmountFilter}}{{cardData.conditionCurrencyCode|currencyCodeFilter}}
                    .date {{$t('useDays')}}{{cardData.effectiveStartTime|startTimeFilter}}-{{cardData.effectiveEndTime|endTimeFilter}}
            .copy(v-if='index==0')
                //可以用
                .btn(v-if="cardData.activated==2 && cardData.status===1" @click="buttonHandle(cardData)") {{$t('imediUse')}}
                //分配中
                div(v-else-if="cardData.activated==2 && cardData.status===2 && cardData.couponType===2" @click="stockDelay")
                    img.clock(:src="list.clock")
                    .allocation
                       span {{$t('Processing')}}
                       img.right(:src="list.right")
                //不能用
                .button(v-else-if='cardData.activated==3||cardData.activated==1' @click="buttonHandle(cardData)" ) {{$t('imediUse')}}
                .slogon(v-if='cardData.couponTagName') {{cardData.couponTagName}}
            .logo(v-else)
               .logo-inner(@click='goToExpireReason(index,cardData)')
                  img(v-if='isEn' :src="index==1?list.redeemed:list.invalid")
                  img(v-else :src="index==1?list.yishiyong:list.yishixiao")
        .tips 
            span(@click="tipRotate")  {{$t('Usetips')}}
                van-icon(:name="rotate?'arrow-up':'arrow-down'")
            span(v-if="index===0 && cardData.expireSoon") {{$t('expireDays',cardData.expireDays)}}
        .content(v-show="rotate")
            p(v-for='(item,index) in splitDesc' :key='index') {{item}}
        van-dialog.error-dialog(
        title="系统繁忙，请您稍后再试"
        :message="`<b>如有疑问请您联系客服</b>\n<span>错误代码：${errCode}</span>`"
        v-model="showErrDialog"
        confirm-button-text="好的"
        @confirm="showErrDialog = false")
        van-dialog(
        :title="`已发放至您的微信：${wechatNickName}`"
        message="请在友信智投服务号中查收微信红包\n逾期未领取红包，将会退回"
        v-model="showSuccessDialog"
        confirm-button-text="好的"
        @confirm="showSuccessDialog = false")
</template>

<script>
import gupiao2 from '@/assets/img/marketing/award-center/gupiao2.png'
import { couponUse, getOpeningStatus } from '@/service/product-server.js'

import list from './list'
import { Icon } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
import { withdraw } from '../utils/mixins'
import { lang } from '@/utils/html-utils.js'
export default {
    name: 'ch',
    mixins: [withdraw],
    components: {
        [Icon.name]: Icon
    },
    props: {
        cardData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            list,
            rotate: false,
            gupiao2,
            ifopenaccount: true,
            ismatch: false,
            isEn: false
        }
    },
    created() {
        if (lang === 'en') {
            this.isEn = true
        }
    },
    methods: {
        tipRotate() {
            this.rotate = !this.rotate
        },
        async buttonHandle(item) {
            if (item.activated === 1) {
                //2,3,4去入金 5,6,7去交易
                let typeGo = ''
                if ([2, 3, 4].includes(item.conditionType)) {
                    typeGo = this.$t('goToGold')
                }
                if ([5, 6, 7].includes(item.conditionType)) {
                    typeGo = this.$t('goToTrade')
                }
                let conditonFilter = ''
                if (item.conditionType != 8) {
                    conditonFilter = `${
                        this.$t('conditionList')[item.conditionType]
                    }${item.conditionAmount / 100}${item.conditionCurrencyCode}`
                } else {
                    conditonFilter = `${
                        this.$t('conditionList')[item.conditionType]
                    }`
                }
                this.$confirm({
                    title: this.$t('canNotReach'),
                    message: conditonFilter,
                    confirmButtonText: typeGo,
                    cancelButtonText: this.$t('cancel')
                })
                    .then(() => {
                        jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                    })
                    .catch(() => {})
            }
            if (item.activated === 2) {
                //判断是否开户若没有开户弹窗去开户,(行情卡不判断开户)
                const actions = new Map([
                    [
                        { couponType: 1 },
                        () => {
                            if (this.ifopenaccount) {
                                if (item.currencyCode === 'RMB') {
                                    this.goToRmb(item)
                                } else {
                                    this.confirmUse(item)
                                }
                            } else {
                                this.goOpenAccount()
                            }
                        }
                    ],
                    [
                        { couponType: 2 },
                        () => {
                            if (this.ifopenaccount) {
                                this.useCoupon(item)
                            } else {
                                this.goOpenAccount()
                            }
                        }
                    ],
                    [
                        { couponType: 3 },
                        () => {
                            if (this.ifopenaccount) {
                                this.confirmUse3(item)
                            } else {
                                this.goOpenAccount()
                            }
                        }
                    ],
                    [
                        { couponType: 4 },
                        () => {
                            this.useCoupon(item)
                        }
                    ],
                    [
                        { couponType: 5 },
                        () => {
                            if (this.ifopenaccount) {
                                this.useCoupon(item)
                            } else {
                                this.goOpenAccount()
                            }
                        }
                    ]
                ])
                let action = [...actions].filter(
                    ([value]) => value.couponType == item.couponType
                )
                await this.isOpened()
                action.forEach(([key, value]) => {
                    value.call(this)
                    console.log(key)
                })
            }
        },
        stockDelay() {
            this.$alert({
                title: this.$t('stockUsed'),
                message: this.$t('stockTips'),
                confirmButtonText: this.$t('iKnow')
            })
        },
        async isOpened() {
            try {
                this.$loading()
                let ifopenaccount = await getOpeningStatus()
                this.$close()
                this.ifopenaccount = ifopenaccount
            } catch (e) {
                this.$toast(e.msg || this.$t('netError'))
            }
        },
        goOpenAccount() {
            this.$confirm({
                title: this.$t('noOpenAccout'),
                message: this.$t('openCanNext'),
                confirmButtonText: this.$t('goToOpen'),
                cancelButtonText: this.$t('cancel')
            })
                .then(() => {
                    jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                })
                .catch(() => {})
        },
        async useCoupon(item) {
            let param = {
                businessId: item.couponBusinessId
            }
            try {
                this.$loading()
                let data = await couponUse(param)
                this.$close()
                if (item.couponType === 5) {
                    let totalObj = Object.assign({}, item, {
                        giftSerialNo: data.giftSerialNo
                    })
                    this.$emit('buttonHandle', totalObj)
                } else {
                    this.$emit('buttonHandle', item)
                }
            } catch (e) {
                // this.$toast(e.msg || this.$t('netError'))
                this.$alert({
                    message: e.msg,
                    confirmButtonText: this.$t('ok')
                })
            }
        },
        goToRmb({ couponName, offerAmount, couponBusinessId }) {
            this.submitHandler(
                () => {
                    this.$router.push({
                        name: 'withdrawrmb',
                        query: {
                            couponName: couponName,
                            offerAmount: offerAmount,
                            couponBusinessId
                        }
                    })
                },
                couponBusinessId,
                () => {
                    this.$emit('updateData')
                }
            )
        },
        goToExpireReason(index, item) {
            if (index === 2) {
                this.$alert({
                    title: this.$t('failureReason'),
                    message: item.remark,
                    confirmButtonText: this.$t('iKnow')
                })
            }
        },
        confirmUse(item) {
            this.$confirm({
                title: this.$t('confirmUseTitle', item.couponName),
                message: this.$t('confirmUseMessage')
            })
                .then(() => {
                    this.useCoupon(item)
                })
                .catch(() => {})
        },
        confirmUse3(item) {
            if (item.sameFeePackage) {
                this.$confirm({
                    title: this.$t('confirmUseTitle', item.couponName)
                })
                    .then(() => {
                        this.useCoupon(item)
                    })
                    .catch(() => {})
            } else {
                this.$confirm({
                    title: this.$t('confirmUseTitle', item.couponName),
                    message: this.$t('confirmUseMessage3')
                })
                    .then(() => {
                        this.useCoupon(item)
                    })
                    .catch(() => {})
            }
        }
    },
    filters: {
        //免佣过滤
        marketFilter(value, _this) {
            return _this.$t('marketList')[value]
        },
        priceFilter(value, _this) {
            return _this.$t('priceList')[value]
        },
        //filter中把this当作第二个参数传进来
        conditionTypeFilter(value, _this) {
            return _this.$t('conditionList')[value]
        },
        startTimeFilter(value) {
            return value.replace(/-/g, '.').slice(0, 10)
        },
        endTimeFilter(value) {
            return value.replace(/-/g, '.').slice(0, 10)
        },
        stockPriceFilter(value, cardData) {
            let unit = Math.pow(10, cardData.priceBase)
            return (value / unit).toFixed(1)
        },
        offerAmountFilter(value) {
            if (value) {
                return value / 100
            }
        },
        currencyCodeFilter(value) {
            let codeList = {
                HKD: 'HK$',
                USD: 'US$',
                RMB: 'RMB'
            }
            return codeList[value]
        },
        //送股券单位
        stockMarketFilter(value) {
            let codeList = {
                hk: 'HK$',
                us: 'US$'
            }
            return codeList[value]
        },
        feeDaysFilter(value, _this) {
            if (value >= 36500) {
                return _this.$t('ever')
            } else {
                return value
            }
        }
    },
    computed: {
        units() {
            if (this.cardData.marketQuotationDays < 36500) {
                //香港ip
                if (
                    this.cardData.marketType == 1 &&
                    this.cardData.ipType === 2
                ) {
                    return this.$t('month')
                } else {
                    return this.$t('day')
                }
            } else {
                return ''
            }
        },
        splitDesc() {
            return this.cardData.desc.split(/\n/)
        }
    }
}
</script>

<style scoped lang="scss">
.wrap {
    box-shadow: 0px 0px 7px 0px rgba(226, 226, 226, 0.5);
    .error-dialog {
        /deep/ {
            b {
                text-align: center;
                font-weight: 500;
                color: #353547;
                font-size: 16px;
                position: relative;
                bottom: 12px;
            }
            span {
                font-size: 12px;
            }
        }
    }
}
.stamp {
    height: 90px;
    border-radius: 4px 4px 0px 0px;
    padding: 0 0px;
    display: flex;
    background: #fff;
    color: #393939;
    border-bottom: 1px dashed transparent;
    background: linear-gradient(white, white) padding-box,
        repeating-linear-gradient(
            -45deg,
            $border-color 0,
            $border-color 0.25em,
            white 0,
            white 0.5em
        );
}

.tips {
    width: 100%;
    line-height: 32px;
    font-size: 12px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    color: $text-color7;
    background: #fff;
}
.stamp .par {
    display: flex;
    padding: 0 0px;
    width: 270px;
    overflow: hidden;
    .icon {
        width: 104px;
        height: 90px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .main-text {
            font-size: 32px;
            color: #fff;
            text-align: center;
            line-height: 20px;
        }
        .sub {
            font-size: 12px;
        }
        .sub-text {
            font-size: 16px;
            color: #fff;
            text-align: center;
        }
    }
    .doller {
        font-size: 20px;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 150px;
        text-align: left;
    }
    .date {
        font-size: 10px;
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 150px;
        text-align: left;
    }
    .texts {
        width: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
}
.stamp .copy {
    padding: 0 10px 0 0;
    text-align: center;
    font-size: 16px;
    display: flex;
    align-items: center;
}
.slogon {
    position: absolute;
    width: 34px;
    height: 28px;
    right: 0px;
    top: 0;
    background: rgba(255, 173, 173, 1);
    border-bottom-left-radius: 24px;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
}
.stamp .copy p {
    font-size: 16px;
    margin-top: 15px;
}

.stamp01 {
    position: relative;
    overflow: hidden;
}
.stamp01:before {
    content: ' ';
    width: 100%;
    height: 0;
    position: absolute;
    top: 98px;
    bottom: -5px;
    left: 5px;
}
.button {
    width: 76px;
    height: 26px;
    background: rgba(255, 255, 255, 1);
    border-radius: 13px;
    color: #ff6678;
    border: 1px solid rgba(255, 90, 90, 1);
    font-size: 14px;
    margin-top: 10px;
}
.clock {
    width: 38px;
    height: 38px;
}
.right {
    width: 13px;
    height: 10px;
    vertical-align: 0px;
}
.allocation {
    font-size: 14px;
    margin-top: 5px;
    color: #415dff;
}
.btn {
    width: 76px;
    height: 26px;
    background: #ff5a5a;
    border-radius: 13px;
    color: #fff;
    font-size: 14px;
    border: 1px solid #fff;
    margin-top: 10px;
}
.content {
    padding: 0 10px 5px;
    font-size: 10px;
    color: $text-color7;
    background: #fff;
}
.logo {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo-inner {
    width: 62px;
    height: 62px;
    img {
        width: 100%;
    }
}
.empty {
    width: 90px;
}
.isEn {
    height: 150px;
    .par {
        .icon {
            height: 150px;
            background-position: bottom left;
            background-size: cover;
            .isEnMain {
                font-size: 16px;
            }
        }
        .doller {
            word-wrap: break-word;
            white-space: normal;
            font-size: 18px;
            line-height: 24px;
        }
        .date {
            word-wrap: break-word;
            white-space: normal;
            margin-bottom: 4px;
        }
    }
}
</style>
<style lang="scss">
.tips .van-icon {
    margin-left: 3px;
    position: relative;
    top: 1px;
}
</style>
