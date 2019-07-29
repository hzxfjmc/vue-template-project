<template lang="pug">
    .btn-list
        van-button(type="primary" @click="redirect('deposit')") 入金入口
        van-button(type="primary" @click="redirect('withdrawal')") 出金入口
        van-button(type="primary" @click="redirect('command_trade_login')") 校验交易密码
        van-button(type="primary" @click="redirect('yxzq_goto://fund_history_record')") 跳转历史记录
        van-button(type="primary" @click="redirect('yxzq_goto://fund_history_record_close')") 跳转历史记录->关闭
        van-button(type="primary" @click="redirect('yxzq_goto://fund_history_record_close1')") 关闭->跳转历史记录
        van-button(type="primary" @click="redirect('yxzq_goto://webview')") 测试跳转WebView
        van-button(type="primary" @click="redirect('env')") 获取环境信息
        van-button(type="primary" @click="redirect('userAgent')") 获取userAgent信息
</template>

<script>
import jsBridge from '@/utils/js-bridge'
export default {
    methods: {
        redirect(type) {
            switch (type) {
                case 'deposit':
                    location.href =
                        'http://10.250.90.137:1024/webapp/open-account/deposit.html#/'
                    break
                case 'withdrawal':
                    location.href =
                        'http://10.250.90.137:1024/webapp/open-account/withdrawal.html#/'
                    break
                case 'command_trade_login':
                    jsBridge.callApp('command_trade_login').then(res => {
                        alert(JSON.stringify(res))
                    })
                    break
                case 'yxzq_goto://fund_history_record':
                    jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
                    break
                case 'yxzq_goto://fund_history_record_close':
                    jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
                    jsBridge.callApp('command_close_webview')
                    break
                case 'yxzq_goto://fund_history_record_close1':
                    jsBridge.callApp('command_close_webview')
                    jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
                    break
                case 'yxzq_goto://webview':
                    jsBridge.gotoNativeModule(
                        `yxzq_goto://webview?url=https://www.baidu.com`
                    )
                    break
                case 'env':
                    jsBridge
                        .callApp('get_app_connect_environment')
                        .then(res => {
                            alert(JSON.stringify(res))
                        })
                    break
                case 'userAgent':
                    alert(navigator.userAgent)
                    break
            }
        }
    }
}
</script>

<style lang="scss">
.btn-list {
    text-align: center;
}
.van-button {
    width: 90%;
    margin: 10px 0;
}
</style>
