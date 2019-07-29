<template lang="pug">
.check-in-result-wrap
    van-dialog(
        title="核实身份"
        message="依据香港证监会指引，核实身份是开户的必要环节，您可以通过网上或去门店完成核实身份"
        v-model="isShowMore"
        confirm-button-text="我知道了"
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
            alertContent: '待补充通信地址',
            checkInTip: '持有香港银行账户，转账$10,000',
            checkSlogan1: '最节省您的开户时间',
            checkSlogan2: '简单快捷'
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
        padding-top: 11px;
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
