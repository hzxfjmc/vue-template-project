<template lang="pug">
    .feedback(v-if="show")
        .solve-wrap
            p {{ $t('isSolved') }}
            .btn-wrap
                .btn-solve(@click="selectSolve(1)" :class="{cue: solve === 1}")
                    img(src="../images/icon-01.png" v-if="solve === 1")
                    img(src="../images/icon-01b.png" v-else)
                    p {{ $t('solved') }}
                .btn-solve(@click="selectSolve(0)" :class="{cue: solve === 0}")
                    img(src="../images/icon-02.png" v-if="solve === 0")
                    img(src="../images/icon-02b.png" v-else)
                    p {{ $t('unSolve') }}
        template(v-if="showReasons")
            .divide
            .foot-wrap
                p.reason-tip {{ $t('reasons') }}
                van-checkbox-group(v-model="reasons")
                    yx-checkbox(
                        v-for="item in defaultReasons"
                        :key="item"
                        :name="item"
                        class="checkbox"
                    ) {{ item }}
                .advise-wrap
                    template(v-if="reasons.indexOf($t('otherReason')) > -1")
                        p {{ $t('inputAdvise') }}
                        .textarea-wrap
                            textarea(v-model="otherAdvise" maxlength="500" rows="5" :placeholder="$t('inputAdvise')" @blur="blurHandle" @focus="focusHandler")
                            p {{ otherAdvise.length }}/500
                    p(style="margin-top: 24px") {{ $t('contact') }}
                    input(v-model="mobile" maxlength="50" :placeholder="$t('optional')" @blur="blurHandle" @focus="focusHandler")
                .btn-wrap
                    yx-button(style="width: 130px" @click="cancel") {{ $t('cancel') }}
                    yx-button(style="width: 130px;margin-left: 30px" type="primary" @click="submit") {{ $t('submit') }}
</template>

<script>
import { CheckboxGroup, Toast } from 'vant'
import YxButton from '@/components/yx-button'
import YxCheckbox from '@/components/yx-checkbox'
import JSBridge from '@/utils/js-bridge'
import { generatorFeedback } from '../../0-service/market'
import { getUrlParam } from '../../0-utils'

export default {
    name: 'feedback-item',
    components: {
        [CheckboxGroup.name]: CheckboxGroup,
        YxCheckbox,
        YxButton
    },
    data() {
        return {
            show: true,
            solve: 2, // 0-未解决，1-已解决，2-未选择
            showReasons: false,
            defaultReasons: [
                this.$t('reason1'),
                this.$t('reason2'),
                this.$t('reason3'),
                this.$t('reason4'),
                this.$t('reason5'),
                this.$t('otherReason')
            ],
            reasons: [],
            otherAdvise: '',
            mobile: '',
            uuid: '',
            timing: null
        }
    },
    computed: {
        realReasons() {
            const res = this.reasons.filter(
                item => item !== this.$t('otherReason')
            )
            const hasOther = this.reasons.some(
                item => item === this.$t('otherReason')
            )
            if (hasOther && this.otherAdvise) {
                res.push(this.otherAdvise)
            }
            return res.length ? JSON.stringify(res) : ''
        }
    },
    created() {
        this.getUuid()
        this.getMobile()
    },
    methods: {
        async getMobile() {
            if (JSBridge.isYouxinApp) {
                try {
                    const data = await JSBridge.callApp('get_user_info')
                    this.mobile = data.phoneNum
                } catch (e) {} // eslint-disable-line
            }
        },
        blurHandle() {
            this.timing = setTimeout(() => window.scrollTo(0, 0), 20)
        },
        // 聚焦输入框，防止键盘挡住输入框
        focusHandler(ev) {
            clearTimeout(this.timing)
            if ('scrollIntoViewIfNeeded' in ev.target) {
                setTimeout(() => ev.target.scrollIntoViewIfNeeded(), 300)
            }
        },
        async getUuid() {
            if (JSBridge.isYouxinApp) {
                const data = await JSBridge.callApp('get_user_info')
                this.uuid = data.userId
            }
        },
        // 选择已解决
        selectSolve(type) {
            this.solve = type
            if (type === 1) {
                this.feedback()
            } else {
                this.showReasons = true
                // 滚动到底部
                this.$nextTick(() => {
                    const parent = this.$parent.$el
                    const child = this.$el
                    parent.scrollTop = child.offsetHeight + child.offsetTop
                })
            }
        },
        // 未解决提交
        submit() {
            const hasReason = this.reasons.some(
                item => item !== this.$t('otherReason') || this.otherAdvise
            )
            if (!hasReason) {
                return Toast(this.$t('inputAdvise'))
            }
            this.feedback()
        },
        // 反馈
        async feedback() {
            try {
                await generatorFeedback({
                    uid: this.uuid,
                    webgeneratorid: parseInt(getUrlParam('id')),
                    key: getUrlParam('key'),
                    issolved: this.solve,
                    linkPhone: this.mobile,
                    reasons: this.solve === 0 ? this.realReasons : ''
                })
                this.show = false
                Toast(this.$t('thanks'))
            } catch (e) {
                Toast(e.msg || this.$t('errorTips'))
            }
        },
        cancel() {
            this.showReasons = false
            this.solve = 2
        }
    }
}
</script>

<style lang="scss" scoped>
.feedback {
    margin-top: 18px;
}
.solve-wrap {
    padding: 0 14px;
    background: #fff;
    .btn-wrap {
        padding: 20px 0;
        text-align: center;
    }
    .btn-solve {
        display: inline-block;
        border: 1px solid #ebebeb;
        border-radius: 2px;
        width: 90px;
        height: 32px;
        img {
            width: 17px;
            height: 16px;
            margin-right: 6px;
            display: inline-block;
            vertical-align: middle;
            &.rotate {
                transform: rotateX(180deg);
            }
        }
        p {
            display: inline-block;
            vertical-align: middle;
            line-height: 30px;
            color: #353547;
        }
        &.cue {
            border-color: rgba(#2f79ff, 0.5);
            p {
                color: #2f79ff;
            }
        }
        & + .btn-solve {
            margin-left: 56px;
        }
    }
}
.divide {
    background-color: #eee;
    height: 10px;
}
.foot-wrap {
    padding: 14px 14px 0;
    background: #fff;
    .reason-tip {
        line-height: 24px;
        margin-bottom: 10px;
    }
    .checkbox {
        margin-bottom: 20px;
    }
    .advise-wrap {
        > p {
            line-height: 24px;
            margin-bottom: 4px;
        }
        ::-webkit-input-placeholder {
            color: rgba(#353547, 0.2);
        }
        .textarea-wrap {
            padding: 10px 0;
            border: 1px solid #ebebeb;
            border-radius: 2px;
            textarea {
                padding: 0 12px;
                border: none;
                width: 100%;
            }
            p {
                padding: 0 12px;
                text-align: right;
                color: rgba(#353547, 0.2);
            }
        }
        input {
            width: 100%;
            padding: 0 14px;
            height: 40px;
            border: 1px solid #ebebeb;
            border-radius: 2px;
        }
    }
    .btn-wrap {
        text-align: center;
        margin-top: 30px;
        padding-bottom: 30px;
    }
}
</style>
