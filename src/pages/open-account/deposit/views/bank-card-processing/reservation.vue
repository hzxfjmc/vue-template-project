<template lang="pug">
    #reservation-container
        <!--.progress-bar-->
            <!--.current-progress-->
            <!--.txt 开户进度20%-->
        .form-wrapper
            h2.title {{pageType==='add'? '填写预约信息':'修改预约信息'}}
            h3.sub-title 请填写真实有效的预约信息，方便办卡专员与您联系
            .from
                van-cell-group
                    van-field(
                    label="银行"
                    disabled
                    v-model="formData.bankName"
                    )
                    van-field(
                        label="姓名"
                        placeholder="请输入姓名"
                        v-model="formData.chineseName"
                        )
                        a.sex(
                            v-bind:class="{'active':formData.sex ===0}"
                            href="javascript:;"
                            slot="button"
                            @click="chooseSex(0)"
                        ) 先生
                        a.sex(
                            v-bind:class="{'active':formData.sex ===1}"
                            href="javascript:;"
                            slot="button"
                            @click="chooseSex(1)"
                        ) 女士
                    van-field(
                        v-model="formData.userPhone"
                        label="联系方式"
                        placeholder="请输入联系电话")
                    van-field(
                        class='contact-time'
                        label="预约沟通时间"
                        placeholder="请填写您的预约时间"
                        v-model="formData.contactTimeView"
                        disabled
                        @click.native="showDateDialog"
                        )
                        van-icon(name="arrow-down" size="20px" slot="icon")
                    .order-message *预约成功后，客户经理将在指定时间内与您联系
                    van-field(
                        class='remark-msg'
                        v-model="formData.remark"
                        label="备注信息"
                        type="textarea"
                        placeholder="可不填")
                        span.text-num( slot="icon") {{formData.remark.length}}/50
        .btn-wrapper(v-if="pageType ==='edit'")
            van-button(
                size="large"
                type="primary"
                @click="cancelReservation"
                class="sbtn"
            ) 取消预约
            van-button(
                size="large"
                type="primary"
                :disabled="disabled"
                class="sbtn"
                @click="update"
            ) 修改预约
        van-button(
            v-if="pageType ==='add'"
            size="large"
            type="primary"
            class="btn"
            :disabled="disabled"
            @click="submit"
        ) 提交预约
        van-popup(
            v-model="show"
            position ="bottom")
            van-picker(
                show-toolbar
                :columns="columns"
                @cancel="onCancel"
                @confirm="onConfirm"
                @change="onChange"
            )
        reservation-dialog(ref='reservation-dialog')
        van-dialog(
        v-model="showDialog"
        show-confirm-button
        :before-close="beforeClose"
        confirm-button-text="我知道了"
        )
            .confirm-text-box
                p {{alertTips}}
                p 如有疑问，请联系客服！
</template>

<script>
/**
 * 预约办理香港银行卡-预约
 * @ Author LINJAIJUN
 * @ Date 2018/12/25
 */
import { mapGetters } from 'vuex'
import { Icon, Popup, Picker, Dialog } from 'vant'
import reservationDialog from '../../components/reservation-dialog'
import common from '../../util/common'
import { buryingReservebankcard } from '@/utils/burying-point'

