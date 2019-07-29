<template lang="pug">
.index
    .register(v-if="goRegister")
        img(src="@/assets/img/marketing/recruit-new-ch/logo2.png").logo
        .form
            van-field.bp-field(
                placeholder="手机号码"
                type='tel'
                clearable
                :maxlength="11" 
                v-model='form.phoneNumber')
                p(
                    slot="label"
                    class="label"
                    @click="showAreaCode = true")  +{{form.areaCode}}
                    van-icon(
                        name="play"
                        class="downIcon"
                        color="#353547"
                        size="14px")
            van-field.bp-field(
                placeholder="短信验证码"
                type="number"
                clearable
                :maxlength="6" 
                v-model='form.captcha'
                label='验证码')
                span(
                    slot="button"
                    :class="isSending || !isPhone ? '':'active'"
                    @click="getVerifyCode") {{sendText}}
            van-button.bp-btn(
                size='large'
                @click="submitHandler"
                :disabled="!registerBtnAct"
                :loading="loading"
                type='primary') 绑定账号
            p.hint 未注册账号的手机号码将自动完成注册
        .footerInfo
            p 注册即表示您同意
                a(:href="policyUrl") 《用户注册服务协议》
        van-popup(
            v-model="showAreaCode"
            position="bottom")
            van-picker(
                show-toolbar
                :columns="columns"
                value-key="name"
                :default-index="0"
                @cancel="onCancel"
                @confirm="onConfirm")  
    .result(v-if="goResult")
        img.successImg(src="@/assets/img/marketing/bind/succed.png")
        .info
            p 您的微信已经成功绑定友信智投账号
            p {{accountNum}}
        .coupon(v-if="hasRestCoupon")
            h4 您有待使用现金券
            p 请返回友信智投App,点击使用现金券
            p 即可领取奖励
        .footer
            p 如果需要解除当前绑定微信号，您可以在：友信智投APP
            p 个人中心-设置-账号安全，点击微信以解除绑定     
</template>
<script>
import { Icon, Popup, Picker, Toast, Dialog } from 'vant'
import {
    sendPhoneCaptcha,
    wechatBindPhoneNumber
} from '@/service/user-server.js'
import { getRestCoupon } from '@/service/product-server.js'
import LS from '@/utils/local-storage.js'
import { oauthRedirect, initOauth } from '@/utils/oauth2/wechat.js'
import { getParameter } from '@/utils/tools'
import { setToken } from '@/utils/http-request'

