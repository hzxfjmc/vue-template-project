<template lang="pug">
van-popup(v-model="show" position="top")
    .asset-start.border-bottom
        open-process(:process="50")
        .as-container(@click="showStartHander" ref="tips")
            .as-ads
            .as-tips
                .iconfont.icon-yinyong
                p.surname {{showCall}}，
                p(
                    v-for="item,index in list"
                    :key="item"
                    :class="hasReadFlag ? 'block-show' : `fade-word-${index} `") {{item}}
            .img(v-if="hasReadFlag")
                img(src="@/assets/img/open-account/arrow.png")
        .yx-company-provide(v-if="appType.Ch") 证券开户、交易服务由友信证券有限公司提供
</template>

<script>
import { Actionsheet } from 'vant'
import { Popup } from 'vant'
import { appType } from '@/utils/html-utils.js'
export default {
    components: { [Actionsheet.name]: Actionsheet, [Popup.name]: Popup },
    mixins: [require('../../mixins/mix-router.js').default],
    props: {
        value: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        showCall() {
            const firstName = this.basicInfo.realName.substr(0, 1)
            const call = this.basicInfo.gender === '男' ? '先生' : '小姐'
            return firstName + call
        }
    },
    data() {
        return {
            appType: appType,
            x: 0,
            y: 0,
            hasReadFlag: false,
            list: [
                `您好，感谢选择友信证券。友信证券致力于为全球用户提供更好的个人证券服务。`,
                `为了给您提供更匹配的金融产品服务，了解您的风险能力和偏好是非常必要的。 请帮助完善以下信息，您的所有信息会严格加密保护。`,
                `希望友信证券能给您带来更优良的体验。`
            ],
            readList: []
        }
    },
    async created() {
        this.startReadText()
        // 如果已经提交 或者 展示过不显示提示页面
        this.show = !this.$LS.get(`${this.userId}show`) || !this.submited
        this.hasReadFlag = this.$LS.get(`${this.userId}show`)
    },
    mounted() {
        this.$refs.tips.addEventListener('touchstart', e => {
            this.y = e.changedTouches[0].clientY
        })
        this.$refs.tips.addEventListener('touchend', e => {
            if (this.y > e.changedTouches[0].clientY) {
                this.showStartHander()
            }
        })
    },
    methods: {
        showStartHander() {
            if (this.hasReadFlag) {
                this.show = false
                this.$LS.put(`${this.userId}show`, true)
            }
        },
        startReadText() {
            let i = 0
            let timer = setInterval(() => {
                if (i < this.list.length) {
                    i++
                } else {
                    this.hasReadFlag = true
                    clearInterval(timer)
                }
            }, 700)
        }
    }
}
</script>

<style lang="scss">
.asset-status {
    .as-tips {
        animation: fade;
        animation-delay: 5s;
        border-radius: 3px;
        background-color: rgba(60, 120, 250, 0.1);
        padding: 2 * $global-padding $global-padding 0;
        margin: 25px 0;
        background-color: rgba(240, 245, 255, 0.4);
        position: relative;
        .icon-yinyong {
            height: 28px;
            width: 28px;
            background-color: rgba(240, 246, 255, 1);
            text-align: center;
            border-radius: 50%;
            color: rgba(207, 224, 251, 1);
            font-family: oblique;
            position: absolute;
            margin-top: -44px;
            box-shadow: 0px 1px 3px 0px rgba(172, 192, 237, 0.62);
        }
        p {
            padding-bottom: 20px;
        }
    }
}
</style>

<style lang="scss" scoped>
@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@function delay($step) {
    @return $step * 1.5+1s;
}
@for $i from 0 through 4 {
    .fade-word-#{$i} {
        animation: fade-in 1s ease 1s 1;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-delay: delay($i);
    }
}
.asset-start {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    z-index: 100;
    transition: top 600ms ease;
    .as-container {
        padding: $global-padding;
        .as-ads {
            height: 134px;
            width: 100%;
            background-color: #d8d8d8;
            background-image: url(/webapp/open-account/kefu.png);
            background-position: center;
            background-size: cover;
            border-radius: 6px;
        }
        .img {
            display: flex;
            justify-content: center;
            img {
                width: 16px;
                height: 44px;
            }
        }
    }
    .as-tips {
        padding: 24px;
        border-radius: 6px;
        border: 1px solid rgba(60, 120, 250, 0.1);
        p {
            opacity: 0;
        }
        .surname {
            font-size: 18px;
            opacity: 1;
        }
        .block-show {
            opacity: 1;
        }
    }
}
.show {
    top: 0;
}
</style>
