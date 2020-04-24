<template lang="pug">
    .yx-edda-bank-container
        van-popup.bank-list-popup(v-model="showPopup" position="bottom" :class="isPhoneX ? 'fix-bottom':''")
            yx-container.bank-list-container
                .title-box(slot="top")
                    .left {{$t(['请选择转账账户','請選擇轉賬賬戶','Choose account to be transferred'])}}
                    .cancel(@click="showPopup=false") {{$t(['取消','取消','Cancel'])}}
                ul(slot="main")
                    li(v-for="item in bankList" @click="checkBankHandle(item)")
                        template(v-if="item.type !=1")
                            .block--left
                                .bank-name {{item.bankName}}
                                    span {{item.eddaSwitch?$t(['已授权','已授權','Authorized']):$t(['已失效', '已失效', 'Expired'])}}
                                .limit-text 
                                    .text-show
                                        span(style="font-size:12px" ) {{$t(['您的EDDA额度为：单笔','您的EDDA額度為：單筆','Your EDDA limit: '])}}
                                        span {{Number(item.mandateAmount).toFixed(2) | thousand-spilt}}
                                        span(v-if="item.mandateAmount" ) {{$t(['港币','港幣','HKD'])}}
                                    span.modify-text(@click="modifyHandle(item)") {{$t(['点此修改','點此修改','Click here to apply again.'])}}
                            .block--right(v-if="item.check")
                                em.iconfont.icon-tick-
                        template(v-else)
                            .block--left 
                                .bank-name {{item.bankName}}
                                .text-show
                                    span(style="font-size:12px" ) {{item.desc}}
                            .block--right(v-if="item.check")
                                em.iconfont.icon-tick-
                .add-other-container(@click="addEddaAccount" slot="main")
                    em.iconfont.icon-add
                    span {{$t(['新增银行账户(EDDA)','新增銀行賬戶(EDDA)','Add New Bank Account (EDDA)'])}}
                        


</template>

<script>
import { Popup } from 'vant'
export default {
    components: {
        [Popup.name]: Popup
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        bankList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        showPopup: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        isPhoneX() {
            return (
                /iphone/gi.test(window.navigator.userAgent) &&
                window.screen.height >= 812
            )
        }
    },
    data() {
        return {
            authorizationed: ''
        }
    },
    methods: {
        modifyHandle(val) {
            event.stopPropagation()
            if (!val.eddaSwitch || val.bankNumber === '238') {
                this.$alert({
                    message: this.$t([
                        '对应银行服务调整中，暂不支持修改限额。',
                        '對應銀行服務調整中，暫不支持修改限額。',
                        'Cannot edit because of bank system maintenance.'
                    ]),
                    confirmButtonText: this.$t(['我知道了', '我知道了', 'OK'])
                })
                return
            }
            this.$router.push({
                name: 'modify-amount',
                params: {
                    datas: val
                },
                query: {
                    id: val.id,
                    from: this.$route.query.from === 'hk' ? 'hk' : 'dl'
                }
            })
        },
        addEddaAccount() {
            this.$router.push({
                name: 'authorization-information',
                params: {
                    add: 'add'
                },
                query: {
                    isNoButton: 'yes'
                }
            })
        },
        checkBankHandle(item) {
            this.$emit('checkBankHandle', item)
            this.showPopup = false
        }
    }
}
</script>

<style scoped lang="scss">
.yx-edda-bank-container {
    .van-popup--bottom {
        top: auto;
        // bottom: 20px;
        right: auto;
        &.fix-bottom {
            bottom: 30px;
        }
    }
    .bank-list-container {
        max-height: 410px;
        .title-box {
            font-size: 12px;
            color: rgba($text-color, 0.65);
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            line-height: 43px;
            border-bottom: 1px solid $background-bottom-color;
        }
        li {
            padding: 10px 20px;
            min-height: 60px;
            border-bottom: 1px solid $background-bottom-color;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .block--right {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #2f79ff;
            }
            .bank-name {
                span {
                    height: 16px;
                    line-height: 16px;
                    font-size: 10px;
                    color: #2177ff;
                    border: 0.5px solid #2177ff;
                    border-radius: 1px;
                    padding: 0 3px;
                    margin-left: 6px;
                }
            }
        }
        .limit-text {
            display: flex;
            color: rgba($text-color, 0.65);
            font-size: 12px;
            .text-show {
                span {
                    font-size: 12px;
                }
            }

            .modify-text {
                margin-left: 6px;
                color: $primary-color-line;
            }
        }
        .add-other-container {
            background-color: #fff;
            font-size: 14px;
            font-weight: 400;
            color: $text-color;
            padding: 16px 0 20px 20px;
            em {
                padding: 0 10px 0 0;
            }
            img {
                width: 20px;
                height: 20px;
                margin-right: 6px;
                color: $text-color;
                vertical-align: middle;
            }
        }
    }
}
</style>
