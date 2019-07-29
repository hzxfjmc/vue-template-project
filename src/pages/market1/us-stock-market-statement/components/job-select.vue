<template lang="pug">
    van-popup.job-select-component(
        v-model="showJobPopup"
        :overlay="true"
        position="bottom"
        :class="{mainland: $ua.isMainland, hk: $ua.isHK}"
    )
        .job-select-title {{i18n.job_label}}

        .job-select-item(v-for="item in jobColumns" @click="selectJob(item)")
            div {{item.name}}
            .des(v-if="item.example") {{item.example}}

        .job-select-cancel(@click="showJobPopup = false") {{i18n.cancel}}
</template>

<script>
import { getJobOptions } from '@market-service/market'
import { isArray } from '@market-utils'
import { Popup } from 'vant'

// 职业状态选择弹窗
export default {
    name: 'job-select',
    components: {
        [Popup.name]: Popup
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loading: false,
            jobColumns: [] // 职位状态列表
        }
    },
    computed: {
        showJobPopup: {
            get() {
                return this.loading ? false : this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        },
        i18n() {
            return this.$t('index')
        }
    },
    mounted() {
        this.getJobOptions()
    },
    methods: {
        /**
         * 获取职业状态列表
         * @returns {Promise<void>}
         */
        async getJobOptions() {
            try {
                this.loading = true
                const { jobStatusData } = await getJobOptions()
                this.loading = false

                let list = []

                try {
                    if (jobStatusData) {
                        list = JSON.parse(jobStatusData)
                    }
                } catch (e) {
                    console.log('获取职业状态列表失败1：', e)
                }

                if (list.length) {
                    this.jobColumns = list.map(item => {
                        const index = this.$ua.lang - 1
                        const name = isArray(item.desc)
                            ? item.desc[index]
                            : item.desc
                        const example = isArray(item.example)
                            ? item.example[index]
                            : item.example

                        return {
                            id: item.key, // 职业code
                            name, // 职业name
                            mustCompany: item.companyType, // 该职业是否必填公司
                            example // 职业示例描述
                        }
                    })
                }
                // this.job_state = this.jobColumns[0]
            } catch (e) {
                this.loading = false
                import(/*webpackChunkName: 'job-list'*/ '../js/jobs.js').then(
                    ({ default: jobs }) => {
                        this.jobColumns = (this.$ua.isMainland
                            ? jobs.mainland
                            : jobs.hk
                        ).map(item => {
                            const index = this.$ua.lang - 1
                            const name = isArray(item.name)
                                ? item.name[index]
                                : item.name
                            const example = isArray(item.example)
                                ? item.example[index]
                                : item.example

                            return {
                                ...item,
                                name,
                                example
                            }
                        })
                        // this.job_state = this.jobColumns[0]
                    }
                )
                console.log('获取职业状态列表失败2：', e)
            }
        },
        /**
         * 切换职业状态
         * @param value
         */
        selectJob(value) {
            this.showJobPopup = false
            this.$emit('select-job', value)
        }
    }
}
</script>

<style scoped lang="scss">
.job-select-component {
    background: rgba(255, 255, 255, 1);
    text-align: center;

    .job-select-title {
        width: 100%;
        height: 36px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(57, 57, 57, 1);
        line-height: 36px;
        border-bottom: 1px solid rgba(121, 121, 121, 0.2);
    }

    .job-select-item {
        padding: 9px 10px 8px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 85, 255, 1);
        border-bottom: 1px solid rgba(121, 121, 121, 0.2);

        .des {
            font-size: 12px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 17px;
        }
    }

    .job-select-cancel {
        margin: 15px 20px 23px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(57, 57, 57, 0.6);
        line-height: 22px;
    }

    &.hk {
        width: 335px;
        border-radius: 30px;
        bottom: 34px;
    }

    &.mainland {
        width: 100%;
        background: rgba(241, 243, 248, 1);

        .job-select-title {
            height: 32px;
            line-height: 32px;
            background: rgba(241, 243, 248, 1);
            font-size: 14px;
            font-weight: 400;
            color: rgba(53, 53, 71, 1);
            border-bottom: 0;
        }

        .job-select-item {
            padding: 15px 10px;
            color: rgba(53, 53, 71, 1);
            background-color: white;

            &:nth-last-child(2) {
                border-bottom: 0;
            }
        }

        .job-select-cancel {
            margin: 10px 0 0;
            height: 48px;
            line-height: 48px;
            color: rgba(53, 53, 71, 1);
            background-color: white;
        }
    }
}
</style>
