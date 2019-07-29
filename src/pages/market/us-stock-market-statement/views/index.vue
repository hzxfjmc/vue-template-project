<template lang="pug">
    .us-stock-market-statement(v-show="!pageLoading" :class="{mainland: $ua.isMainland}")
        .hint {{i18n.hint}}

        // 职业状态
        van-field.job(
            v-model="jobState.name"
            required
            :label="i18n.job_label"
            right-icon="arrow-down"
            :placeholder="i18n.job_placeholder"
            autocomplete="off"
            @click.native="showJobPopup = true"
        )

        // 公司名称
        van-field(
            v-if="jobState.mustCompany"
            v-model="companyName"
            required
            ref="company"
            :label="i18n.company_label"
            :placeholder="i18n.company_placeholder"
            autocomplete="off"
            @click.native="$refs.company.focus()"
        )

        // 信息确认
        .confirm-line(style="margin-top: 30px")
            van-checkbox(v-model="confirmInfo" shape="square")
            .text {{i18n.confirm_info}}

        // 协议确认
        .confirm-line(v-if="usStockProtocol || usStockSubscribe" style="margin-top: 16px")
            van-checkbox(v-model="confirmProtocol" shape="square")
            .text
                | {{i18n.confirm_protocol}}
                a(v-if="usStockProtocol" @click="preview(usStockProtocol, i18n.confirm_protocol_1)") 《{{i18n.confirm_protocol_1}}》
                a(v-if="usStockSubscribe" @click="preview(usStockSubscribe, i18n.confirm_protocol_2)") 《{{i18n.confirm_protocol_2}}》

        van-button(type="info" size="large" :disabled="button_disable" @click="confirm") {{i18n.confirm}}

        // 选择职业弹窗
        job-select(v-model="showJobPopup" @select-job="selectJob")
</template>

<script>
import { Picker, Field, Checkbox, Button, Toast } from 'vant'
import {
    saveUsStockMarketStatement,
    getUsStockMarketStatementProtocol
} from '@market-service/market'
import LS from '@/utils/local-storage.js'
import { isAndroid, isIOS } from '@/utils/html-utils'
import JobSelect from '../components/job-select'
import { getCosUrl } from '@/utils/cos-utils'
import { debounce } from '@market-utils'

async function preview(url, title = '') {
    if (!url) return

    if (this.$jsBridge.isYouxinApp) {
        // goPdfPreviewByArgid(url)
        let path = url // 默认是h5页面，h5页面直接打开
        const isPdf = /\.pdf$/.test(url)

        if (isPdf && isAndroid) {
            // pdf
            LS.put(
                'us-stock-market-statement-preview-pdf-info',
                [url, title].join(',')
            )
            path = `${location.origin}/webapp/market/us-stock-market-statement.html#/preview`
        } else if (isPdf && isIOS) {
            path = await getCosUrl(url)
        }

        this.$jsBridge.gotoNewWebview(path, true, title)
    } else {
        this.$router.push(`/preview?url=${url}&title=${title}`)
    }
}

