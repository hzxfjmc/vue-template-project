<template lang="pug">
 yx-container.index
    .register(slot="main")
        img.logo(src="@/assets/img/marketing/mgm/logo.png")
        .headImg
            img(src="@/assets/img/marketing/mgm/titleImg.png")
        .info(v-if="needDownload")
            .title 恭喜您! 
            p 您已經成功註冊，獲得港幣HKD10，
            p 請立即下載，完成開戶及存款， 
            p 領取更多獎金和新手獎勵！           
        .info(v-if="needGoInvite" class="openAccount")
            .title 多謝您! 
            p 您已經是uSMART註冊用戶，<br>請即參加邀請好友活動，<br>獲取現金獎賞高達HKD2,600！ 
        .downloadBtn(@click="handleClick") {{needDownload ? '立即下載' : '立即邀請'}}
</template>
<script>
import { Icon, Popup } from 'vant'
import { mapGetters } from 'vuex'
import { isDownLoadApp } from '../../../components/utils/downLoadApp.js'

export default {
    data() {
        return {
            needDownload: false,
            needGoInvite: false
        }
    },
    created() {
        this.needDownload = JSON.parse(this.$route.query.firstLogin)
        this.needGoInvite = !JSON.parse(this.$route.query.firstLogin)
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        goIndex() {
            this.$router.push({
                path: '/'
            })
        },
        handleClick() {
            if (this.needGoInvite) {
                this.goIndex()
            } else {
                isDownLoadApp.call(
                    this,
                    false,
                    'yxzq_goto://main_trade',
                    'yxusmart://yx.usmart.app/main?tag=trade',
                    this.userInfo.uuid
                )
            }
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
            margin: 20px auto 46px;
            img {
                width: 220px;
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
            // p:nth-of-type(3) {
            //     margin-top: 20px;
            // }
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
