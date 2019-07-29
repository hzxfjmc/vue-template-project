<template lang="pug">
.award
    van-popup(v-model="show" @closed="handleClosed")
        .content(v-if="popData.couponType")
            template(v-if="popData.activated===2")
                //送股
                .backgu(v-if="popData.couponType===2")
                    .triangle-left 
                    .content-gu 
                        .icon-center()
                            img(:src="list.map.get(popData.couponType)['imageBlue']")
                            .icon-text
                                .main-t() {{popData.stockName}}
                                .sub-t() ({{popData.stockCode}}) {{popData.stockCount}}{{$t('share')}}
                    .yuan1
                //行情
                .backHang(v-else-if="popData.couponType===4")
                    .icon-center()
                        .radius-text {{popData.marketType|levalFilter}}
                        .icon-text
                            span.main-t() {{popData.marketQuotationDays|feeDaysFilter(this)}} {{units}}
                            span.sub-t()  {{popData.marketType|marketFilter(this)}} {{$t('quotation')}}
                .back(v-else)
                    //礼品
                    .icon-middle(v-if="popData.couponType==5")
                        img(:src="list.map.get(popData.couponType)['imageBlue']")
                        .icon-text()
                            span.main-t() {{popData.offerAmount|offerAmountFilter}}
                            span.sub-t()  {{popData.currencyCode}}
                    .icon-center(v-else-if="popData.couponType==1 || popData.couponType==3")
                        img(:src="list.map.get(popData.couponType)['imageBlue']")
                        //返现
                        .icon-text(v-if="popData.couponType==1")
                            span.main-t()  {{popData.offerAmount|offerAmountFilter}}
                            span.sub-t()  {{popData.currencyCode}}
                        //免佣
                        .icon-text(v-else-if="popData.couponType==3")
                            span.main-t() {{popData.feeCommissionDays|feeDaysFilter(this)}}
                            span.sub-t() {{popData.feeCommissionDays < 36500 ? $t('addDay'):''}} {{$t('commissionfree')}}
                    .yuan1
                    .yuan2
                .main-text(v-if="popData.couponType==1||popData.couponType==3" :class="{'isEn':isEn}") {{$t('useSuccess')}}
                .main-text(v-else :class="{'isEn':isEn}") {{$t('conget')}}{{popData.couponName}}
                .main-text(v-if="popData.couponType==5" :class="{'isEn':isEn}") {{$t('pjredemptionCode')}}：{{popData.giftSerialNo}}
                .sub-text  {{popData.sameFeePackage?'':list.map.get(popData.couponType).tips}}
                .confirm(@click="goToPersonCenter" v-if='popData.couponType==4') {{$t('iKnow')}}
                .confirm(@click="confirmHandle" v-else) {{$t('確認')}}
            div(v-if='popData.activated===1')
                .backsingle
                   img(:src="wallet")
                .main-text {{popData.conditionType|conditionTypeFilter(this)}}
                    span(v-if='popData.conditionType!=8') {{popData.conditionAmount/100}}{{popData.conditionCurrencyCode}}
                .sub-dead-text {{$t('readyToUse')}}
                .confirm(@click="confirmHandle") {{$t('immedideposit')}}
            
</template>

