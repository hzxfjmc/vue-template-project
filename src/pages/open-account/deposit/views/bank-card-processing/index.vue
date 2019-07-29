<template lang="pug">
    .full-height.flex-fixed.bank-card-container
        van-tabs(
        :line-width ="28"
        :line-height="2"
        :sticky ="true"
        v-model="active"
        @click="onClick"
        )
            van-tab(title="大陆办理")
            van-tab(title="香港办理")
        .banner-box(:class="{'dl':active === 0}")
        .scroll-able.flex-fixed-container
            .bank-card-list(v-if="bankCardList.length")
                .bank-card-item(v-for="item in bankCardList" @click="gotoReservationGuide(item.jumpUrl)")
                    .top
                        .item-left
                            .bank-icon(:class="{'bank-bdn':!item.imgLoad}")
                                img(:src="item.imgLoad ? item.logoUrl : '/webapp/open-account/open-account/bank-icon/bank_normal@2x.png'")
                            .bank-title {{item.bankName}}
                            .bank-recommend(v-if="item.identification") {{item.identification}}
                        .item-right
                            .btn.btn-online(@click.stop="goReservation(item)" :class="{active:item.status}") {{item.status ? '查看预约':'预约'}}
                    .bottom.bottom-title
                        .b-item
                            .title 办卡城市
                        .b-item
                            .title 办卡门槛
                        .b-item
                            .title 办卡周期
                    .bottom.bottom-content
                        .b-item
                            .content
                                p(v-for="subItem in item.city.split(',')") {{subItem}}
                        .b-item
                            .content
                                p(v-for="subItem in item.threshold.split(',')") {{subItem}}
                        .b-item
                            .content
                                p(v-for="subItem in item.cycle.split(',')") {{subItem}}
            .no-data(v-else) 敬请期待
            .more-guide-box(v-if="active === 0")
                .title 更多银行办卡指引：
                .more-guide-line
                    .list-item(v-for="item in guideLineList" :key="item.key" @click="goGuideLine(item.key)")
                        .bank-icon
                            img(:src="`/webapp/open-account/open-account/bank-icon/${item.bankIcon}@2x.png`")
                        .bank-name {{item.bankName}}
                        van-icon(name="arrow" class="icon")
        .popup-box
            van-popup(v-model="show" position="bottom" overlay-class="reservation-box")
                .content
                    reservation(
                    :pageType="pageType"
                    :formData="formData"
                    v-on:closePopup="closePopup"
                    v-on:getBankList="getBankList"
                    )
</template>

<script>
/**
 * 预约办理香港银行卡-首页
 * @ Author LINJAIJUN
 * @ Date 2018/12/25
 */
