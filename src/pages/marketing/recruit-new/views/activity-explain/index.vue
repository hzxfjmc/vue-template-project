<template lang="pug">
    .index
        .content
            img.logo(src="@/assets/img/marketing/mgm/logo.png" class="logoImg")
            img.headImg(src="@/assets/img/marketing/mgm/titleImg2.png")
            .info
                .title 
                activity-rule
            .notice
                p 風險及免責聲明：
                p 此活動由友信證券有限公司提供，以上所載資料及其內容僅供參考，並不構成任何金融產品或工具之要約、招攬或邀請。投資者應注意投資涉及風險，金融產品價格可升可跌，甚至變成毫無價值而招致損失。如對產品投資風險有不明白之處，應尋求獨立專業意見。
</template>

<script>
import { Icon } from 'vant'
import ActivityRule from '../../components/activity-rule/index'
export default {
    data() {
        return {}
    },
    components: {
        [Icon.name]: Icon,
        ActivityRule
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
.index {
    background: #f8fbff;
    .content {
        .logo {
            width: 100px;
            margin: 17px 0 0 15px;
        }
        .headImg {
            display: block;
            width: 290px;
            margin: 24px auto 40px;
        }
        .info {
            position: relative;
            @include W-H(338px, auto);
            padding: 44px 18px 30px 25px;
            border: 8px solid #2b4f80;
            margin: 29px auto 0px;
            background-size: cover;
            .title {
                position: absolute;
                top: -26px;
                left: 77px;
                @include W-H(182px, 52px);
                background: #f8fbff
                    url('~@/assets/img/marketing/recruit-new/infoTitleImg.png')
                    no-repeat center center;
                background-size: contain;
            }
        }
        .notice {
            padding: 20px 18px;
            p {
                font-size: 0.28rem;
                color: rgba(25, 49, 101, 1);
                line-height: 20px;
                margin-bottom: 10px;
            }
        }
    }
}
</style>