export default {
    props: ['pageType', 'formData'],
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Dialog.name]: Dialog,
        reservationDialog
    },
    data() {
        return {
            alertTips: '',
            showDialog: false,
            pageShow: false,
            show: false,
            days: [],
            viewTimeList: [],
            isClicked: false,
            columns: [
                {
                    values: []
                },
                {
                    values: []
                }
            ],
            reseId: '',
            rules: {
                bankName: '',
                chineseName: '',
                contactTimeView: '',
                userPhone: ''
            },
            dateList: []
        }
    },
    computed: {
        ...mapGetters(['user']),
        disabled() {
            return Object.keys(this.rules).some(key => !this.formData[key])
        }
    },
    watch: {
        'formData.remark'(val) {
            if (val.length > 50) {
                this.formData.remark = val.slice(0, 50)
            }
        },
        'formData.chineseName'(val) {
            if (!val) {
                this.formData.sex = 0
            }
            if (val.length > 50) {
                this.formData.chineseName = val.slice(0, 50)
            }
        },
        'formData.userPhone'(val) {
            if (val.length > 50) {
                this.formData.userPhone = val.slice(0, 50)
            }
        }
    },
    methods: {
        reloadPage() {
            this.closePopup()
            this.$emit('getBankList')
            this.pageShow = false
        },
        async submit() {
            try {
                if (this.isClicked) return false
                this.isClicked = true
                this.formData.contactTime = this.formData.contactTimeValue
                let params = Object.assign(
                    { userId: this.user.userId },
                    this.formData
                )
                await this.$depositService.newReservation(params)
                buryingReservebankcard(this.$route.query.referrer)
                this.isClicked = false
                this.$refs['reservation-dialog'].show({
                    content: this.formData.contactTimeView,
                    closeCallback: () => {
                        this.reloadPage()
                    }
                })
            } catch (e) {
                this.isClicked = false
                if (e.code === 408968) {
                    this.alertTips = '抱歉，已有预约，请取消后重新预约'
                    this.showDialog = true
                } else {
                    this.$toast(e.msg || '预约失败')
                }
            }
        },
        async update() {
            try {
                this.formData.contactTime = this.formData.contactTimeValue
                let params = Object.assign(
                    { status: 1, reseId: this.formData.reseId },
                    this.formData
                )
                await this.$depositService.editReservation(params)
                this.$toast('修改成功')
                this.reloadPage()
            } catch (e) {
                this.$toast(e.msg || '修改失败')
            }
        },
        cancelReservation() {
            this.$confirm({
                // title: '温馨提示',
                message: '确认取消预约？',
                confirmButtonText: '确认取消',
                cancelButtonText: '保留预约'
            })
                .then(async () => {
                    try {
                        let params = Object.assign(
                            { status: 3, reseId: this.formData.reseId },
                            this.form
                        )
                        await this.$depositService.editReservation(params)
                        this.$toast('取消成功')
                        this.reloadPage()
                    } catch (e) {
                        this.$toast(e.msg || '取消失败')
                    }
                })
                .catch(() => {})
        },
        chooseSex(val) {
            this.formData.sex = val
        },
        beforeClose(action, done) {
            if (action === 'confirm') {
                done()
                this.reloadPage()
            } else {
                done()
            }
        },
        closePopup() {
            this.$emit('closePopup')
        },
        onCancel() {
            this.show = false
        },
        onConfirm(value, index) {
            this.show = false
            let dateValue = this.dateList[index[0]].value
            let timeValue = value[1]
            this.formData.contactTime = value.join(' ')
            this.formData.contactTimeView = value.join(' ')
            this.formData.contactTimeValue = `${dateValue}&${timeValue}`
        },
        onChange(picker, value) {
            if (value[0]) {
                let arr = value[0].match(/(\d{4}).+(\d{2}).+(\d{2})/)
                let day = new Date().getDate()
                if (Number(day) === Number(arr[3])) {
                    picker.setColumnValues(1, common.getTime())
                } else {
                    picker.setColumnValues(1, common.getTime(true))
                }
            }
        },
        showDateDialog() {
            this.show = true
        }
    },
    created() {
        this.pageShow = true
        let dayObj = common.getDays()
        this.columns[0].values = dayObj.days
        this.dateList = dayObj.dateList
        this.columns[1].values = common.getTime()
    },
    updated() {
        this.pageShow = true
    }
}
</script>
<style lang="scss">
#reservation-container {
    .btn-wrapper {
        margin-top: 15px;
        text-align: center;
        .sbtn {
            width: 40%;
            height: 44px;
            line-height: 44px;
            &:first-child {
                color: #353547;
                background: #fff;
                margin-right: 30px;
                opacity: 0.5;
                border: 1px solid rgba(53, 53, 71, 1);
            }
        }
    }
    .van-cell {
        padding-left: 0;
    }
    .van-cell:not(:last-child)::after {
        content: ' ';
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        border-bottom: 1px solid #ebedf0;
    }
    .van-cell__title {
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.7);
        width: 90px;
    }
    .van-picker__cancel {
        color: rgba(53, 53, 71, 1);
    }
    .van-cell.contact-time::after {
        border-bottom: none !important;
    }
    .remark-msg {
        border-top: 1px solid #ebedf0;
    }
}
.confirm-text-box {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    p:last-child {
        margin-top: 10px;
    }
}
</style>
<style scoped lang="scss">
.progress-bar {
    width: 100%;
    height: 24px;
    position: relative;
    background: linear-gradient(
        270deg,
        rgba(34, 109, 221, 0.4007) 0%,
        rgba(40, 90, 200, 0.4007) 100%
    );
    .current-progress {
        position: absolute;
        width: 97px;
        height: 100%;
        background: linear-gradient(
            270deg,
            rgba(34, 109, 221, 1) 0%,
            rgba(40, 90, 200, 1) 100%
        );
    }
    .txt {
        position: absolute;
        height: 100%;
        width: 100%;
        line-height: 24px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(241, 243, 248, 1);
        text-align: center;
        z-index: 2;
    }
}
.btn {
    position: fixed;
    width: 100%;
    height: 48px;
    background: rgba(40, 90, 200, 1);
    border-radius: unset !important;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    bottom: 0;
    left: 0;
}
.form-wrapper {
    padding: 14px;
    font-size: 12px;
    .title {
        font-size: 18px;
        font-weight: 500;
    }
    .sub-title {
        opacity: 0.5;
    }
    .from {
        margin-top: 33px;
        .sex {
            display: inline-block;
            width: 46px;
            height: 25px;
            line-height: 25px;
            border-radius: 4px;
            font-weight: 400;
            border: 1px solid rgba(225, 225, 225, 1);
            text-align: center;
            color: rgba(53, 53, 71, 0.5);
            &:first-child {
                margin-right: 10px;
            }
            &.active {
                background: rgba(60, 120, 250, 0.05);
                border: 1px solid rgba(60, 120, 250, 1);
                color: rgba(60, 120, 250, 1);
            }
        }
        .text-num {
            color: rgba(53, 53, 71, 0.2);
        }
        .order-message {
            font-size: 12px;
            font-weight: 400;
            color: rgba(53, 53, 71, 0.5);
            line-height: 20px;
            padding-bottom: 10px;
        }
    }
}
</style>
