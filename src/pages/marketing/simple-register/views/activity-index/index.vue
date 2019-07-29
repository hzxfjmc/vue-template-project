<template lang="pug">
    .section
        header
            .top
                img(src="@/assets/img/marketing/recruit-new-ch/logo.png")
        .getInfo(v-if="isRegister")
            p Dear {{nickname}}
            p 奖励已发放到您的友信智投账户，请前往APP查收
            .btn(@click="goApp") 前往APP查收奖励
        register-form-ch.registerForm(
            v-if="!isRegister"
            :activityId="activityId"
            :channel="channel"
            :channelId="channelId"
            :inviteCode="inviteCode"
            @registerSuccess="handleRegisterSuccess")
        .info
            p.hint 股市有风险，投资需谨慎
</template>

<script>
import registerFormCh from '../../../components/register-form-ch/index'
import { getMyRewardInfo } from '@/service/customer-relationship-server.js'
import LS from '@/utils/local-storage.js'
import { getParameter } from '@/utils/tools'

export default {
    data() {
        return {
            isRegister: false,
            nickname: '',
            activityId: '',
            channel: '',
            channelId: '',
            inviteCode: '',
            userUuid: ''
        }
    },
    created() {
        // 获取活动渠道和活动id及邀请码
        let id = getParameter('id') || getParameter('register-cid') || '1009'
        this.activityId = id
        this.channel = getParameter('register-ct')
        this.channelId = getParameter('register-cid')
        this.inviteCode = getParameter('code')
        if (LS.get('userToken')) {
            this.getUserInfo()
        }
    },
    components: {
        //  注册组件
        registerFormCh
    },
    methods: {
        // 获取当前用户信息
        async getUserInfo(name) {
            try {
                let data = await getMyRewardInfo(this.activityId)
                if (name) {
                    this.isRegister = true
                    this.nickname = name
                } else {
                    this.isRegister = data.registered
                    this.nickname = data.nickname
                }
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        //注册成功
        handleRegisterSuccess(data) {
            this.userUuid = data.uuid
            this.getUserInfo(data.nickname)
            this.isRegister = true
        },
        // 前往app
        goApp() {
            this.$goAppDownLoad()
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font($size, $weight, $color) {
    font: {
        size: $size;
        weight: $weight;
    }
    color: $color;
}
.section {
    width: 100%;
    background: #e04040 url('~@/assets/img/marketing/recruit-new-ch/banner.png')
        no-repeat;
    background-size: contain;
    header {
        position: relative;
        height: 470px;
        .top {
            justify-content: space-between;
            display: flex;
            img {
                width: 120px;
                height: 35px;
                margin: 20px 14px 39px;
            }
        }
    }
    .getInfo {
        text-align: center;
        p:nth-of-type(1) {
            @include font(0.48rem, 500, #fffe66);
            line-height: 33px;
        }
        p:nth-of-type(2) {
            margin: 5px 0;
            @include font(0.24rem, 400, #fffe66);
            line-height: 17px;
        }
        .btn {
            width: 308px;
            height: 47px;
            background: linear-gradient(
                180deg,
                rgba(255, 231, 130, 1) 0%,
                rgba(255, 208, 6, 1) 100%
            );
            border-radius: 6px;
            margin: 29px auto 36px;
            font-size: 0.36rem;
            font-weight: 500;
            color: rgba(224, 64, 64, 1);
            line-height: 47px;
        }
    }
    .registerForm {
        background: none;
    }
    .info {
        padding-bottom: 26px;
        margin-top: -10px;
        @include font(0.24rem, 400, #fff);
        line-height: 14px;
        text-align: center;
        .hint {
            width: 288px;
            margin: 0 auto;
            font-size: 0.16rem;
            color: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>
