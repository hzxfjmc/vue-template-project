<template lang="pug">
.customer-info(v-show="!hideCustomer")
    .top-bar 
    .business-title  已为您分配专属客户经理
    .business-tip 微信扫描二维码，即可添加联系人
    .businessCardWrap
        .businessCard(ref="capture")
            img.logo(src='@/assets/img/open-account/logo.png')
            .personalInfo
                .avatar
                    img(:src="customerInfo.headImgUrl")
                .info    
                    p {{customerInfo.nickName}}
                    p 专属客户经理
                    p {{customerInfo.phone}}
                .qrCode
                    img(:src="customerInfo.enterpriseWechatUrl")
                    p 微信扫一扫添加联系人
        img.downloadIcon(@click="downCustomerCard" src='@/assets/img/open-account/downloadImg.png')
</template>

<script>
import { getUserManagerInfo } from '@/service/customer-relationship-server.js'
import { getCosUrl } from '@/utils/cos-utils.js'
export default {
    data() {
        return {
            customerInfo: {},
            imgUrl: ''
        }
    },
    created() {
        this.initData()
    },
    computed: {
        // 数据不全的时候 不显示当前组件内容
        // 后端改成公有读，前端需要设置将图片转成base64再处理
        hideCustomer() {
            // return true
            delete this.customerInfo.licenseNum
            let vals = Object.values(this.customerInfo)
            return vals.length === 0 || vals.some(item => !item)
        }
    },
    methods: {
        // 将图片转为base64
        convertImgToBase64(url, callback, outputFormat) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image()
            img.crossOrigin = 'www'
            img.onload = function() {
                canvas.height = img.height
                canvas.width = img.width
                ctx.drawImage(img, 0, 0)
                var dataURL = canvas.toDataURL(outputFormat || 'image/png')
                callback.call(this, dataURL)
                canvas = null
            }
            img.src = url
        },
        // 获取客户经理信息
        async initData() {
            try {
                let res = await getUserManagerInfo()
                this.customerInfo = res || {}
                if (
                    this.customerInfo.headImgUrl &&
                    this.customerInfo.enterpriseWechatUrl
                ) {
                    let headImgUrl = await getCosUrl(
                        this.customerInfo.headImgUrl
                    )
                    let enterpriseWechatUrl = await getCosUrl(
                        this.customerInfo.enterpriseWechatUrl
                    )
                    this.convertImgToBase64(headImgUrl, base64 => {
                        headImgUrl = base64
                        this.$set(this.customerInfo, 'headImgUrl', headImgUrl)
                    })
                    this.convertImgToBase64(enterpriseWechatUrl, base64 => {
                        enterpriseWechatUrl = base64
                        this.$set(
                            this.customerInfo,
                            'enterpriseWechatUrl',
                            enterpriseWechatUrl
                        )
                    })
                }
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 将html转为canvas
        downCustomerCard() {
            import('html2canvas').then(module => {
                module
                    .default(this.$refs.capture, {
                        scale: 2,
                        dpi: 144,
                        useCORS: true
                        // allowTaint: true
                    })
                    .then(canvas => {
                        this.imgUrl = canvas.toDataURL()
                        this.saveImg(this.imgUrl)
                    })
            })
        },
        // 保存图片到手机
        async saveImg(imgUrl) {
            try {
                await this.$jsBridge.callApp('command_save_picture', {
                    pictureData: imgUrl
                })
                this.$toast('保存成功')
            } catch {
                this.$toast('保存失败')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.customer-info {
    font-family: PingFangSC-Regular;
    .top-bar {
        background-color: #f1f3f8;
        height: 10px;
    }
    width: 100%;
    .business-title {
        margin-top: 20px;
        font-size: 15px;
        text-align: center;
    }
    .business-tip {
        text-align: center;
        color: $text-color5;
        font-size: 12px;
        padding-bottom: 30px;
    }
    .businessCardWrap {
        position: relative;
        padding-bottom: 20px;
        .businessCard {
            width: 335px;
            height: 182px;
            background: #fff;
            box-shadow: 0px 1px 3px 0px #f7f7f7;
            padding: 14px;
            padding-right: 0;
            border-radius: 10px;
            border: 1px solid rgba(247, 247, 247, 1);
            margin: 0 auto;
            .logo {
                width: 64px;
                height: 28px;
                margin-bottom: 14px;
                margin-left: 6px;
            }
            .personalInfo {
                display: flex;
                .avatar {
                    padding: 10px 13px 0 0;
                    img {
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                        border: 1px solid rgba(238, 238, 238, 1);
                    }
                }
                .info {
                    width: 124px;
                    padding-top: 13px;
                    p {
                        color: #353547;
                        line-height: 22px;
                        &:nth-of-type(1) {
                            font-size: 16px;
                        }
                        &:nth-of-type(2) {
                            font-size: 12px;
                            font-weight: 500;
                        }
                        &:nth-of-type(3) {
                            font-size: 12px;
                        }
                    }
                }
                .qrCode {
                    text-align: center;
                    img {
                        width: 76px;
                        height: 76px;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 10px;
                        color: $text-color3;
                        line-height: 22px;
                    }
                }
            }
        }
        .downloadIcon {
            position: absolute;
            top: -24px;
            right: 32px;
            width: 52px;
        }
    }
}
</style>
