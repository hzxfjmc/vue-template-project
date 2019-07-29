<template lang="pug">
.register
    img.logo(src="@/assets/img/marketing/recruit-new-ch/logo2.png")
    .form
        van-field.bp-field(
            :placeholder="showOtherLoginWay ? '请输入手机号':'设置关联手机号'"
            type='tel'
            clearable
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
            span(
                slot="button"
                :class="isSending || !isPhone ? '':'active'"
                @click='getVerifyCode') {{sendText}}
        van-field.bp-field(
            placeholder="请输入手机验证码"
            type="number"
            clearable
            v-model='form.captcha'
            label='验证码')
        van-field.bp-field(
            readonly
            clearable
            v-model='form.inviteCode'
            label='推荐人')
        .hint
            van-icon(
                :name="isChooseed ? 'checked' :'passed'"
                color="#2F79FF"
                size="14px"
                class="chooseIcon"
                @click="isChooseed = !isChooseed")
            span.agree-text 同意并遵守
                a(:href="registerPolicy") 注册协议
                span 和
                a(:href="secretPolicy") 隐私权政策
        van-button.bp-btn(
            size='large'
            @click="submitHandler"
            :disabled="registerBtnAct ? false:true"
            :loading="loading"
            type='primary') {{showOtherLoginWay ? '注册登录':'完成绑定'}}
    div.otherloginway(v-if="showOtherLoginWay")
        .loginwaytitle
            span 第三方登录
        ul
            li(@click="jumpWeixin")
                img(src="@/assets/img/marketing/recruit-new-ch/WeChat.png")
            li(@click="jumpWeibo")
                img(src="@/assets/img/marketing/recruit-new-ch/weib.png")
            //- li(@click="facebookOauthRedirect")
            //-     img(src="@/assets/img/marketing/recruit-new-ch/FB.png")
            //- li(@click="jumpGoogle")
            //-     img(src="@/assets/img/marketing/recruit-new-ch/google.png")
    .footerInfo
        p 联系客服<b>4006261888</b>
        p 备案号：粤ICP备18145111号
        p “股市有风险，投资需谨慎”
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
    van-dialog.verify-code-box.base-dialog(
        v-model="showVerifyCodeImg"
        :close-on-click-overlay="true"
        title="请输入验证码"
        confirmButtonText="提交"
        :before-close="checkVerifyCode"
        @confirm="isClickConfirm = true")
        .content
            van-field.input-code(
                placeholder="输入验证码"
                v-model="verifyCode")
            img(
                :src="`${jyUrl}/verification-code-server/api/getCode/v1?key=${verifyCodeKey}`"
                @click="changeVerifyKey")

</template>
<script>
import { Icon, Popup, Picker, Dialog } from 'vant'
// import { googleLogin } from '@/service/user-oversea-server.js'
import {
    checkPhoneV2,
    registerLogin,
    registerLoginById,
    sendPhoneCaptchaV2
} from '@/service/user-server.js'
import { oauthRedirect, initOauth } from '@/utils/oauth2/wechat.js'
// import {
//     facebookInitOauth,
//     facebookOauthRedirect
// } from '@/utils/oauth2/facebook-login.js'
import { weiboInitOauth, weiboOauthRedirect } from '@/utils/oauth2/weibo.js'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
import { receiveData } from '@/utils/analysis/index.js'
import { mapGetters } from 'vuex'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
import { getVerifyCodeKey } from '@/utils/tools'
// import $scriptjs from 'scriptjs'
import { getParameter } from '@/utils/tools'
// 生成图形验证码key的模块名称
const moduleKey = 'marketing_new'

export default {
    data() {
        return {
            form: {
                areaCode: '86',
                captcha: '',
                phoneNumber: '',
                inviteCode: '',
                source: 11
            },
            thirdPartyId: '',
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
            showOtherLoginWay: true,
            isChooseed: true,
            verifyCodeKey: getVerifyCodeKey(moduleKey),
            // 是否展示验证码图片
            showVerifyCodeImg: false,
            // 输入的验证码
            verifyCode: '',
            // 是否展示注册成功弹窗
            showSuccess: false,
            jyUrl: API_BASE_URL.JY,
            loading: false,
            isClickConfirm: false, //输入验证码时判断的是点击蒙层还是确认按钮
            isRegister: false,
            thirdCode: ''
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Dialog.name]: Dialog
    },
    created() {
        let token = this.userInfo.userToken
        if (token) {
            this.$router.replace({
                path: '/index'
            })
        }
        this.form.inviteCode = this.inviteCode
        this.thirdCode = getParameter('code') || this.$route.query.code

        if (!!this.thirdCode == true && this.thirdCode != LS.get('thirdCode')) {
            this.showOtherLoginWay = false
            this.$loading('登入中...')
            // 微信登录
            initOauth()
                .then(data => {
                    data && this.handleRegister(data)
                })
                .catch(e => {
                    this.$toast(e.msg)
                })
            // 微博登录
            weiboInitOauth()
                .then(data => {
                    data && this.handleRegister(data)
                })
                .catch(e => {
                    e.msg && this.$toast(e.msg)
                })

            // // facebook登录
            // facebookInitOauth()
            //     .then(data => {
            //         data && this.handleRegister(data)
            //     })
            //     .catch(e => {
            //         e.msg && this.$toast(e.msg)
            //     })
        }
        // 谷歌登录
        // this.start()
    },
    computed: {
        ...mapGetters(['userInfo', 'activityId']),
        inviteCode() {
            return this.$store.getters.userInfo.inviteCode
        },
        isPhone() {
            return this.$reg.mobile(this.form.phoneNumber)
        },
        registerBtnAct() {
            return this.form.captcha != '' && this.isPhone && this.isChooseed
        },
        // 注册协议地址
        registerPolicy() {
            return (
                window.location.origin +
                '/webapp/market/generator.html?key=AGR006'
            )
        },
        // 隐私权政策地址
        secretPolicy() {
            return (
                window.location.origin +
                '/webapp/market/generator.html?key=AGR007'
            )
        }
    },
    methods: {
        // // 加载google
        // start() {
        //     $scriptjs(['https://apis.google.com/js/api:client.js'], () => {
        //         let gapi = window.gapi
        //         gapi &&
        //             gapi.load('auth2', () => {
        //                 this.auth2 = gapi.auth2.init({
        //                     client_id:
        //                         '583502025628-1ht825l26h00tgjbm0n39qn0gqmergt3.apps.googleusercontent.com',
        //                     cookiepolicy: 'single_host_origin',
        //                     scope: 'profile'
        //                 })
        //             })
        //     })
        // },
        // 注册登录公共处理函数
        handleRegister(data) {
            LS.put('thirdCode', this.thirdCode)
            this.showOtherLoginWay = false
            let token = data.token || data.webToken
            if (token) {
                this.$close()
                this.$router.push({
                    name: 'index'
                })
                this.$store.dispatch('setUserInfo', {
                    userToken: token,
                    uuid: data.uuid
                })
                LS.put('userToken', token)
                setToken(token)
            } else {
                this.thirdPartyId =
                    data.thirdPartyId || data.unionid || data.weiboUid
                this.form.source = data.signInSource
                this.$toast('您已登录成功,请使用手机号注册!')
            }
        },
        // // 获取goole授权并进行登录
        // jumpGoogle() {
        //     if (this.auth2) {
        //         this.auth2
        //             .grantOfflineAccess()
        //             .then(async authCode => {
        //                 let res = await googleLogin(authCode.code)
        //                 res && this.handleRegister(res)
        //             })
        //             .catch(e => {
        //                 e.msg && this.$toast(e.msg)
        //             })
        //     } else {
        //         this.$toast('您的装置暂不支持Google Play服务')
        //     }
        // },
        // // 获取facebook授权
        // facebookOauthRedirect() {
        //     facebookOauthRedirect(() => {
        //         this.$toast('您的装置暂不支持facebook')
        //     })
        // },
        // 获取微信授权
        jumpWeixin() {
            oauthRedirect()
        },
        // 获取微博授权
        jumpWeibo() {
            weiboOauthRedirect()
        },
        // 手机区号的选择与取消
        onCancel() {
            this.showAreaCode = false
        },
        onConfirm(val) {
            this.form.areaCode = val.id
            this.showAreaCode = false
        },
        // 校验手机号是否正确
        async checkPhone() {
            try {
                let res = await checkPhoneV2({
                    areaCode: this.form.areaCode,
                    phoneNumber: this.form.phoneNumber
                })
                this.isRegister = res.registered
                return true
            } catch (e) {
                if (e.code == 300309) {
                    this.$toast('请输入正确的手机号码')
                }
                return false
            }
        },
        // 获取图形验证码
        async getVerifyCode() {
            if (!this.isSending) {
                if (!this.isPhone) {
                    this.$toast('请输入正确的手机号码')
                    return
                }
                let isTruePhone = await this.checkPhone()
                if (!isTruePhone) {
                    return
                }

                this.changeVerifyKey()
                this.verifyCode = ''
                this.showVerifyCodeImg = true
            }
        },
        // 更换验证码
        changeVerifyKey() {
            this.verifyCodeKey = getVerifyCodeKey(moduleKey)
        },
        // 校验图形验证码
        async checkVerifyCode(action, done) {
            if (this.isClickConfirm) {
                this.isClickConfirm = false
                if (!this.verifyCode) {
                    this.$toast('请输入短信验证码')
                    done(false)
                    return
                }
                let isSuccess = await this.sendCaptcha()
                done(isSuccess)
                isSuccess && (await this.$toast('短信发送成功'))
            } else {
                done(true)
            }
        },
        // 发送短信验证码
        async sendCaptcha() {
            try {
                await sendPhoneCaptchaV2({
                    phoneNumber: this.form.phoneNumber,
                    areaCode: this.form.areaCode,
                    type: this.isRegister ? 106 : 101,
                    key: this.verifyCodeKey,
                    graphCaptcha: this.verifyCode
                })
                // this.form.captcha = captcha.captcha

                let timer = setInterval(() => {
                    if (this.time > 1) {
                        this.sendText = --this.time + '秒后重新获取'
                        this.isSending = true
                    } else {
                        this.time = 60
                        clearInterval(timer)
                        this.sendText = '重新发送'
                        this.isSending = false
                    }
                }, 1000)
                return true
            } catch (e) {
                e.msg && this.$toast(e.msg)
                return false
            }
        },
        // 注册或登录
        async submitHandler() {
            let uuid = -1
            if (this.registerBtnAct && !this.loading) {
                try {
                    this.loading = true
                    let res = {}
                    if (this.thirdPartyId) {
                        this.form.enumPhoneCaptchaType = this.isRegister
                            ? 106
                            : 101
                        this.form.thirdPartyId = this.thirdPartyId
                        res = await registerLoginById(
                            this.form,
                            '',
                            'm',
                            this.activityId
                        )
                    } else {
                        res = await registerLogin(
                            this.form,
                            '',
                            'm',
                            this.activityId
                        )
                    }
                    this.$store.dispatch('setUserInfo', {
                        userToken: res.token,
                        uuid: res.uuid
                    })
                    uuid = res.uuid
                    LS.put('userToken', res.token)
                    setToken(res.token)
                    window.location.href = `${window.location.origin}/webapp/marketing/new-ch-outer.html?ICode=${res.invitationCode}&id=${this.activityId}&nickname=${res.nickname}#/index`
                } catch (e) {
                    e.msg && this.$toast(e.msg)
                } finally {
                    this.loading = false
                    receiveData('user_register', uuid)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.register {
    padding: 7px 0;
    background: #fff;
    .logo {
        width: 180px;
        margin: 17px auto 24px;
        display: block;
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
            padding-left: 14px;
            padding-top: 5px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(53, 53, 71, 0.5);
            line-height: 17px;
            .chooseIcon {
                // margin-top: 4px;
                vertical-align: middle;
            }
            .agree-text {
                margin-left: 4px;
                vertical-align: middle;
                a {
                    color: #3c78fa;
                }
            }
        }
        .bp-btn {
            display: block;
            width: 343px;
            margin: 30px auto;
        }
    }
    .otherloginway {
        position: relative;
        text-align: center;
        .loginwaytitle {
            &::before {
                position: absolute;
                top: 11px;
                left: 116px;
                display: block;
                width: 150px;
                height: 2px;
                content: '';
                background-color: rgba(225, 225, 225, 0.5);
            }
            span {
                position: relative;
                display: inline-block;
                padding: 0 8px;
                line-height: 20px;
                background: #fff;
                font-size: 0.24rem;
                color: rgba(53, 53, 71, 0.5);
            }
        }
        ul {
            display: flex;
            justify-content: space-between;
            width: 150px;
            margin: 15px auto 24px;
            li {
                img {
                    width: 55px;
                    height: 55px;
                }
            }
        }
    }
    .footerInfo {
        font-size: 0.24rem;
        color: rgba(53, 53, 71, 0.2);
        line-height: 17px;
        text-align: center;
        p {
            margin-bottom: 4px;
            &:nth-of-type(1) {
                font-size: 14px;
                color: rgba(53, 53, 71, 0.5);
                line-height: 20px;
                b {
                    color: #3c78fa;
                }
            }
        }
    }
    .base-dialog {
        border-radius: 20px;
    }
    .verify-code-box {
        width: 323px !important;
        .content {
            margin-top: 20px;
            padding: 0 20px 20px;
            display: flex;
            justify-content: space-between;
            .input-code {
                width: 181px;
                height: 50px;
                border: 1px solid $hk-text-color2;
            }
            img {
                width: 92px;
                height: 50px;
            }
        }
    }
}
</style>
