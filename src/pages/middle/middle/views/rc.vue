<template lang="pug">
   
</template>
<script>
import wx from 'weixin-js-sdk'
import { oauthRedirect, initOauth } from '@/utils/oauth2/wechat.js'
import { getParameter } from '@/utils/tools.js'
export default {
    data() {
        return {}
    },
    methods: {},
    created() {
        let money = getParameter('money')
        oauthRedirect()
        initOauth().then(() => {
            wx.miniProgram.redirectTo({
                url: `/pages/award-center/index?auth=true&&money=${money}`,
                success: function() {
                    console.log('success')
                },
                fail: function() {
                    console.log('fail')
                },
                complete: function() {
                    console.log('complete')
                }
            })
        })
    }
}
</script>

<style scoped lang="scss"></style>
