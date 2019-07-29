<template lang="pug">
.check-in-result-wrap
    van-dialog(
        :title="$t('resultPanel.title')"
        :message="$t('resultPanel.message')"
        v-model="isShowMore"
        :confirm-button-text="$t('resultPanel.sure')"
        @confirm="isShowMore=false")
    .check-in-result(@click="clickPanelHandle")
        .check-in-title-wrap
            .check-in-title {{processTitle}}
                i.iconfont.icon-wenhao.icon-font-style(v-if="typeStatus === 2 && processStatus === 1" @click.stop="isShowMore=true")
            .right-arrow(v-if="(typeStatus===2 && processStatus!==7) || typeStatus===1")
        .in-process(v-if="typeStatus === 2 && processStatus === 1")
            .check-in-tip {{checkInTip}}
            .check-slogan-wrap
                .check-slogan1 {{checkSlogan1}}
                .check-slogan2 {{checkSlogan2}}
        .in-process-result-wrap(
            v-if="(typeStatus === 1 && processStatus === 6) || (typeStatus === 2 && (processStatus === 4 || processStatus ===7))")
            ul.reject-reason
                li(v-for="item in rejectList" :key="item") {{item}}
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            resultPanel: {
                title: '核实身份',
                message:
                    '依据香港证监会指引，核实身份是开户的必要环节，您可以通过网上或去门店完成核实身份',
                sure: '我知道了',
                address: '待補充通信地址',
                checkInTip: '持有香港银行账户，转账港币$10,000',
                checkSlogan1: '最节省您的开户时间',
                checkSlogan2: '简单快捷'
            }
        },
        zhCHT: {
            resultPanel: {
                title: '核實身份',
                message:
                    '依據香港證監會指引，核實身份是開戶的必要環節，您可以通過網上或去門店完成核實身份',
                sure: '我知道了',
                address: '待补充通信地址',
                checkInTip: '持有香港銀行賬戶，轉賬港幣$10,000',
                checkSlogan1: '最節省您的開戶時間',
                checkSlogan2: '簡單快捷'
            }
        },
        en: {
            resultPanel: {
                title: 'Identity Verification',
                message:
                    'According to the guideline of the SFC, Identity verification is required for account opening, you can verify online or offline.',
                sure: 'OK',
                address: 'Submit Address Proof',
                checkInTip:
                    'Transfer HKD10,000 from your Hong Kong bank account',
                checkSlogan1: 'Save Time',
                checkSlogan2: 'Simple and Fast'
            }
        }
    },
    props: {
        // 1开户审核 2核实身份状态
        typeStatus: {
            type: Number,
            require: true
        },
        // 1: 6-> 驳回   2: 4->网上驳回 7-> 门店驳回
        processStatus: {
            type: Number,
            require: true
        },
        rejectList: {
            type: Array
        },
        processTitle: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            isShowMore: false,
            alertContent: this.$t('resultPanel.address'),
            checkInTip: this.$t('resultPanel.checkInTip'),
            checkSlogan1: this.$t('resultPanel.checkSlogan1'),
            checkSlogan2: this.$t('resultPanel.checkSlogan2')
        }
    },
    methods: {
        clickPanelHandle() {
            let { typeStatus, processStatus } = this
            this.$emit('clickPanelHandle', { typeStatus, processStatus })
        }
    }
}
</script>
<style lang="scss" scope>
.check-in-result {
    width: 313px;
    min-height: 119px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px 0px rgba(57, 57, 57, 0.1);
    border-radius: 10px;
    .check-in-title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0 0 18px;
        .check-in-title {
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-font-style {
                padding-left: 5px;
            }
            font-size: 20px;
            color: rgba(57, 57, 57, 1);
            line-height: 28px;
        }
        .right-arrow {
            width: 7px;
            height: 7px;
            border-top: 1px solid rgba(57, 57, 57, 1);
            border-right: 1px solid rgba(57, 57, 57, 1);
            transform: rotate(45deg);
            margin-right: 22px;
        }
    }
    .in-process-result-wrap {
        padding: 8px 17px 22px 18px;
        font-size: 14px;
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(250, 97, 18, 1);
        line-height: 20px;
    }
    .check-in-tip {
        padding: 4px 0 0 18px;
        font-size: 14px;
        color: rgba(57, 57, 57, 0.4);
        line-height: 20px;
    }
    .check-slogan-wrap {
        display: flex;
        font-weight: 400;
        color: rgba(1, 33, 220, 1);
        line-height: 20px;
        padding-top: 8px;
        padding-bottom: 24px;
        .check-slogan1 {
            margin-left: 18px;
            background: rgba(1, 33, 220, 0.05);
            border-radius: 13px;
            padding: 3px 12px;
        }
        .check-slogan2 {
            margin-left: 12px;
            background: rgba(1, 33, 220, 0.05);
            border-radius: 13px;
            padding: 3px 12px;
        }
    }
}
</style>
