<template lang="pug">
    .registerForm
        .title 註冊
        div.form
            .formItem
                label(@click="showAreaCode = true") +{{form.areaCode}}
                    van-icon(
                        name="play" 
                        size="12px" 
                        color="#393939" 
                        class="down")
                input(
                    placeholder="手機號碼" 
                    v-model="form.phoneNumber")
            .formItem
                input(
                    placeholder="手機驗證碼" 
                    v-model="form.captcha")
                .btn(
                    @click="sendCaptcha" 
                    :class="isSending || !isPhone ? 'btn-disabled':''") {{sendText}}
            .formItem
                label 邀請碼
                input(
                    v-model="form.inviteCode" 
                    :disabled="activityType == 'mgm'")
                span(v-if="activityType == 'recruit'") *可選填
            .formItem
                .registerBtn(
                    @click="submitHandler" 
                    :class="registerBtnAct ? 'registerBtnAct':''") 註冊
        div.otherloginway(v-if="showOtherLoginWay")
            .loginwaytitle 
                span 更多登入方式
            ul
                li(@click="facebookOauthRedirect") 
                    img(src="@/assets/img/marketing/recruit-new/Facebook.png")
                li(@click="jumpGoogle") 
                    img(src="@/assets/img/marketing/recruit-new/Google.png")
                li(@click="jumpWeixin") 
                    img(src="@/assets/img/marketing/recruit-new/WeChat.png")
        van-popup(
            v-model="showAreaCode" 
            position="bottom")
            van-picker(
                show-toolbar 
                :columns="columns"  
                :default-index="1"
                value-key="name"
                @cancel="onCancel"
                @confirm="onConfirm")   
</template>

