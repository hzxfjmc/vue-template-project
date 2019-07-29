<template lang="pug">
.open-result-process
    .open-result-tip(:class="{active:isActiveClass}") {{processTitle}}
    .open-result-alert(@click="clickHandle")
        .alert-content(
            v-if="(typeStatus===2&&(processStatus!==6 || processStatus!==3)) || (typeStatus===1&& processStatus===1)"
            :class="{active: isShowDetail}") {{alertContent}}
        .arrow-tip(v-if="typeStatus===2&&(processStatus===2 || processStatus===3)") {{$t('resultText.acords')}}
        .right-arrow(
            v-if="(typeStatus===1&&isShowDetail&&processStatus===1) || (typeStatus===2&&(processStatus===2 || processStatus ===3) )")
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            resultText: {
                acords: '查看提交记录'
            }
        },
        zhCHT: {
            resultText: {
                acords: '查看提交紀錄'
            }
        },
        en: {
            resultText: {
                acords: 'View Submitted Record'
            }
        }
    },
    // 1开户审核 2核实身份状态
    props: {
        typeStatus: {
            type: Number,
            require: true
        },
        // 流程提示
        processTitle: {
            type: String,
            require: true
        },
        // 1: 1 -> 审核中   5-> 审核通过
        // 2: 2->网上核实身份已提交  5-> 门店核实身份已提交  3-> 网上审核通过  6->门店审核通过
        processStatus: {
            type: Number,
            require: true
        },
        // 流程说明
        alertContent: {
            type: String
        },
        isShowDetail: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isActiveClass() {
            return (
                (this.typeStatus === 1 && this.processStatus === 5) ||
                (this.typeStatus === 2 && this.processStatus === 3)
            )
        }
    },
    data() {
        return {}
    },
    methods: {
        clickHandle() {
            let { typeStatus, processStatus } = this
            this.$emit('clickTextHandle', { typeStatus, processStatus })
        }
    }
}
</script>
<style lang="scss" scope>
.open-result-process {
    .open-result-tip {
        font-size: 20px;
        color: rgba(57, 57, 57, 0.4);
        line-height: 28px;
    }
    .active {
        color: rgba(57, 57, 57, 1) !important;
    }
    .open-result-alert {
        display: flex;
        align-items: center;
        padding-top: 4px;
        .active {
            color: rgba(57, 57, 57, 1) !important;
        }
        .alert-content {
            padding-right: 8px;
            font-size: 14px;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
        }
        .arrow-tip {
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 20px;
        }
        .right-arrow {
            width: 7px;
            height: 7px;
            border-top: 1px solid rgba(57, 57, 57, 1);
            border-right: 1px solid rgba(57, 57, 57, 1);
            transform: rotate(45deg);
        }
    }
}
</style>
