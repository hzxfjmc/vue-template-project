<template lang="pug">
    div.bg-w.pb-48
        yx-step(
        :data="stepData"
        :active="active")
        .gap
        .bank-transfer-box
            .flex-box.inner.space-between
                .item
                    .title 本人同名银行账户
                    .flex-box.start
                        .bank-icon.bank-icon-fps
                        .bank-title 任一香港银行
                .item
                    p 存入{{currencyStr}}
                    p
                        img(src="@/assets/img/open-account/deposit/arrow@2x.png" class="icon-arrow")
                .item
                    .title 友信证券收款账户
                    .flex-box.start
                        .bank-icon.bank-icon-zhongguo
                        .bank-title 中国银行（香港）
            .txt.flex-box.start
                p
                    span.label 手续费：
                    span 0{{currencyStr}}
                p
                    span.label 预计到账时间：
                    span 一个工作日内
        .gap
        .fps-info-box
            .title FPS转数快-友信证券收款账户信息
            p.fps-title FPS识别码
            p.fps-code(@click="copy('3795242')") 3795242
            .info-box
                ul
                    li.flex-box.start(@click="copy('中国银行（香港）')")
                        .item-left
                            span.label 收款银行名称
                        .item-right 中国银行（香港）
                    li.flex-box.start(@click="copy('USMART SECURITIES LIMITED')")
                        .item-left
                            span.label 收款账户名称
                        .item-right USMART SECURITIES LIMITED
                    li.flex-box.start(@click="copy('012')")
                        .item-left
                            span.label 银行编码
                        .item-right 012
            .btn-copy 点击信息可复制
        .gap
        guide-box(title="FPS遇到问题？" mode="fps")
        .btn(@click="goNotice") 我已入金，通知友信

</template>
<script>
/**
 * 入金流程-银证转账
 * @ Author LINJAIJUN
 * @ Date 2018/12/28
 */
import { mapGetters } from 'vuex'
import guideBox from '../../components/guide-box'
import common from '../../util/common'
export default {
    components: {
        guideBox
    },
    methods: {
        copy(content) {
            common.copy(content)
        },
        goNotice() {
            this.$router.push({
                name: 'deposit-notice',
                query: {
                    fps: this.$constant.fps
                }
            })
        }
    },
    computed: {
        ...mapGetters({ currency: `deposit/currency` }),
        currencyStr() {
            return this.$constant.currency[this.currency]
        },
        stepData() {
            return this.$constant.stepData
        }
    },
    data() {
        return {
            active: 1
        }
    }
}
</script>
<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.flex-box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.space-between {
    justify-content: space-between;
}
.start {
    justify-content: start;
}
.bg-w {
    background: #fff;
}
.flex-box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.space-between {
    justify-content: space-between;
}
.start {
    justify-content: start;
}
.mt-10 {
    margin-top: 10px;
}
.mt-24 {
    margin-top: 24px;
}
.pb-48 {
    padding-bottom: 48px;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.btn {
    position: fixed;
    width: 100%;
    height: 48px;
    background: rgba(40, 90, 200, 1);
    text-align: center;
    line-height: 48px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    bottom: 0;
    left: 0;
}

.bank-transfer-box {
    height: 111px;
    .bank-icon {
        width: 22px;
        height: 22px;
    }
    .bank-title {
        font-size: 12px;
        opacity: 0.5;
        margin-left: 5px;
    }
    .txt {
        padding: 0 14px;
        p {
            &:last-child {
                margin-left: 30px;
            }
            .label {
                opacity: 0.5;
            }
        }
    }
    p {
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        img {
            margin-top: 5px;
            width: 31px;
            height: 11px;
        }
    }
    .inner {
        padding: 14px 14px 15px;
    }
    .title {
        font-size: 14px;
        line-height: 24px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
    }
}
.fps-info-box {
    padding: 14px;
    .title {
        font-size: 18px;
        font-weight: 600;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
    .fps-title {
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
    }
    .fps-code {
        text-align: center;
        font-size: 28px;
        font-weight: 600;
        color: rgba(47, 121, 255, 1);
        line-height: 40px;
    }
    .btn-copy {
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
    }
}
.info-box {
    ul li {
        padding-top: 12px;
        &:first-child {
            padding-top: 16px;
        }
    }
    .item-left {
        flex: 1;
        .label {
            opacity: 0.5;
        }
    }
    .item-right {
        flex: 2;
    }
}
.icon-arrow {
    width: 31px;
    height: 11px;
}
</style>
