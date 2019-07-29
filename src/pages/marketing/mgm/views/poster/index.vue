<template lang="pug">
    .section
        .posters(ref="capture" )
            img.logo(src="@/assets/img/marketing/mgm/logo.png")
            img(src="@/assets/img/marketing/mgm/detail.png" class="ruleBtn" @click="jumpExplain")
            img.posterBg(src="@/assets/img/marketing/mgm/posterBg.png")
            .advanList
                .advanItem
                    img(src="@/assets/img/marketing/mgm/advan1.png")
                    p <span>享</span>智能選股 
                    p 策略
                .advanItem
                    img(src="@/assets/img/marketing/mgm/advan2.png")
                    p <span>免</span>180日  
                    p 港股平台費
            .advanList.advanList2
                .advanItem
                    img.larger(src="@/assets/img/marketing/mgm/advan3.png")
                    p <span>獎</span>一世港股 
                    p 美股免佣
                .advanItem
                    img(src="@/assets/img/marketing/mgm/advan4.png")
                    p <span>送</span>現金HKD2,600及
                    p 股票USD$2,200*
            p.hint *以GOOGLE 2019年7月8日收市價計算
            .info
                .left
                    p.inviteName {{inviteName}}
                    h4 uSMART 友信智投
                    h5 SIMPLY SMARTER    
                .right(id="qrcode")      
        .posterWrap
            img(:src="posterUrl")
</template>

<script>
import html2canvas from 'html2canvas'
import QRCode from 'qrcodejs2'
import { setTimeout } from 'timers'

export default {
    data() {
        return {
            activityId: '',
            inviteCode: '',
            inviteName: '',
            posterUrl: '',
            link: '',
            isYouxinApp: false
        }
    },
    created() {
        this.activityId = this.$route.query.id
        this.inviteCode = this.$route.query.ICode
        this.inviteName = this.$route.query.n
        if (this.$jsBridge.isYouxinApp) {
            this.isYouxinApp = true
        }
        this.link = `${window.location.origin}/webapp/marketing/mgm.html?ICode=${this.inviteCode}&n=${this.inviteName}&id=${this.activityId}#/`
    },
    mounted() {
        this.$nextTick(() => {
            this.qrcode()
            setTimeout(() => {
                this.makePoster()
            }, 1000)
            if (this.$jsBridge.isYouxinApp) {
                // 调用app截图方法
                setTimeout(() => {
                    this.getImg()
                }, 300)
            }
        })
    },
    methods: {
        // 跳转至详情页
        jumpExplain() {
            this.$router.push({
                path: 'explain',
                query: {
                    Inviter: false
                }
            })
        },
        // 生成海报图
        makePoster() {
            html2canvas(this.$refs.capture)
                .then(canvas => {
                    this.posterUrl = canvas.toDataURL()
                })
                .catch(() => {
                    this.$toast('生成失敗')
                })
        },
        // app海报分享方法调用
        async getImg() {
            try {
                await this.$jsBridge.callApp('command_screenshot_share_save')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            } finally {
                // 分享成功或取消分享，海报隐藏
                this.$router.go(-1)
            }
        },
        // 生成二维码
        qrcode() {
            new QRCode('qrcode', {
                width: 80,
                height: 80,
                text: unescape(this.link)
            })
        }
        // app里点击分享
        // handleShare() {
        //     this.$jsBridge.callApp('command_share', {
        //         shareType: 'freedom',
        //         title: '【uSMART友信智投 邀請好友 獲賞現金及股票】',
        //         description: `好友${
        //             this.inviteName
        //         }邀請您齊齊攞高達港幣$2,600現金獎賞及匯豐銀行、港交所、港鐵等股票`,
        //         pageUrl: unescape(this.link),
        //         thumbUrl: `${
        //             window.location.origin
        //         }/webapp/marketing/images/mgmShare.png`
        //     })
        // }
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
// .section {
//     height: 100%;
// }
.posters {
    position: relative;
    // height: 100%;
    padding-bottom: 20px;
    background: rgba(248, 251, 255, 1);
    .logo {
        width: 100px;
        margin: 20px 0 0 17px;
    }
    .ruleBtn {
        position: absolute;
        top: 15px;
        right: 0;
        z-index: 2;
        width: 53px;
    }
    .posterBg {
        display: block;
        width: 271px;
        margin: -4px auto 0;
    }
    .title {
        font-size: 0.36rem;
        font-weight: 500;
        color: #2b4f80;
        line-height: 25px;
        text-align: center;
    }
    .advanList {
        display: flex;
        justify-content: space-between;
        padding: 18px 40px 14px;
        .advanItem {
            display: inline-block;
            width: 140px;
            text-align: center;
            img {
                height: 33px;
                margin-bottom: 8px;
            }
            .larger {
                height: 41px;
                margin-bottom: 0;
            }
            p {
                font-size: 0.28rem;
                font-weight: 500;
                color: #2b4f80;
                line-height: 16px;
                span {
                    font-size: 0.28rem;
                    font-weight: 600;
                    color: #ff7439;
                }
            }
        }
    }
    .advanList2 {
        padding-top: 2px;
    }
    .hint {
        font-size: 0.22rem;
        color: #2b4f80;
        line-height: 16px;
        text-align: center;
    }
    // .hasBtn {
    //     margin-top: 73px !important;
    // }
    .info {
        display: flex;
        justify-content: space-between;
        padding: 10px 12px 0px 16px;
        width: 339px;
        height: 100px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 4px 0px rgba(57, 57, 57, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(247, 247, 247, 1);
        margin: 20px auto 0;
        .left {
            .inviteName {
                @include font($size: 0.28rem);
            }
            h4 {
                margin-top: 10px;
                font-size: 0.42rem;
                font-weight: 600;
                color: #2b4f80;
                line-height: 26px;
            }
            h5 {
                font-size: 0.36rem;
                font-weight: 600;
                color: rgba(255, 116, 57, 1);
                line-height: 23px;
            }
        }
    }
}
.posterWrap {
    position: absolute;
    top: 0px;
    left: 0;
    // bottom: 0;
    // right: 0;
    // z-index: -1;
    opacity: 0;
    background: rgb(248, 251, 255);
    img {
        width: 100%;
    }
}
</style>
