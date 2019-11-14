<template lang="pug">
    yx-container-better.risk-appropriate-result-wrapper(v-show="isShowPage")
        .risk-appropriate-result-container(slot="main")
            .risk-result__header
                i(:type="riskMatchResult")
                h2 {{ riskMatchResult > 2 ? $t('matching') : $t('noMatching') }}
                p {{$t('yoursAppropriate')}}{{ riskMatchResult > 2 ? $t('suitable') : $t('noSuitable') }}{{$t('buyIt')}}
            .risk-result__content
                .risk-cell
                    span {{$t('yoursAppropriate')}}
                    strong {{ assessResultName || '--'  }}
                .risk-cell
                    span {{$t('proRisk')}}
                    strong {{ $t('riskTypeList')[bondRiskLevel] && $t('riskTypeList')[bondRiskLevel]  }}
            .risk-result__tips(v-if="riskMatchResult === 1")
                h2
                    i.iconfont.icon-about_icon
                    span {{$t('riskMeans')}}
                p {{$t('meansInfo')}}

            van-dialog.remaining-container(
                v-model="showRemainingNum"
                :show-cancel-button='true'
                :confirm-button-text="number===0?$t('toCall'):$t('startRisk')"
                @confirm="startRiskHandle(number)"
                :cancel-button-text="number===0?$t('toClose'):$t('toCancel')"
                @cancel="callOrCancel(number)"
            )
                .title {{$t('leastNum')}} {{number}} {{$t('times')}}
                .years-info(v-if="number!==0") {{resetTimes}}
                .years-info(v-if="number===0") {{$t('yearsInfoToCall')}}

        .footer-wrapper(
            slot="bottom"
        )
            .risk-agreement(v-if="riskMatchResult === 1")
                van-checkbox(v-model="isReadProductInfo")
                    i.iconfont(
                        slot="icon"
                        slot-scope="props"
                        :class="props.checked ? 'icon-xuanzhong2' : 'icon-noconfirm'"
                    )
                p
                    span 我已阅读并知晓债券相关风险，我已阅读产品资料
                    a(:href="productUrl") 《产品概览书》
            .van-bottom-btn
                van-button.btn(type="info" round size="large"
                    :disabled="isDisabled"
                    @click="handleAction"
                ) {{btnText}}

</template>

<script>
import riskAppropriateResultMixin from './mixins.js'
export default {
    mixins: [riskAppropriateResultMixin]
}
</script>

<style lang="scss" scoped>
.yx-container.risk-appropriate-result-wrapper {
    background-color: #fff !important;
    .risk-appropriate-result-container {
        .risk-result__header {
            padding-top: 41px;
            text-align: center;
            i {
                display: block;
                width: 100px;
                height: 100px;
                margin: 0 auto;
                &[type='1'],
                &[type='2'] {
                    background: url('~@/assets/img/bond-hk/icon-cry.png') center
                        no-repeat;
                    background-size: 100%;
                }
                &[type='3'] {
                    background: url('~@/assets/img/bond-hk/icon-laugh.png')
                        center no-repeat;
                    background-size: 100%;
                }
            }
            h2 {
                padding: 14px 0 5px;
                color: $hk-primary-color;
                font-size: 28px;
                line-height: 40px;
            }
            p {
                color: $hk-text-color;
                font-size: 14px;
                line-height: 20px;
            }
        }
        .risk-result__content {
            margin: 40px $hk-global-padding 0;
            padding: 20px 0;
            border: 1px solid rgba($hk-text-color, 0.05);
            box-shadow: 0px 2px 4px 0px rgba($hk-text-color, 0.05);
            border-radius: 10px;
            .risk-cell {
                display: flex;
                margin-bottom: 14px;
                padding: 0 14px;
                font-size: 16px;
                line-height: 20px;
                &:last-child {
                    margin-bottom: 0;
                }
                span {
                    color: $hk-text-color6;
                }
                strong {
                    color: $hk-text-color;
                    flex: 1;
                    text-align: right;
                }
            }
        }
        .risk-result__tips {
            padding: 20px $hk-global-padding 0;
            h2 {
                line-height: 1;
                i {
                    margin-right: 6px;
                    color: $hk-text-color6;
                    font-size: 15px;
                    vertical-align: middle;
                }
                span {
                    color: $hk-text-color;
                    font-size: 12px;
                    line-height: 17px;
                    vertical-align: middle;
                }
            }
            p {
                margin-top: 11px;
                color: $hk-text-color6;
                font-size: 12px;
                line-height: 17px;
            }
        }
    }
}
.remaining-container {
    text-align: center;
    padding-top: 20px;
    .title {
        margin-bottom: 20px;
    }
    .years-info {
        font-size: 14px;
        color: $text-color6;
        margin-bottom: 20px;
        padding: 0 10px;
    }
}
.risk-agreement {
    display: flex;
    align-items: baseline;
    margin-bottom: 60px;
    padding: 0 $hk-global-padding;
    .van-checkbox {
        display: inline-block;
        margin-right: 6px;
        vertical-align: text-bottom;
    }
    .icon-xuanzhong2,
    .icon-noconfirm {
        font-size: 16px;
        vertical-align: top;
    }
    .icon-noconfirm {
        color: $hk-text-color2;
    }
    .icon-xuanzhong2 {
        color: $hk-primary-color;
    }
    p {
        flex: 1;
        color: $hk-text-color;
        font-size: 14px;
        line-height: 20px;
        a {
            color: $hk-primary-color;
            font-size: 14px;
        }
    }
}
.van-bottom-btn {
    height: 48px;
    background-color: #fff;
    .btn {
        width: 100%;
        height: 100%;
        color: $background-color;
        border-radius: 0 !important;
        &[disabled='disabled'] {
            background-color: $hk-disabled-color;
        }
    }
}
</style>