<script>
import { Popup } from 'vant'
import list from './list'
import wallet from '@/assets/img/marketing/award-center/wallet.png'
import { lang } from '@/utils/html-utils.js'
export default {
    components: { [Popup.name]: Popup },
    i18n: {
        zhCHS: {
            確認: '确认',
            imediCheck: '立即查看',
            conget: '恭喜您获得',
            immedideposit: '立即入金',
            commissionfree: '免佣',
            readyToUse: '即可使用',
            addDay: '天'
        },
        zhCHT: {
            確認: '確認',
            imediCheck: '立即查看',
            conget: '恭喜您獲得',
            immedideposit: '立即存款',
            commissionfree: '特惠',
            share: '股',
            readyToUse: '即可使用',
            addDay: '天'
        },
        en: {
            確認: 'Confirm',
            imediCheck: 'View now',
            conget: 'Congratulations on getting',
            immedideposit: 'Deposit immediately',
            commissionfree: 'special',
            readyToUse: 'Ready to use',
            addDay: 'day'
        }
    },
    props: {
        value: {
            type: Boolean,
            default: true
        },
        popData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        units() {
            //港股
            if (this.popData.marketQuotationDays < 36500) {
                if (this.popData.marketType == 2) {
                    //香港ip
                    if (this.popData.ipType === 2) {
                        return this.$t('month')
                    } else {
                        return this.$t('day')
                    }
                } else {
                    return this.$t('day')
                }
            } else {
                return ''
            }
        }
    },
    data() {
        return {
            list,
            wallet,
            isEn: false
        }
    },
    async created() {
        if (lang === 'en') {
            this.isEn = true
        }
    },
    mounted() {},
    methods: {
        confirmHandle() {
            this.show = false
            this.$emit('listenConfirm')
        },
        handleClosed() {
            this.$emit('listenConfirm')
        },
        goToPersonCenter() {
            this.show = false
        }
    },
    filters: {
        levalFilter(value) {
            let priceList = {
                0: '港股、美股',
                1: 'LV2',
                2: 'LV1'
            }
            return priceList[value]
        },
        marketFilter(value, _this) {
            return _this.$t('marketList')[value]
        },
        conditionTypeFilter(value, _this) {
            return _this.$t('conditionList')[value]
        },
        offerAmountFilter(value) {
            return value / 100
        },
        feeDaysFilter(value, _this) {
            if (value >= 36500) {
                return _this.$t('ever')
            } else {
                return value
            }
        }
    }
}
</script>
<style scoped lang="scss">
.content {
    width: 323px;
    height: 275px;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    padding: 0 30px;
    overflow: hidden;
    .back {
        width: 210px;
        height: 90px;
        background: rgba(235, 243, 255, 1);
        position: relative;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 10px;
        .icon-center {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
        }
        img {
            width: 43px;
        }
        .icon-middle {
            text-align: center;
            img {
                margin-top: 10px;
            }
        }
        .main-t {
            font-size: 24px;
        }
        .yuan1 {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 20px;
            background-color: #fff;
            left: -10px;
            top: 40px;
        }
        .yuan2 {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 20px;
            background-color: #fff;
            right: -10px;
            top: 40px;
        }
    }
    .backHang {
        width: 210px;
        height: 90px;
        background-color: rgba(235, 243, 255, 1);
        background-image: url(/webapp/marketing/images/qushi.png);
        background-size: 84px 43px;
        background-repeat: no-repeat;
        background-position: 120px 40px;
        position: relative;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 10px;
        border-radius: 8px;
        .icon-center {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
        }
        .radius-text {
            width: 57px;
            height: 25px;
            background: rgba(47, 121, 255, 1);
            border-radius: 16px;
            color: #fff;
            line-height: 25px;
            text-align: center;
        }
        .main-t {
            font-size: 24px;
        }
    }
    .backgu {
        display: flex;
        position: relative;
        left: 20px;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 10px;
        .triangle-left {
            width: 0;
            height: 0;
            border-top: 45px solid transparent;
            border-right: 30px solid rgba(235, 243, 255, 1);
            border-bottom: 45px solid transparent;
        }
        .content-gu {
            width: 180px;
            height: 90px;
            background: rgba(235, 243, 255, 1);
        }
        .icon-center {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
        }
        img {
            width: 43px;
        }
        .yuan1 {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 20px;
            background-color: #fff;
            left: 10px;
            top: 40px;
        }
    }
    .backsingle {
        width: 97px;
        height: 80px;
        position: relative;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 10px;
        img {
            width: 100%;
        }
    }
    .sub-dead-text {
        text-align: center;
        font-size: 20px;
    }
    .border-div {
        width: 210px;
        height: 10px;
        background-color: rgba(235, 243, 255, 1);
        margin: 0 auto;
        position: relative;
        top: 80px;
        border-top: 1px solid #d8e7ff;
        border-radius: 8px;
    }
    .main-text {
        text-align: center;
        font-size: 20px;
        color: #393939;
    }
    .sub-text {
        text-align: center;
        font-size: 12px;
        color: #393939;
    }
    .confirm {
        width: 100%;
        height: 48px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        line-height: 48px;
        border-top: 1px solid #f0f0f0;
        color: #3c78fa;
    }
    .icon-text {
        padding: 0 5px;
    }
    .isEn {
        font-size: 18px;
    }
}
</style>
<style lang="scss">
.award .van-popup {
    background: none;
}
</style>
