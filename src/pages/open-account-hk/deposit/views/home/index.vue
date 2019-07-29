<template lang="pug">
    div.full-height.flex-fixed
        online(v-if="verifyType === 0")
        offline(v-if="verifyType === 1 || verifyType === 3 || verifyType === 2")
</template>

<script>
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
import online from './deposit-online'
import offline from './deposit-offline'
export default {
    components: {
        online,
        offline
    },
    data() {
        return {
            verifyType: '' // 0-港版线上开户 1-港版门店开户 2-iPad展业开户 3-大陆线上开户
        }
    },
    methods: {
        async getHKOpenAccountInfo() {
            try {
                this.$loading()
                let { verifyType } = await getHKOpenAccountInfo()
                this.verifyType = verifyType
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        }
    },
    created() {
        this.getHKOpenAccountInfo()
    }
}
</script>

<style scoped></style>