import { mapGetters } from 'vuex'
import { Popup, Icon } from 'vant'
import reservation from './reservation'
import jsBridge from '@/utils/js-bridge.js'
import { getCosUrl } from '@/utils/cos-utils.js'
import common from '../../util/common'
export default {
    components: {
        [Popup.name]: Popup,
        [Icon.name]: Icon,
        reservation
    },
    data() {
        return {
            show: false,
            active: 0,
            place: 2, // 1-香港办理 2-大陆办理
            bankCardList: [],
            pageType: '', // edit-查看预约 add-添加预约
            formData: {
                bankAscription: '', // 银行归属 1-大陆 2-香港
                bankName: '',
                bankMark: '',
                chineseName: '',
                contactTime: '',
                contactTimeValue: '',
                contactTimeView: '',
                remark: '',
                sex: 0, // 性别 0-男 1-女
                userPhone: ''
            },
            dateList: [],
            days: [],
            viewTimeList: [],
            guideLineList: [
                {
                    bankName: '建设银行',
                    key: 'XY016',
                    bankIcon: 'jianshe'
                },
                {
                    bankName: '渣打银行',
                    key: 'XY017',
                    bankIcon: 'zhada'
                },
                {
                    bankName: '星展银行',
                    key: 'XY018',
                    bankIcon: 'xingzhan'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        goGuideLine(key) {
            let url =
                location.origin + `/webapp/market/generator.html?key=${key}`
            this.$jsBridge.gotoNewWebview(url)
        },
        gotoReservationGuide(url) {
            if (url) {
                this.$jsBridge.gotoNewWebview(url)
            }
        },
        resetForm() {
            this.formData = {
                bankAscription: '', // 银行归属 1-大陆 2-香港
                bankName: '',
                bankMark: '',
                chineseName: '',
                contactTime: '',
                contactTimeValue: '',
                contactTimeView: '',
                remark: '',
                sex: 0, // 性别 0-男 1-女
                userPhone: ''
            }
        },
        closePopup() {
            this.show = false
        },
        onClick(index) {
            this.place = index === 0 ? 2 : 1
            this.active = index
            this.getBankList()
        },
        async goReservation(item) {
            this.resetForm()
            this.show = true
            this.pageType = item.status === 1 ? `edit` : `add`
            this.formData.bankName = item.bankName
            this.formData.bankMark = item.id
            this.formData.bankAscription = this.place
            this.formData.userPhone = this.user.phoneNumber
            this.formData.contactTimeView =
                this.dateList[0].label + this.viewTimeList[0]
            this.formData.contactTimeValue =
                this.dateList[0].value + '&' + this.viewTimeList[0]
            if (this.pageType === 'edit') {
                await this.queryInfoBank()
            } else {
                await this.getUserName()
            }
        },
        async getUserName() {
            try {
                let data = await this.$depositService.getOpenAccountBasicInfo()
                this.formData.chineseName = `${data.realName ||
                    data.realNameEn}`
                this.formData.sex = data.genderValue || 0
                this.formData.userPhone = this.user.phoneNumber
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async queryInfoBank() {
            try {
                let params = {
                    bankMark: this.formData.bankMark,
                    status: 1, // 1-待联系、2-已联系、3-已撤销、4-无法联系
                    userId: this.user.userId || this.$constant.userId
                }
                let data = await this.$depositService.queryInfoBank(params)
                data.contactTimeView = common.parseContactTimeToView(
                    data.contactTime
                )
                this.formData = data
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async getBankList() {
            try {
                let params = {
                    place: this.place
                }
                let bankCardList = await this.$depositService.bankCardList(
                    params
                )
                bankCardList.forEach(async item => {
                    let params = {
                        bankMark: item.id,
                        status: 1, // 1-待联系、2-已联系、3-已撤销、4-无法联系
                        userId: this.user.userId || this.$constant.userId
                    }
                    item.status = ''
                    let data = await this.$depositService.queryInfoBank(params)
                    item.status = data ? data.status : ''
                })
                bankCardList.forEach(async item => {
                    if (item.logoUrl) {
                        item.imgLoad = false
                        await getCosUrl(item.logoUrl).then(res => {
                            console.log(item.logoUrl)
                            item.logoUrl = res
                            let img = new Image()
                            img.src = item.logoUrl
                            img.onload = () => {
                                item.imgLoad = true
                            }
                            console.log(item.logoUrl)
                        })
                    }
                })
                this.bankCardList = bankCardList
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
        window.h5ClosePage = () => {
            if (this.show) {
                this.closePopup()
            } else {
                jsBridge.callApp('command_close_webview')
            }
            return true
        }
        let dayObj = common.getDays()
        this.days = dayObj.days
        this.dateList = dayObj.dateList
        this.viewTimeList = common.getTime()
        this.getBankList()
    }
}
</script>

<style lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.popup-box > .van-popup--bottom {
    top: 0;
}
.bank-card-container {
    .van-tab {
        font-size: 14px;
        color: $tip-color;
        font-weight: 400;
    }
    .van-tab--active {
        color: $primary-color;
        font-weight: 500;
    }
    .van-tabs__line {
        background: $primary-color;
        border-radius: 1px;
    }
}
</style>
<style scoped lang="scss">
.more-guide-box {
    padding: 0 10px 10px;
    .title {
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: $title-color5;
        padding-bottom: 10px;
    }
    .more-guide-line {
        padding: 0 10px;
        border-radius: 4px;
        background: #fff;
        .list-item {
            display: flex;
            align-items: center;
            position: relative;
            padding: 10px 0;
            border-bottom: 1px solid $border-color5;
            &:last-child {
                border-bottom: none;
            }
            .bank-name {
                max-width: 80%;
                margin-left: 6px;
            }
            .icon {
                position: absolute;
                right: 10px;
                color: $tip-color25;
            }
        }
    }
}
.no-data {
    text-align: center;
    padding: 10px;
}
.bank-card-container {
    background: $background-bottom-color;
}
.banner-box {
    width: 100%;
    height: 150px;
    background: url('/webapp/open-account/open-account/deposit/reservation-banner.png')
        no-repeat;
    background-size: cover;
    border-radius: 4px;
}
.banner-box.dl {
    background: url('/webapp/open-account/open-account/deposit/reservation-banner-dl.png')
        no-repeat;
    background-size: cover;
}
.bank-card-list {
    padding: 10px;
    .bank-card-item {
        min-height: 144px;
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        &:last-child {
            margin-bottom: 0;
        }
        .top {
            padding: 13px 18px 0 13px;
            overflow: hidden;
        }
        .item-left {
            float: left;
            display: -webkit-flex;
            display: flex;
            line-height: 40px;
            width: 80%;
        }
        .bank-title {
            margin-left: 5px;
            max-width: 34%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .bank-recommend {
            margin: 11px 0 0 5px;
            padding: 0 3px;
            height: 18px;
            max-width: 34%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            background: rgba(245, 93, 131, 1);
            border-radius: 2px;
            font-size: 12px;
            color: rgba(255, 255, 255, 1);
            line-height: 18px;
            text-align: center;
        }
        .item-right {
            float: right;
        }
        .btn-online {
            margin-top: 4px;
            width: 58px;
            height: 24px;
            border-radius: 2px;
            text-align: center;
            font-size: 12px;
            line-height: 23px;
            font-weight: 400;
            color: $primary-color;
            border: 1px solid $primary-color;
            &.active {
                color: $text-active-color;
                border: 1px solid $text-active-color;
            }
        }
        .bottom-title {
            margin-top: 20px;
        }
        .bottom-content {
            margin-top: 5px;
        }
        .bottom {
            display: flex;
            display: -webkit-flex;
            justify-content: space-around;
            align-items: center;
            .b-item {
                flex: 1;
                overflow: hidden;
                text-align: center;
                .title {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 20px;
                    opacity: 0.5;
                }
                p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>
