<template lang="pug">
 yx-container.index
    .register(slot="main")
        img.logo(src="@/assets/img/marketing/mgm/logo.png" class="logoImg")
        img.headImg(src="@/assets/img/marketing/mgm/titleImg2.png")
        register-form(
            activityType="recruit" 
            :inviteCode="userInfo.inviteCode")
</template>
<script>
import { Icon } from 'vant'
import registerForm from '../../../components/register-form/index'
import { mapGetters } from 'vuex'
export default {
    components: {
        [Icon.name]: Icon,
        registerForm
    },
    created() {
        if (this.userInfo.userToken) {
            this.$router.replace({
                path: '/index'
            })
        }
    },
    computed: {
        ...mapGetters(['userInfo'])
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
.index {
    .register {
        padding: 24px 18px 0 18px;
        .logo {
            width: 100px;
        }
        .headImg {
            display: block;
            width: 300px;
            margin: 20px auto 0;
        }
    }
}
</style>
