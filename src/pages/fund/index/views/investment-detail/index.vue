<template lang="pug">
.investment__detail__wrapper
    .investment__detail__header(:class="!isNotStop?'no-color':'has-color'")
        .investment__detail__header_info(@click="toFundDetailHandle")
            .header_info_left(:class="!isNotStop?'header_info_gray-left':''")
                .name.ellipse {{fundHeaderInfoVO.fundName}}
                .code ISIN:{{fundHeaderInfoVO.fundCode}}
            .header_info_right
                img(src="@/assets/img/fund/icon-right.png")
        .investment__detail__header_amount
            .header_amount.left
                .title(:class="!isNotStop?'gray-color':''") {{$t('A79')}}
                .content(:class="!isNotStop?'black-color':''") {{investmentInfo.fixedTotalAmount|transNumToThousandMark}}
            .header_amount.right
                .title(:class="!isNotStop?'gray-color':''") {{$t('A80')}}
                .content(:class="!isNotStop?'black-color':''") {{investNum}}
            .header_amount.tag(v-if="fixedPlanStatus!==1" :class="fixedPlanStatus===2?'yellow':'orange'")
                .span {{statusValue}}
    .investment__detail__card.card
        .card_title
            img(:src="!isNotStop?require('@/assets/img/fund/dingtou2@2x.png'):require('@/assets/img/fund/dingtou@2x.png')")
            span(:class="!isNotStop?'black-color':''") {{$t('A109')}}
        .card_content
            .card_content_item
                .left {{$t('A112')}}
                .right {{investmentInfo.fixedCycleMonth}}{{investmentInfo.fixedCycleWeek}} {{$t('A2')}} {{investmentInfo.fixedPlanAmount|transNumToThousandMark}} {{currency ==1?$t('usd'):$t('hkd')}}
            .card_content_item
                .left {{$t('A15')}}
                .right(v-if="bankName") {{bankName}}
                    em(v-if="investmentInfo.exchangeFlag != 0") {{$t('A113')}}
                .right(v-else) {{investmentInfo.eddaBankName}}({{investmentInfo.eddaBankAccount && investmentInfo.eddaBankAccount.slice(-4)}}) 
                    em(v-if="investmentInfo.exchangeFlag != 0") {{$t('A113')}}
            .card_content_item(v-if="fixedPlanStatus!=2&&fixedPlanStatus!=3")
                .left {{$t('A81')}}
                .right {{investmentInfo.recentDeductionDate}}
    .investment__detail__tag.card(v-if="isNotStop")
        .investment__detail__tag_item(
            v-for="(item,index) in tagImgList" 
            :key="index" 
            @click="clickHandle(item.val)")
            img(:src="item.url")
            span {{item.text}}
    .investment__detail__record.card(:class="!isNotStop?'mt5':''")
        record(
            :currencyType = "currency"
            :isNotStop="isNotStop")
    van-dialog(
        v-model='isShowDialog' 
        :title="dialogTitle" 
        :message="dialogMessage" 
        :showCancelButton='true'  
        :cancelButtonText="cancelButtonText"  
        :confirmButtonText="confirmButtonText"
        @confirm='confirmDialogHandle')