export default {
    name: 'index',
    components: {
        JobSelect,
        [Picker.name]: Picker,
        [Field.name]: Field,
        [Checkbox.name]: Checkbox,
        [Button.name]: Button
    },
    data() {
        return {
            pageLoading: true,
            jobState: {
                mustCompany: true // 是否需要选公司
            }, // 选中职位状态

            showJobPopup: false, // 是否显示职业选择弹窗

            companyName: '', // 公司名称

            confirmInfo: false,

            confirmProtocol: false,

            usStockProtocol: '', // 美股行情协议声明
            usStockSubscribe: '' // 美股行情订阅协议
        }
    },
    computed: {
        i18n() {
            return this.$t('index')
        },
        // 按钮状态
        button_disable() {
            return (
                !this.jobState.id ||
                (this.jobState.mustCompany && !this.companyName.trim()) ||
                !this.confirmInfo ||
                !this.confirmProtocol
            )
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)

        // eslint-disable-next-line no-func-assign
        preview = preview.bind(this)

        this.getUsStockMarketStatementProtocol()
            .then(() => {
                this.pageLoading = false
            })
            .catch(() => {
                this.pageLoading = false
            })
    },
    methods: {
        /**
         * 确认按钮
         */
        confirm() {
            if (!this.button_disable) {
                this.saveUsStockMarketStatement()
            }
        },
        /**
         * 保存每股行情声明
         * @returns {Promise<void>}
         */
        async saveUsStockMarketStatement() {
            try {
                const data = {
                    jobStatusCode: this.jobState.id
                }

                if (this.jobState.mustCompany) {
                    data.companyName = this.companyName
                }

                await saveUsStockMarketStatement(data)

                this.$jsBridge.callApp('command_confirm_us_quote_statement')
            } catch ({ msg, code }) {
                if (+code === 300101) {
                    console.log(
                        "this.$jsBridge.callApp('command_token_failure')"
                    )
                    this.$jsBridge.callApp('command_token_failure')
                } else {
                    Toast(msg ? msg : this.i18n.submit_error_info)
                }
            }
        },
        /**
         * 预览协议
         * @param url 跳转地址
         * @param title 预览页面标题
         */
        preview: debounce(preview, 600),
        /**
         * 获取美股行情声明协议
         * @returns {Promise<void>}
         */
        async getUsStockMarketStatementProtocol() {
            try {
                // 美股行情协议声明
                this.usStockProtocol = await getUsStockMarketStatementProtocol({
                    serviceCode: 'AGR014'
                })
            } catch (e) {
                console.log('获取美股行情协议声明失败：', e)
                this.usStockProtocol = ''
            }

            try {
                // 美股行情订阅协议
                this.usStockSubscribe = await getUsStockMarketStatementProtocol(
                    { serviceCode: 'AGR015' }
                )
            } catch (e) {
                console.log('获取美股行情订阅协议失败：', e)
                this.usStockSubscribe = ''
            }

            if (!this.usStockProtocol && !this.usStockSubscribe) {
                this.confirmProtocol = true
            }
        },
        /**
         * 选择职业
         * @param job
         */
        selectJob(job) {
            this.jobState = job
        }
    }
}
</script>

<style scoped lang="scss">
.us-stock-market-statement {
    padding: 18px;

    .hint {
        margin: 0 0 18px;
        padding: 14px 18px 14px 12px;

        background: rgba(60, 120, 250, 0.06);
        border-radius: 6px;
        border: 1px solid rgba(60, 120, 250, 0.12);

        font-size: 14px;
        font-weight: 400;
        color: rgba(40, 90, 200, 1);
        line-height: 20px;
    }

    .van-cell {
        height: 49px;

        &::after {
            content: ' ';
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
            left: 10px;
            right: 0;
            bottom: 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid #ebedf0;
        }
    }

    .job {
        /deep/ .van-field__body {
            position: relative;
        }

        /deep/ .van-field__body:after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 6;
        }
    }

    /deep/ .van-field__label {
        max-width: none;
    }

    .confirm-line {
        display: flex;

        .van-checkbox {
            display: inline-block;
            margin-right: 12px;
            margin-left: 10px;
            margin-top: 3px;

            /deep/ .van-checkbox__icon {
                /*vertical-align: -webkit-baseline-middle;*/
            }

            /deep/ .van-icon {
                border-width: 1px;
            }

            // 兼容4倍屏
            @media only screen and (-webkit-min-device-pixel-ratio: 4) {
                /deep/ .van-icon {
                    border-width: 2px;
                }
            }
        }

        .text {
            flex: 1;
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 1.4;

            a {
                color: #285ac8;
            }
        }
    }

    /deep/ .van-field__control:disabled {
        color: #323233 !important;
    }

    .van-button {
        margin-top: 40px;
        background-color: #0055ff;
        border-color: #0055ff;
        border-radius: 4px;
    }

    .van-popup {
        // 兼容4倍屏
        @media only screen and (-webkit-min-device-pixel-ratio: 4) {
            /deep/ .van-hairline--top-bottom:after {
                border-width: 2px 0;
            }
        }
    }

    // 大陆版本
    &.mainland {
        .van-button {
            background-color: #0d50d8;
            border-color: #0d50d8;
            border-radius: 6px;
        }
    }
}
</style>
