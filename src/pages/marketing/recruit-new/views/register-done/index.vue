<template lang="pug">
 yx-container.index
    .register(slot="main")
        img.logo(src="@/assets/img/marketing/mgm/logo.png" class="logoImg")
        .headImg
            img(src="@/assets/img/marketing/mgm/titleImg2.png")
        .info(v-if="needDownload")
            .title 恭喜您! 
            p 您已經完成註冊並獲得迎新獎品， 
            p 請即下載 APP 領取更多獎品！
        .info(v-if="needOpenAccount" class="openAccount")
            p 您已經是 uSMART 的註冊用戶，
            p 請前往手機 APP 開戶和存款 
            p 領取更多獎品。
        .info(v-if="openedAccount" class="openAccount")
            p 您已經成功開戶了，
            p 請開啟uSMART app 登入
        .downloadBtn(@click="handleClick") {{downLoadBtnText}}
</template>
<script>
import { Icon, Popup } from 'vant'
import { isDownLoadApp } from '../../../components/utils/downLoadApp.js'
import { getCustomerStatus } from '@/service/customer-relationship-server.js'
export default {
    data() {
        return {
            needDownload: false,
            needOpenAccount: false,
            openedAccount: false
        }
    },
    created() {
        this.userInfo.userToken && this.getCustomerStatus()
        this.needDownload = JSON.parse(this.$route.query.firstLogin)
    },
    computed: {
        downLoadBtnText() {
            return this.needDownload
                ? '立即下載'
                : this.openedAccount
                ? '登入uSMART app'
                : '立即開户'
        },
        userInfo() {
            return this.$store.getters.userInfo
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup
    },
    methods: {
        async getCustomerStatus() {
            try {
                let res = await getCustomerStatus()
                this.openedAccount = res.openAccount
                this.needOpenAccount = !this.needDownload && !this.openedAccount
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        handleClick() {
            let moduleUrl = ''
            let appUrl = ''
            if (this.openedAccount) {
                moduleUrl = 'yxzq_goto://user_login'
                appUrl = 'yxusmart://yx.usmart.app'
            } else {
                moduleUrl = 'yxzq_goto://main_trade'
                appUrl = 'yxusmart://yx.usmart.app/main?tag=trade'
            }
            isDownLoadApp.call(
                this,
                false,
                moduleUrl,
                appUrl,
                this.userInfo.uuid
            )
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
.index {
    .register {
        // padding: 20px 0 0 16px;
        .logo {
            display: block;
            width: 100px;
            height: 19px;
            margin: 20px 0 0 16px;
        }
        .headImg {
            text-align: center;
            margin: 20px auto 90px;
            img {
                width: 270px;
            }
        }
        .info {
            text-align: center;
            .title {
                margin-bottom: 29px;
                line-height: 28px;
                @include font('PingFangSC-Semibold', 0.56rem, 600, #2b4f80);
            }
            p {
                line-height: 22px;
                @include font($size: 0.32rem, $color: #4a4a4a);
            }
        }
        .openAccount {
            margin-top: 125px;
        }
        .downloadBtn {
            @include W-H(335px, 44px);
            line-height: 44px;
            border-radius: 4px;
            margin: 120px auto 0;
            background: #2b4f80;
            @include font($size: 0.32rem, $color: #fff);
            text-align: center;
        }
    }
}
</style>