<script>
import { Icon, Popup, Picker } from 'vant'
import { googleLogin } from '@/service/user-oversea-server.js'
import {
    checkPhoneV2,
    sendPhoneCaptcha,
    registerLogin,
    registerLoginById
} from '@/service/user-server.js'
import { oauthRedirect, initOauth } from '@/utils/oauth2/wechat.js'
import {
    facebookInitOauth,
    facebookOauthRedirect
} from '@/utils/oauth2/facebook-login.js'
import LS from '@/utils/local-storage.js'
import { setToken, setLangType } from '@/utils/http-request'
import { mapGetters } from 'vuex'
import $scriptjs from 'scriptjs'
import { getParameter } from '@/utils/tools'
import { isMobile } from '../utils/downLoadApp.js'
export default {
    data() {
        return {
            form: {
                areaCode: '852',
                captcha: '',
                phoneNumber: '',
                inviteCode: '',
                source: 11
            },
            thirdPartyId: '',
            timer: 0,
            time: 60,
            sendText: '發送短訊驗證',
            columns: [
                { id: '86', name: '+86 中國內地' },
                { id: '852', name: '+852 香港' },
                { id: '853', name: '+853 澳門' },
                { id: '886', name: '+886 臺灣' },
                { id: '65', name: '+65 新加坡' }
            ],
            showAreaCode: false,
            isSending: false,
            showOtherLoginWay: false,
            thirdCode: '',
            isRegister: false
        }
    },
    props: {
        activityType: {
            type: String,
            default: ''
        },
        inviteCode: {
            type: String,
            default: ''
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    created() {
        // 设置后台返回提示语为繁体
        setLangType(2)
        // pc端不显示第三方登录
        if (!isMobile()) {
            this.showOtherLoginWay = false
        }
        if (this.inviteCode) {
            this.form.inviteCode = this.inviteCode
        }
        this.thirdCode = getParameter('code') || this.$route.query.code
        if (!!this.thirdCode == true && this.thirdCode != LS.get('thirdCode')) {
            // this.showOtherLoginWay = false
            this.$loading('登入中...')
            // 微信登录
            initOauth()
                .then(data => {
                    data && this.handleRegister(data)
                })
                .catch(e => {
                    e.msg && this.$toast(e.msg)
                })
            // facebook登录
            facebookInitOauth()
                .then(data => {
                    data && this.handleRegister(data)
                })
                .catch(e => {
                    e.msg && this.$toast(e.msg)
                })
        }
        // 谷歌登录
        this.start()
    },
    computed: {
        ...mapGetters(['activityId', 'channelType', 'channelId']),
        isPhone() {
            return this.$reg.mobile(this.form.phoneNumber)
        },
        registerBtnAct() {
            return this.form.captcha != '' && this.isPhone
        }
    },
    methods: {
        // 加载google
        start() {
            $scriptjs(['https://apis.google.com/js/api:client.js'], () => {
                let gapi = window.gapi
                gapi &&
                    gapi.load('auth2', () => {
                        this.auth2 = gapi.auth2.init({
                            client_id:
                                '583502025628-1ht825l26h00tgjbm0n39qn0gqmergt3.apps.googleusercontent.com',
                            cookiepolicy: 'single_host_origin',
                            scope: 'profile'
                        })
                    })
            })
        },
        // 注册登录公共处理函数
        handleRegister(data) {
            LS.put('thirdCode', this.thirdCode)
            this.showOtherLoginWay = false
            let token = data.token || data.webToken
            if (token) {
                this.isRegister = true
                this.$close()
                this.$router.push({
                    name: 'done',
                    query: {
                        firstLogin: !this.isRegister
                    }
                })
                LS.put('userToken', token)
                LS.put('nickName', data.nickname)
                setToken(token)
                this.$store.dispatch('setUserInfo', {
                    inviteName: data.nickname,
                    userToken: token,
                    uuid: data.uuid
                })
            } else {
                this.thirdPartyId = data.thirdPartyId || data.unionid
                this.form.source = data.signInSource || 3
                this.$toast('您已登錄成功,請使用手機號註冊!')
            }
        },
        // 获取goole授权并进行登录
        jumpGoogle() {
            if (this.auth2) {
                this.auth2
                    .grantOfflineAccess()
                    .then(async authCode => {
                        let res = await googleLogin(authCode.code)
                        res && this.handleRegister(res)
                    })
                    .catch(e => {
                        e.msg && this.$toast(e.msg)
                    })
            } else {
                this.$toast('您的裝置暫不支持Google Play服務')
            }
        },
        // 获取微信授权
        jumpWeixin() {
            oauthRedirect()
        },
        // 获取facebook授权
        facebookOauthRedirect() {
            facebookOauthRedirect(() => {
                this.$toast('您的裝置暫不支持facebook')
            })
        },
        // 手机区号的选择与取消
        onCancel() {
            this.showAreaCode = false
        },
        onConfirm(val) {
            this.form.areaCode = val.id
            this.showAreaCode = false
        },
        // 发送短信验证码
        async sendCaptcha() {
            if (this.isPhone) {
                // 不可重复点击
                if (this.time < 60) {
                    return
                }
                try {
                    // 发注册验证码传101，发登录邀请码传106
                    let type = null
                    let data = await checkPhoneV2({
                        areaCode: this.form.areaCode,
                        phoneNumber: this.form.phoneNumber
                    })
                    this.isRegister = data.registered
                    type = this.isRegister ? 106 : 101

                    await sendPhoneCaptcha(
                        this.form.phoneNumber,
                        this.form.areaCode,
                        type
                    )
                    // this.form.captcha = captcha.captcha
                    await this.$toast('短信發送成功')
                    this.timer = setInterval(() => {
                        if (this.time > 1) {
                            this.time--
                            this.sendText = this.time + '秒後重新獲取'
                            this.isSending = true
                        } else {
                            this.time = 60
                            clearInterval(this.timer)
                            this.sendText = '發送短訊驗證'
                            this.isSending = false
                        }
                    }, 1000)
                } catch (e) {
                    e.msg && this.$toast(e.msg)
                }
            }
        },
        // 注册或登录
        async submitHandler() {
            if (this.registerBtnAct) {
                let uuid
                try {
                    let res = {}
                    if (this.thirdPartyId) {
                        this.form.enumPhoneCaptchaType = this.isRegister
                            ? 106
                            : 101
                        this.form.thirdPartyId = this.thirdPartyId
                        res = await registerLoginById(
                            this.form,
                            this.channelId,
                            this.channelType,
                            this.activityId
                        )
                    } else {
                        res = await registerLogin(
                            this.form,
                            this.channelId,
                            this.channelType,
                            this.activityId
                        )
                    }
                    LS.put('userToken', res.token)
                    LS.put('nickName', res.nickname)
                    setToken(res.token)
                    uuid = res.uuid
                    this.$store.dispatch('setUserInfo', {
                        inviteName: res.nickname,
                        userToken: res.token,
                        uuid: uuid
                    })
                    // 首次注册则引导用户进入下载页面
                    let registerParams = {}
                    registerParams = {
                        firstLogin: !this.isRegister
                    }
                    this.$router.push({
                        name: 'done',
                        query: registerParams
                    })
                } catch (e) {
                    e.msg && this.$toast(e.msg)
                } finally {
                    this.$receiveData &&
                        this.$receiveData('user_register', uuid)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font(
    $family: 'PingFangHK-Regular',
    $size: 0.24rem,
    $weight: 400,
    $color: #393939
) {
    font: {
        family: $family;
        size: $size;
        weight: $weight;
    }
    color: $color;
}
@mixin W-H($width, $height: auto) {
    width: $width;
    height: $height;
}
.registerForm {
    .title {
        line-height: 50px;
        margin: 24px 0 10px;
        @include font('PingFangHK-Medium', 0.72rem, 500, #393939);
    }
    .form {
        .formItem {
            margin-bottom: 15px;
            label {
                display: inline-block;
                line-height: 40px;
                @include W-H(74px, 40px);
                @include font('DINPro', 0.4rem, 400, #393939);
                .down {
                    transform: rotate(90deg);
                    margin-left: 7px;
                }
            }
            input {
                display: inline-block;
                @include W-H(250px, 42px);
                line-height: 42px;
                border: none;
                @include font($size: 0.36rem, $color: #393939);
                color: rgba(57, 57, 57, 1);
                text-indent: 4px;
                -webkit-appearance: none;
                outline: none;
                background: none;
                &::-webkit-input-placeholder {
                    // line-height: 25px;
                    @include font(
                        $size: 0.36rem,
                        $color: rgba(57, 57, 57, 0.4)
                    );
                }
            }
            &:nth-of-type(2) {
                display: flex;
                justify-content: space-between;
                input {
                    width: 207px;
                    border-bottom: 1px solid rgba(57, 57, 57, 0.05);
                }
                .btn {
                    // display: inline-block;
                    @include W-H(118px, 34px);
                    line-height: 34px;
                    border-radius: 4px;
                    // margin-left: 12px;
                    background: #2b4f80;
                    @include font($size: 0.28rem, $color: #fff);
                    text-align: center;
                }
                .btn-disabled {
                    background: rgba(226, 226, 226, 1);
                }
            }
            &:nth-of-type(3) {
                label {
                    @include font('PingFangHK-Light', 0.36rem, 300, #9a9a9a);
                }
                input {
                    width: 174px;
                    border: 1px solid rgba(57, 57, 57, 0.05);
                    border-radius: 4px;
                    margin-right: 4px;
                }
                span {
                    @include font('PingFangHK-Light', 0.28rem, 300, #0121dc);
                }
            }
            .registerBtn {
                @include W-H(335px, 44px);
                background: rgba(226, 226, 226, 1);
                line-height: 44px;
                border-radius: 4px;
                margin: 44px auto 57px;
                @include font($size: 0.32rem, $color: #fff);
                text-align: center;
            }
            .registerBtnAct {
                background: #2b4f80;
            }
        }
    }
    .otherloginway {
        position: relative;
        text-align: center;
        .loginwaytitle {
            &::before {
                position: absolute;
                top: 11px; /*调节线高*/
                left: 93px;
                display: block;
                @include W-H(150px, 2px);
                content: '';
                background-color: #999; /*颜色需与主题大背景色一致*/
            }
            span {
                position: relative;
                display: inline-block;
                padding: 0 10px;
                line-height: 17px;
                background: #fff;
                @include font($color: #393939);
            }
        }
        ul {
            display: flex;
            justify-content: space-between;
            margin: 34px 57px 18px;
            li {
                img {
                    @include W-H(40px, 40px);
                }
            }
        }
    }
}
</style>
