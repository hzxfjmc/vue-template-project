import { withdrawByWechat } from '@/service/product-server'
import { checkWechatBind } from '@/service/user-server'
export const withdraw = {
    data: () => ({
        showErrDialog: false,
        errCode: '',
        wechatNickName: '',
        showSuccessDialog: false
    }),
    methods: {
        async submitHandler(errCallback, couponBusinessId, successCallback) {
            try {
                // 绑定微信，关注公众号
                let {
                    bindWechat,
                    subscribe,
                    wechatNickName
                } = await checkWechatBind()
                this.wechatNickName = wechatNickName
                if (bindWechat && subscribe) {
                    this.doSubmit(couponBusinessId, successCallback)
                } else {
                    errCallback()
                }
            } catch (e) {
                errCallback()
            }
        },
        async doSubmit(couponBusinessId, successCallback) {
            await this.$jsBridge.callApp('command_trade_login')
            try {
                await withdrawByWechat({
                    businessId: couponBusinessId
                })
                this.showSuccessDialog = true
                successCallback && successCallback()
            } catch (e) {
                this.errCode = e.code
                this.showErrDialog = true
            }
        }
    }
}
