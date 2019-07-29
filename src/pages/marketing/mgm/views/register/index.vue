<template lang="pug">
 yx-container.index
    .register(slot="main")
        .headImg
            p 好友 {{userInfo.inviteName}}
            img(src="@/assets/img/marketing/mgm/titleImg4.png")
        register-form(activityType="mgm" :inviteCode="userInfo.inviteCode")
</template>
<script>
import { Icon } from 'vant'
import registerForm from '../../../components/register-form/index'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {}
    },
    components: {
        [Icon.name]: Icon,
        registerForm
    },
    created() {
        let token = this.userInfo.userToken
        if (token) {
            this.$router.replace({
                path: '/'
            })
        }
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        goIndex() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
.index {
    .register {
        padding: 20px 18px 0 18px;
        .headImg {
            p {
                @include font('PingFangHK-bold', 0.36rem, 600, #2b4f80);
                line-height: 30px;
            }
            img {
                width: 324px;
            }
        }
    }
}
</style>