export default {
    data() {
        return {
            form: {
                areaCode: '86',
                captcha: '',
                phoneNumber: '',
                source: 3,
                unionId: '',
                forceBind: false //是否强制绑定当前微信
            },
            time: 60,
            sendText: '获取验证码',
            columns: [
                { id: '86', name: '+86 中国' },
                { id: '852', name: '+852 中国香港' },
                { id: '853', name: '+853 中国澳门' },
                { id: '886', name: '+886 中国台湾' },
                { id: '65', name: '+65 新加坡' }
            ],
            showAreaCode: false,
            isSending: false,
            // 注册按钮的loading
            loading: false,
            accountNum: '',
            goRegister: false, //显示绑定页
            goResult: false, //显示结果页
            hasRestCoupon: false //是否有未使用的现金券
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Toast.name]: Toast,
        [Dialog.name]: Dialog
    },
    computed: {
        // 产品许可协议
        policyUrl() {
            return (
                window.location.origin +
                '/webapp/market/generator.html?key=AGR008'
            )
        },
        isPhone() {
            return this.$reg.mobile(this.form.phoneNumber)
        },
        registerBtnAct() {
            return this.form.captcha !== '' && this.isPhone
        }
    },
    created() {
        this.$close()
    },
    // 进入页面前，先让用户进行授权，授权后若该用户已绑定手机则直接跳转成功绑定页，没有则进入绑定页
    beforeRouteEnter(to, from, next) {
        oauthRedirect()
        // 本地保存的code（说明之前已经请求过）和url上的code相同时不能再次请求，防止用户进行回退和刷新操作
        if (LS.get('code') != getParameter('code')) {
            Toast.loading({
                mask: true,
                message: '登入中...',
                duration: 0,
                position: 'center'
            })
            initOauth()
                .then(data => {
                    LS.put('code', getParameter('code'))
                    // 有电话号码代表已经绑定了
                    if (data.phoneNumber) {
                        // 电话号码中间4位隐藏
                        let reg =
                            data.phoneNumber.length == 11
                                ? /(\d{3})\d{4}(\d{4})/
                                : /(\d{2})\d{4}(\d+)/
                        let phone = data.phoneNumber.replace(reg, '$1****$2')
                        next(vm => {
                            vm.goRegister = false
                            vm.goResult = true
                            vm.accountNum = `+${data.areaCode + phone}`
                            LS.put('accountNum', vm.accountNum)
                            LS.put('userToken', data.webToken)
                            setToken(data.webToken)
                            vm.getRestCoupon()
                        })
                    } else {
                        // 没有电话号码则引导进行绑定
                        next(vm => {
                            vm.goRegister = true
                            vm.goResult = false
                            vm.form.unionId = data.unionid
                            LS.put('unionid', data.unionid)
                        })
                    }
                })
                .catch(e => {
                    e.msg && Toast(e.msg)
                })
        } else if (getParameter('code')) {
            if (LS.get('accountNum')) {
                next(vm => {
                    vm.goRegister = false
                    vm.goResult = true
                    vm.accountNum = LS.get('accountNum')
                })
            } else {
                next(vm => {
                    vm.goRegister = true
                    vm.goResult = false
                    vm.form.unionId = LS.get('unionid')
                })
            }
        }
    },
    methods: {
        // 手机区号的选择与取消
        onCancel() {
            this.showAreaCode = false
        },
        onConfirm(val) {
            this.form.areaCode = val.id
            this.showAreaCode = false
        },
        // 点击获取验证码
        async getVerifyCode() {
            if (!this.isSending) {
                await this.sendCaptcha()
            }
        },
        // 发送短信验证码
        async sendCaptcha() {
            try {
                await sendPhoneCaptcha(
                    this.form.phoneNumber,
                    this.form.areaCode,
                    '106'
                )
                // this.form.captcha = res.captcha
                let timer = setInterval(() => {
                    if (this.time > 1) {
                        this.sendText = '重新发送(' + --this.time + 's)'
                        this.isSending = true
                    } else {
                        this.time = 60
                        clearInterval(timer)
                        this.sendText = '获取验证码'
                        this.isSending = false
                    }
                }, 1000)
                this.$toast('短信发送成功')
                return true
            } catch (e) {
                e.msg && this.$toast(e.msg)
                return false
            }
        },
        // 绑定账号
        async submitHandler() {
            try {
                this.loading = true
                let res = await wechatBindPhoneNumber(this.form)
                this.goRegister = false
                this.goResult = true
                this.accountNum = `+${this.form.areaCode + res.phoneNumber}`
                LS.put('accountNum', this.accountNum)
                LS.put('userToken', res.webToken)
                setToken(res.webToken)
                this.getRestCoupon()
            } catch (e) {
                if (e.code === 301410) {
                    // 若该账号之前已绑定过其它微信，则询问用户是否更换绑定到目前微信
                    Dialog.confirm({
                        title: '',
                        message: `您的账号已绑定另一微信：${e.data.wechatNickName}<br/>请确认是否更换绑定到当前微信号？`
                    })
                        .then(() => {
                            this.form.forceBind = true
                            this.submitHandler()
                        })
                        .catch(() => {
                            // on cancel
                        })
                }
            } finally {
                this.loading = false
            }
        },
        // 获取是否有未使用的现金券
        async getRestCoupon() {
            try {
                this.hasRestCoupon = await getRestCoupon()
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.index {
    position: relative;
    height: 100%;
}
.register {
    padding: 7px 0;
    background: #fff;
    .logo {
        display: block;
        width: 180px;
        height: 53px;
        margin: 24px auto;
    }
    .base-color {
        color: $primary-color;
    }
    .form {
        .bp-field {
            line-height: 39px !important;
            span {
                color: $text-color5;
                font-size: 12px;
                &.active {
                    color: $primary-color;
                }
            }
            .label {
                font-size: 16px;
                color: #353547;
                .downIcon {
                    transform: rotate(90deg);
                    vertical-align: middle;
                    margin-left: 4px;
                    margin-top: -4px;
                }
            }
        }
        .hint {
            font-size: 12px;
            color: rgba(53, 53, 71, 0.5);
            line-height: 17px;
            text-align: center;
        }
        .bp-btn {
            display: block;
            width: 343px;
            margin: 50px auto 12px;
        }
    }
    .footerInfo {
        // position: absolute;
        // bottom: 60px;
        width: 100%;
        margin-top: 172px;
        font-size: 12px;
        color: rgba(53, 53, 71, 0.5);
        line-height: 17px;
        p {
            text-align: center;
        }
        a {
            color: #3c78fa;
        }
    }
}
.result {
    padding-top: 80px;
    .successImg {
        display: block;
        width: 99px;
        margin: 0 auto 12px;
    }
    .info {
        p {
            font-size: 0.4rem;
            color: #353547;
            line-height: 30px;
            text-align: center;
        }
    }
    .coupon {
        width: 270px;
        height: 84px;
        background: url('~@/assets/img/marketing/bind/couponBg.png') no-repeat
            center center;
        padding-top: 10px;
        margin: 28px auto 0;
        text-align: center;
        h4 {
            font-size: 0.32rem;
            font-weight: 500;
            color: #0055ff;
            line-height: 24px;
        }
        p {
            font-size: 0.24rem;
            color: #767787;
            line-height: 20px;
        }
    }
    .footer {
        position: absolute;
        bottom: 60px;
        width: 100%;
        p {
            font-size: 0.24rem;
            color: rgba(53, 53, 71, 0.5);
            line-height: 20px;
            text-align: center;
        }
    }
}
</style>