</template>
<script>
import record from './record'
import {
    getFundFixedPlanDetail,
    getUpdateFundFixedPlanStatus
} from '@/service/finance-server'
import { getMarketValidFundAccount } from '@/service/user-account-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark, jumpUrl, debounce } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
export default {
    components: {
        record
    },
    filters: {
        transNumToThousandMark
    },
    data() {
        return {
            tagImgList: [
                {
                    val: 1,
                    url: require('@/assets/img/fund/icon-set.png'),
                    text: this.$t('A87')
                },
                {
                    val: 2,
                    url: require('@/assets/img/fund/icon-pause.png'),
                    text: this.$t('A88')
                },
                {
                    val: 3,
                    url: require('@/assets/img/fund/icon-close.png'),
                    text: this.$t('A89')
                }
            ],
            isNotStop: true,
            fundId: '',
            fundIdName: '',
            fixedPlanStatus: 1, //定投状态 1：有效 2 暂停 3 终止
            isShowDialog: false,
            dialogTitle: '',
            dialogMessage: '',
            cancelButtonText: this.$t('cancelButton'),
            confirmButtonText: this.$t(['确认', '確認', 'Confirm']),
            statusValue: '',
            fundHeaderInfoVO: {},
            investmentInfo: {},
            fundTradeInfoVO: {},
            investNum: 0,
            currency: 0,
            fixedPlanStatusval: null,
            arrMarketENUM: {
                2: {
                    0: this.$t([
                        '港股现金账户',
                        '港股現金賬戶',
                        'Cash Account(HKD)'
                    ]),
                    M: this.$t([
                        '港股保证金账户',
                        '港股孖展賬戶',
                        'Margin Account(HKD)'
                    ])
                },
                3: {
                    0: this.$t([
                        '美股现金账户',
                        '美股現金賬戶',
                        'Cash Account(USD)'
                    ]),
                    M: this.$t([
                        '美股保证金账户',
                        '美股孖展賬戶',
                        'Margin Account(USD)'
                    ])
                }
            },
            bankName: ''
        }
    },
    async created() {
        this.initData()
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.appVisibleHandle, 300)
    },
    methods: {
        async initData() {
            await this.getFundDetail()
            await this.getFundFixedPlanDetail()
            this.getMarketValidFundAccount()
            this.investNum = this.$route.query.investNum
        },
        async appVisibleHandle(data) {
            let re = data
            if (typeof data === 'string') {
                re = JSON.parse(data)
            }
            if (re.data.status !== 'visible') {
                return
            }
            console.log(re)
            this.initData()
        },
        async getMarketValidFundAccount() {
            try {
                const res = await getMarketValidFundAccount({
                    marketType: this.marketType
                })
                // 0代表现金，M代表孖展
                if (this.investmentInfo.chargeType == 1) {
                    console.log(res)
                    this.bankName = this.arrMarketENUM[this.marketType][
                        res.assetProp
                    ]
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //修改定投计划
        async getUpdateFundFixedPlanStatus(token) {
            try {
                this.$loading()
                await getUpdateFundFixedPlanStatus({
                    fixedPlanCode: this.$route.query.fixedPlanCode,
                    fixedPlanStatus: this.fixedPlanStatusval,
                    tradeToken: token
                })
                this.$close()
                this.getFundFixedPlanDetail()
            } catch (e) {
                this.$close()
                this.$toast(e.msg)
            }
        },
        //获取基金详情
        async getFundDetail() {
            try {
                const {
                    fundHeaderInfoVO,
                    fundTradeInfoVO
                } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundHeaderInfoVO = fundHeaderInfoVO
                this.fundTradeInfoVO = fundTradeInfoVO
                this.fundId = this.fundHeaderInfoVO.fundId
                this.fundName = this.fundHeaderInfoVO.fundName
                let marketTypeEMUN = {
                    1: 3, //美股市场
                    2: 2, //港股市场
                    3: 1 //a股市场
                }

                this.marketType =
                    marketTypeEMUN[this.fundTradeInfoVO.currency.type]
                this.currency = this.fundTradeInfoVO.currency.type
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        toFundDetailHandle() {
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/fund-details?id=${
                this.fundId
            }&name=${encodeURIComponent(this.fundName)}`
            jumpUrl(3, url)
        },
        // 点击tab
        clickHandle(val) {
            if (val === 1) {
                this.investmentInfo.type = 1
                this.investmentInfo.id = this.fundId
                console.log(this.investmentInfo)
                let url = `${window.location.origin}/wealth/fund/index.html#/fixed-investment`
                let queryString = ''
                Object.keys(this.investmentInfo).forEach(key => {
                    queryString += `${key}=${encodeURIComponent(
                        this.investmentInfo[key]
                    )}&`
                })
                url = `${url}?${queryString.slice(0, -1)}`
                jumpUrl('', url)
                // 修改计划 跳定投申购页面
                // this.$router.push({
                //     name: 'fixed-investment',
                //     query: this.investmentInfo
                // })
            } else if (val === 2) {
                // 暂停定投
                this.fixedPlanStatusval = 2
                this.isShowDialog = true
                this.dialogTitle = this.$t('A88')
                this.dialogMessage = this.$t('A94')
            } else if (val === 3) {
                // 终止定投
                this.fixedPlanStatusval = 3
                this.isShowDialog = true
                this.dialogTitle = this.$t('A90')
                this.dialogMessage = this.$t('A93')
            } else if (val === 4) {
                // 恢复定投
                this.fixedPlanStatusval = 1
                this.isShowDialog = true
                this.dialogTitle = this.$t('A89')
                this.dialogMessage = this.$t('A95')
            }
        },
        async confirmDialogHandle() {
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                let token = data && data.token
                this.getUpdateFundFixedPlanStatus(token)
            } catch (error) {
                this.$toast(error.desc.errorMessage)
                console.log('申购页面-tradeErrorMsg :', error)
            }
        },
        //计算周末公式
        getWeek(data) {
            let index = new Date(data).getDay()
            let i18nObj = {
                1: this.$t([`周一`, `週一`, `Mon.`]),
                2: this.$t([`周二`, `週二`, `Tues.`]),
                3: this.$t([`周三`, `週三`, `Wed.`]),
                4: this.$t([`周四`, `週四`, `Thur.`]),
                5: this.$t([`周五`, `週五`, `Fri.`]),
                6: this.$t([`周六`, `週六`, `Sat.`]),
                0: this.$t([`周天`, `週天`, `Sun.`])
            }
            return i18nObj[index]
        },
        init() {
            if (this.fixedPlanStatus === 2) {
                // 暂停状态
                this.statusValue = this.$t('A85')
                this.tagImgList = [
                    {
                        val: 4,
                        url: require('@/assets/img/fund/icon-start.png'),
                        text: this.$t('A89')
                    },
                    {
                        val: 3,
                        url: require('@/assets/img/fund/icon-close.png'),
                        text: this.$t('A90')
                    }
                ]
            } else if (this.fixedPlanStatus === 3) {
                this.statusValue = this.$t('A86')
                this.isNotStop = false
            } else if (this.fixedPlanStatus === 1) {
                this.tagImgList = [
                    {
                        val: 1,
                        url: require('@/assets/img/fund/icon-set.png'),
                        text: this.$t('A87')
                    },
                    {
                        val: 2,
                        url: require('@/assets/img/fund/icon-pause.png'),
                        text: this.$t('A88')
                    },
                    {
                        val: 3,
                        url: require('@/assets/img/fund/icon-close.png'),
                        text: this.$t('A90')
                    }
                ]
            }
        },
        // 查询定投详情
        async getFundFixedPlanDetail() {
            try {
                let params = {
                    fixedPlanCode: this.$route.query.fixedPlanCode
                }
                let res = await getFundFixedPlanDetail(params)
                this.fixedPlanStatus = res.fixedPlanStatus
                this.investmentInfo = res
                this.investmentInfo.recentDeductionDate = `${dayjs(
                    this.investmentInfo.recentDeductionDate
                ).format('YYYY-MM-DD')}(${this.getWeek(
                    this.investmentInfo.recentDeductionDate
                )})`
                let monthValue = {
                    1: this.$t([`周一`, `週一`, `Mon.`]),
                    2: this.$t([`周二`, `週二`, `Tues.`]),
                    3: this.$t([`周三`, `週三`, `Wed.`]),
                    4: this.$t([`周四`, `週四`, `Thurs.`]),
                    5: this.$t([`周五`, `週五`, `Fri.`])
                }
                this.investmentInfo.fixedCycleWeek =
                    this.investmentInfo.fixedCycleType === 1
                        ? monthValue[this.investmentInfo.fixedCycleValue]
                        : this.investmentInfo.fixedCycleValue == '0'
                        ? this.$t([`月末`, `月末`, `Late of the month`])
                        : this.$t([
                              `${this.investmentInfo.fixedCycleValue}日`,
                              `${this.investmentInfo.fixedCycleValue}日`,
                              `${this.investmentInfo.fixedCycleValue}`
                          ])
                this.investmentInfo.fixedCycleMonth =
                    this.investmentInfo.fixedCycleType === 1
                        ? this.$t(['每周', '每週', 'Weekly on '])
                        : this.$t(['每月', '每月', 'Monthly on '])
                this.init()
            } catch (e) {
                console.log(e)
                e.msg && this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.investment__detail__wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    // height: 100%;
    background: $background-bottom-color;
    .investment__detail__header {
        .investment__detail__header_info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 12px 10px 12px;
            border-bottom: 1px solid rgba($background-color, 0.05);
            .header_info_left {
                width: 90%;
                .name {
                    color: $background-color;
                    font-size: 16px;
                }
                .code {
                    color: rgba($background-color, 0.4);
                    font-size: 12px;
                }
            }
            .header_info_gray-left {
                .name {
                    color: $text-color;
                    font-size: 16px;
                }
                .code {
                    color: rgba($text-color5, 0.4);
                    font-size: 12px;
                }
            }
            .header_info_right {
                img {
                    width: 15px;
                    height: 15px;
                    color: $background-color;
                }
            }
        }
        .investment__detail__header_amount {
            display: flex;
            padding: 14px 0 14px 12px;
            // justify-content: space-between;
            .title {
                font-size: 12px;
                color: rgba($background-color, 0.6);
            }
            .content {
                font-size: 28px;
                color: $background-color;
            }
            .header_amount.left {
                margin-right: 50px;
                // flex: 4;
            }
            .header_amount.tag {
                position: absolute;
                right: 0;
                padding: 0 6px;
                height: 23px;
                background: $stop-tag-color;
                border-radius: 83px 0px 0px 83px;
                display: flex;
                justify-content: center;
                align-items: center;
                .span {
                    color: $background-color;
                    font-size: 12px;
                }
            }
        }
    }
    .investment__detail__card {
        padding: 12px;
        min-height: 107px;
        z-index: 999;
        margin: -85px 12px 10px;
        .card_title {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            img {
                width: 17px;
                height: 19px;
                margin-right: 6px;
            }
            span {
                font-size: 16px;
                color: $text-link-color;
                font-weight: 500;
            }
        }
        .card_content {
            .card_content_item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                .left {
                    color: $text-color6;
                    width: 90px;
                }
                .right {
                    color: $text-color;
                    text-align: right;
                    em {
                        font-style: normal;
                    }
                }
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }
    .investment__detail__tag {
        margin: 0 12px;
        display: flex;
        justify-content: space-evenly;
        .investment__detail__tag_item {
            display: flex;
            align-items: center;
            height: 48px;
            padding: 0 10px;
            img {
                width: 15px;
                height: 15px;
                margin-right: 6px;
            }
            span {
                color: $text-link-color;
            }
        }
    }
    .investment__detail__record {
        margin: 15px 12px;
    }
    .mt5 {
        margin-top: 5px;
    }
}
.card {
    background: $background-color;
    box-shadow: 0px 0px 4px 0px rgba(#000, 0.05);
    border-radius: 6px;
}
.has-color {
    height: 240px;
    background: linear-gradient(
        360deg,
        rgba($primary-color-line, 0) 0%,
        rgba(#2971f7, 1) 28%,
        rgba($primary-color, 1) 100%
    );
}
.no-color {
    height: 240px;
    background: linear-gradient(
        360deg,
        rgba(#d3d5da, 0) 0%,
        rgba($background-bottom-color, 1) 28%,
        rgba(#ced1d5, 1) 100%
    );
}
.gray-color {
    color: $text-color6 !important;
}
.black-color {
    color: $text-color !important;
}
.orange {
    background: $stop-tag-color !important;
}
.yellow {
    background: $sell-color !important;
}
</style>
