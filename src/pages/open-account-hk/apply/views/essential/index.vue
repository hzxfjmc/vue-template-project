<template lang="pug">
yx-container-better.essential-container
    .essential-top(slot="top")
        van-popup(position="bottom" v-model="showPopup")
                van-picker(
                    ref="picker"
                    :columns="columns[type]"
                    @confirm="confirmTypeInfo"
                    @cancel="cancelHandler"
                    :confirm-button-text="$t('confirmButtonInfo')"
                    :cancel-button-text="$t('cancelButtonInfo')"
                    show-toolbar)
        yx-hk-popup(
            v-model="showJobStatus"
            position="bottom"
            :list="jobStatusList"
            :title="$t(`employmentStatus`)"
            @checkedHandle="confirmJobInfo")
        van-dialog.tax-dialog-wrap(
            v-model="showTaxInfo"
            :confirm-button-text="$t('okToSure')"
            @confirm="showTaxInfo=true")
                .tax-title {{$t('taxMessage')}}
                .tax-tip {{$t('taxesTinNumber')}}
                .tax-content  {{$t('taxNumIsIdCard')}}
    .essential-container(slot="main")
        .essential-title {{$t('employment')}}
        yx-hk-field(
            :placeholder="$t('employmentStatus')"
            type='text'
            readonly
            v-model='form.jobStatus'
            @click.native="showJobStatus = true"
            arrow
        )
        .is-noVisible(v-if="paramsCode.jobStatus===1001 || paramsCode.jobStatus===1002")
            yx-hk-field(
                :placeholder="$t('companyNameInfo')"
                type='text'
                v-model='form.companyName'
            )
            yx-hk-field(
                :placeholder="$t('industryInfo')"
                type='text'
                readonly
                v-model='form.companyBusiness'
                @click.native="selectTypeInfo('companyBusiness')"
                arrow)
            yx-hk-field(
                :placeholder="$t('occupation')"
                type='text'
                readonly
                v-model='form.jobPosition'
                @click.native="selectTypeInfo('jobPosition')"
                arrow)
        .essential-title
            span {{$t('taxPeopleMsg')}}
            i.iconfont.icon-wenhao.icon-font-style(@click="showTaxInfo=true")
        .taxInfoTip {{$t('proveIdentifyMsg')}}
        transition-group.transition-group(type="animation" tag="div")
            .template(
                v-for="tax, index in form.taxList"
                :key="tax.countryCode"
                )
                yx-hk-field(
                    :placeholder="$t('taxArea')"
                    type='text'
                    readonly
                    v-model='tax.country'
                    @click.native="selectTypeInfo('country', index)"
                    arrow
                )
                yx-hk-field(v-if="tax.countryCode === 99999")(
                    :placeholder="$t('taxCountry')"
                    type='text'
                    v-model='tax.countryDetailName'
                )
                yx-hk-field(
                    :placeholder="$t('taxNumberInfo')"
                    :field-tip="$t('IDCardNumbre')"
                    type='text'
                    v-model='tax.taxNumber'
                )
                .delete-tax(v-if="index > 0" @click="deleteHandler(index)") {{$t('deleteInfo')}}
        .add-more(
            v-if="isShowMore"
            :class="{active: canAdd}"
            ref="add"
            @click="addTaxList") +{{$t('addMore')}}
    van-button(
        slot="bottom"
        size="large"
        :disabled="disabled"
        type="primary"
        @click="submitHandler"
        class="bottom-button" ) {{$t('continureInfo')}}
</template>

<script>
import { Icon, Popup, Picker, Notify } from 'vant'
import {
    getHKJobAndTaxInfo,
    addHKJobAndTaxInfo
} from '@/service/user-account-server-hk.js'
export default {
    name: 'finance',
    i18n: {
        zhCHS: {
            notify: `开户资料已完成70%，预计3分钟完成`,
            okToSure: '知道了',
            taxMessage: '税务信息',
            taxesTinNumber:
                '请填写您的纳税所在国家（地区）和对应的税务编号（TIN）',
            taxNumIsIdCard:
                '对于在香港/中国内地纳税居民，税务编号是您的香港/中国内地身份证号',
            employment: '职业',
            employmentStatus: '职业状况',
            companyNameInfo: '公司名称',
            industryInfo: '所属行业',
            occupation: '职位',
            taxPeopleMsg: '税务居民信息',
            proveIdentifyMsg: '如您在多个地区拥有税务居民身份，请提供所有信息',
            taxArea: '税务管辖区',
            taxCountry: '请输入纳税国家（地区）名称',
            taxNumberInfo: '税务编号',
            IDCardNumbre: '(如身份证号)',
            deleteInfo: '刪除',
            addMore: '添加更多',
            continureInfo: '继续',
            employedInfo: '受雇',
            selfEmployedInfo: '自雇',
            unEmployedInfo: '待业',
            houseWifeInfo: '家庭主妇',
            studentInfo: '学生',
            retiredInfo: '退休',
            counterArrInfo: [
                '香港',
                '中国内地',
                '澳门',
                '台湾',
                '新加坡',
                '英国',
                '印度',
                '加拿大',
                '澳大利亚',
                '其他国家(地区)'
            ],
            noRepeatCountry: '请不要添加重复国家',
            hongKongCoun: '香港',
            noMoreThanFive: '最多只能添加5条税务信息',
            employedByCompany: '例如就职于公司',
            runningETC: '例如创业、自由职业、店铺经营'
        },
        zhCHT: {
            notify: `開戶資料已完成70%，預計3分鐘完成`,
            okToSure: '知道了',
            taxMessage: '稅務信息',
            taxesTinNumber:
                '請填寫您的納稅所在國家（地區）和對應的稅務編號（TIN）',
            taxNumIsIdCard:
                '對於在香港/中國內地納稅居民，稅務編號是您的香港/中國內地身份證號',
            employment: '職業',
            employmentStatus: '職業狀況',
            companyNameInfo: '公司名稱',
            industryInfo: '所屬行業',
            occupation: '職位',
            taxPeopleMsg: '稅務居民資料',
            proveIdentifyMsg: '如您在多個地區擁有稅務居民身份，請提供所有資料',
            taxArea: '稅務管轄區',
            taxCountry: '請輸入納稅國家（地區）名稱',
            taxNumberInfo: '稅務編號',
            IDCardNumbre: '(如身份證號)',
            deleteInfo: '删除',
            addMore: '添加更多',
            continureInfo: '繼續',
            employedInfo: '受僱',
            selfEmployedInfo: '自僱',
            unEmployedInfo: '待業',
            houseWifeInfo: '家庭主婦',
            studentInfo: '學生',
            retiredInfo: '退休',
            counterArrInfo: [
                '香港',
                '中國內地',
                '澳門',
                '台灣',
                '新加坡',
                '英國',
                '印度',
                '加拿大',
                '澳大利亞',
                '其他國家(地區)'
            ],
            noRepeatCountry: '請不要添加重複國家',
            hongKongCoun: '香港',
            noMoreThanFive: '最多只能添加5條稅務資料',
            employedByCompany: '例如就職于公司',
            runningETC: '例如創業、自由職業、店鋪經營'
        },
        en: {
            notify: `70% completed, 3 minutes left`,
            okToSure: 'OK',
            taxMessage: 'Tax Jurisdiction',
            taxesTinNumber:
                'Specify the jurisdiction of tax residency and the corresponding tax identification number.',
            taxNumIsIdCard:
                'If you are a tax resident of Hong Kong / Mainlan China, your TIN is your ID number.',
            employment: 'Employment',
            employmentStatus: 'Employment Status',
            companyNameInfo: 'Name of Employer',
            industryInfo: 'Industry',
            occupation: 'Occupation / Title',
            taxPeopleMsg: 'Tax Jurisdiction',
            proveIdentifyMsg:
                'If you have tax resident status in multiple regions, please provide all information',
            taxArea: 'Jurisdiction of Residence',
            taxCountry: 'Please Enter Tax Residence',
            taxNumberInfo: 'TIN',
            IDCardNumbre: '(e.g. ID Number)',
            deleteInfo: 'Delete',
            addMore: 'Add',
            continureInfo: 'Continue',
            employedInfo: 'Employed',
            selfEmployedInfo: 'Self-employed',
            unEmployedInfo: 'Unemployed',
            houseWifeInfo: 'Housewife',
            studentInfo: 'Student',
            retiredInfo: 'Retired',
            counterArrInfo: [
                'Hong Kong',
                'Mainland China',
                'Macao',
                'Taiwan',
                'Singapore',
                'England',
                'India',
                'Canada',
                'Australia',
                'Other'
            ],
            noRepeatCountry: 'Please do not add duplicate countries',
            hongKongCoun: 'Hong Kong',
            noMoreThanFive: 'You can only add up to 5 tax information',
            employedByCompany: 'Employed by company',
            runningETC: 'e.g. Running own business, freelancer, etc'
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    data() {
        return {
            showJobStatus: false,
            isShowMore: true,
            showTaxInfo: false,
            taxCurrentIndex: 0,
            showPopup: false,
            country: [852, 86, 853, 886, 65, 44, 91, 1, 61, 99999],
            companyBusiness: [],
            jobPosition: [],
            jobStatus: [1001, 1002, 1003, 1004, 1005, 1006],
            codeToValue: {
                jobStatus: {
                    1001: this.$t('employedInfo'),
                    1002: this.$t('selfEmployedInfo'),
                    1003: this.$t('unEmployedInfo'),
                    1004: this.$t('houseWifeInfo'),
                    1005: this.$t('studentInfo'),
                    1006: this.$t('retiredInfo')
                },
                companyBusiness: {},
                jobPosition: {}
            },
            jobStatusList: [
                {
                    text: this.$t('employedInfo'),
                    tip: this.$t('employedByCompany')
                },
                {
                    text: this.$t('selfEmployedInfo'),
                    tip: this.$t('runningETC')
                },
                { text: this.$t('unEmployedInfo') },
                { text: this.$t('houseWifeInfo') },
                { text: this.$t('studentInfo') },
                { text: this.$t('retiredInfo') }
            ],
            columns: {
                companyBusiness: [],
                jobPosition: [],
                country: this.$t('counterArrInfo')
            },
            paramsCode: {
                companyBusiness: '',
                jobPosition: '',
                jobStatus: ''
            },
            type: 'companyBusiness',
            form: {
                companyBusiness: '',
                companyName: '',
                jobPosition: '',
                jobStatus: '',
                taxList: [
                    {
                        country: '',
                        countryCode: '',
                        taxNumber: '',
                        countryDetailName: ''
                    }
                ]
            },
            hkTaxList: '',
            identifyType: ''
        }
    },
    async created() {
        try {
            const data = await getHKJobAndTaxInfo()
            await this.getAppSystem()
            let {
                identifyType,
                hkTaxList,
                companyBusiness,
                companyName,
                jobPosition,
                jobStatusCode,
                taxList
            } = data
            // 注意覆盖问题，有可能会被覆盖，只有在已经走过流程的，才能进行赋值
            if (jobStatusCode && companyBusiness) {
                this.paramsCode.companyBusiness = companyBusiness
            }
            this.identifyType = identifyType
            this.hkTaxList = hkTaxList || {}
            this.paramsCode.jobPosition = jobPosition
            this.paramsCode.jobStatus = jobStatusCode
            Object.keys(this.codeToValue.companyBusiness).forEach(key => {
                if (key.trim() == companyBusiness) {
                    this.form.companyBusiness = this.codeToValue.companyBusiness[
                        key
                    ]
                }
            })
            this.form.companyName = companyName
            if (!jobStatusCode) {
                //未填写资料时提示
                Notify({
                    message: this.$t('notify'),
                    duration: 3000,
                    background: 'rgba(1,33,220,1)'
                })
            }
            this.form.jobStatus = this.codeToValue.jobStatus[jobStatusCode]
            this.form.jobPosition = this.codeToValue.jobPosition[jobPosition]
            if (taxList.length > 0) {
                this.form.taxList = taxList
                // 如果===5条，就不显示添加按钮
                if (taxList.length === 5) {
                    this.isShowMore = false
                }
            }
        } catch (e) {
            this.$toast(e.msg)
        }
    },
    methods: {
        confirmJobInfo(val) {
            this.showJobStatus = false
            this.paramsCode['jobStatus'] = this['jobStatus'][val.index]
            this.form['jobStatus'] = val.value.text
        },
        async getAppSystem() {
            let { list } = await this.$configService.getAppSystemKh([
                'KHHY',
                'KHZW'
            ])
            let companyBusinessList = JSON.parse(list[0].content)
            let jobPositionList = JSON.parse(list[1].content)
            this.codeToValue.companyBusiness = companyBusinessList
            this.codeToValue.jobPosition = jobPositionList
            this.$set(
                this.columns,
                'companyBusiness',
                Object.values(companyBusinessList)
            )
            this.$set(
                this.form,
                'companyBusiness',
                companyBusinessList[list[0].defaultValue]
            )
            this.companyBusiness = Object.keys(companyBusinessList)
            this.$set(this.paramsCode, 'companyBusiness', list[0].defaultValue)
            this.$set(
                this.columns,
                'jobPosition',
                Object.values(jobPositionList)
            )
            this.$set(this.paramsCode, 'jobPosition', list[1].defaultValue)
            this.$set(
                this.form,
                'jobPosition',
                jobPositionList[list[1].defaultValue]
            )
            this.jobPosition = Object.keys(jobPositionList)
        },
        async submitHandler() {
            let { companyBusiness, jobPosition, jobStatus } = this.paramsCode
            let { companyName, taxList } = this.form
            try {
                let params = {
                    companyBusiness: companyBusiness,
                    companyName: companyName,
                    jobPosition: jobPosition,
                    jobStatusCode: jobStatus,
                    addTaxList: this.handleTaxList(taxList)
                }
                if (![1001, 1002].includes(jobStatus)) {
                    params.companyBusiness = null
                    params.companyName = null
                    params.jobPosition = null
                }
                await addHKJobAndTaxInfo(params)
                // confirm-info
                this.$router.push(`/step/5`)
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        handleTaxList(list) {
            let val = list.map(item => {
                if (item.countryCode === 99999) {
                    item.country = item.countryDetailName
                    return item
                } else {
                    return item
                }
            })
            return val
        },
        selectTypeInfo(type, index) {
            this.type = type
            this.showPopup = !this.showPopup
            if (type !== 'country') {
                this.$nextTick(() => {
                    this.$refs.picker.setColumnIndex(
                        0,
                        this.columns[this.type].indexOf(this.form[this.type])
                    )
                })
            } else {
                this.$nextTick(() => {
                    this.$refs.picker.setColumnIndex(
                        0,
                        this.columns[this.type].indexOf(
                            this.form.taxList[index][this.type]
                        )
                    )
                    this.taxCurrentIndex = index
                })
            }
        },
        cancelHandler() {
            this.showPopup = false
        },
        deleteHandler(index) {
            this.form.taxList.splice(index, 1)
            if (this.form.taxList.length < 5) {
                this.isShowMore = true
            }
        },
        /**
         * 1 -> 大陆身份证
         * 2 -> 香港身份证
         * 3 -> 护照
         * 4 -> 香港永久居民身份证
         */
        confirmTypeInfo(val, index) {
            this.showPopup = false
            // 香港永久居民身份证|| 香港居民身份证开户,纳税国家选择“香港”时，税务编号默认带入香港身份证号；选择其他国家(地区)时，不带入
            let isRepeat = this.form.taxList.some(item => item.country === val)
            if (isRepeat) {
                this.$toast(this.$t('noRepeatCountry'))
                return
            }
            if (this.type === 'country') {
                if (
                    (this.identifyType === 2 || this.identifyType === 4) &&
                    val === this.$t('hongKongCoun')
                ) {
                    this.form.taxList[
                        index
                    ].taxNumber = this.hkTaxList.taxNumber
                }
                this.form.taxList[this.taxCurrentIndex].country = val
                this.form.taxList[this.taxCurrentIndex].countryCode = this[
                    this.type
                ][index]
            } else {
                this.paramsCode[this.type] = this[this.type][index]
                this.form[this.type] = val
            }
        },
        addTaxList() {
            this.form.taxList.push({
                country: '',
                countryCode: '',
                taxNumber: '',
                countryDetailName: ''
            })
            if (this.form.taxList.length === 5) {
                this.isShowMore = false
                this.$toast(this.$t('noMoreThanFive'))
                return
            }
            this.$nextTick(() => {
                this.$refs.add.scrollIntoView({ behavior: 'smooth' })
            })
        }
    },
    computed: {
        inJob() {
            return (
                [this.$t('employedInfo'), this.$t('selfEmployedInfo')].indexOf(
                    this.form.jobStatus
                ) > -1
            )
        },
        tax() {
            return this.form.taxList[this.form.taxList.length - 1]
        },
        taxFlag() {
            return !this.tax.countryCode || !this.tax.taxNumber
        },
        // 按钮是否可用
        disabled() {
            if (this.inJob) {
                return (
                    Object.values(this.form).some(item => {
                        if (
                            typeof item === 'string' ||
                            typeof item === 'number'
                        ) {
                            return !(item + '').trim()
                        } else {
                            return !item
                        }
                    }) || this.taxFlag
                )
            } else {
                return (
                    !(this.form.jobStatus && this.form.taxList.length > 0) ||
                    this.taxFlag
                )
            }
        },
        canAdd() {
            // 全部不为空时可以添加
            return this.form.taxList.every(
                item => item.countryCode && item.taxNumber
            )
        }
    }
}
</script>

<style lang="scss">
.essential-container {
    .tax-dialog-wrap {
        padding: 15px 15px 0 15px;
        text-align: center;
        .tax-title {
            font-size: 20px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 28px;
        }
        .tax-tip {
            padding-top: 10px;
        }
        .tax-content {
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }
    .idcard-container {
        .inputing.van-cell:after,
        .attention-line.van-cell:after {
            content: ' ';
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
            left: 0;
            right: 0;
            bottom: 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid rgba(255, 56, 84, 0.9);
        }
        .inputing.van-cell:after {
            border-bottom: 1px solid $hk-primary-color;
        }
        .van-cell {
            color: $hk-text-color7;
        }
        .van-picker__cancel {
            color: $hk-text-color5;
        }
        .pingyin {
            .flex {
                .van-field__body {
                    padding-right: 15px;
                }
            }
        }
        .van-cell {
            line-height: 29px;
        }
        .van-field__body input {
            color: $hk-text-color;
        }
    }
}
</style>

<style lang="scss" scoped>
$attention-color: rgba(255, 56, 84, 0.9);
.essential-container {
    .essential-container {
        padding: 0 $global-padding;
        .essential-title {
            display: flex;
            align-items: center;
            font-size: 28px;
            padding: $global-padding 0;
            .icon-font-style {
                padding-left: 6px;
            }
        }
        .taxInfoTip {
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: $hk-text-color3;
        }
        .delete-tax,
        .add-more {
            color: $hk-text-color3;
            text-align: center;
            padding: 10px 0;
        }
        .add-more.active,
        .delete-tax {
            color: $hk-primary-color;
        }
        .p-tips {
            font-size: 12px;
            padding-top: 10px;
            position: relative;
            z-index: 100;
            ul {
                display: flex;
                width: 100%;
                overflow: scroll;
                li span {
                    display: inline-block;
                    color: $hk-primary-color;
                    height: 30px;
                    padding: 0 10px;
                    line-height: 30px;
                    font-size: 12px;
                    text-align: center;
                    margin-left: 14px;
                    border-radius: 3px;
                    border: 1px solid $hk-primary-color;
                }
            }
        }
        .van-cell {
            padding: 10px 15px 10px 0;
        }
        .attention {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: $attention-color;
            .icon-attention {
                margin-right: 3px;
            }
        }
    }
    .upload-idcard {
        padding: 14px 0 20px;
    }
    .relation {
        margin-top: 30px;
    }
    .p-tips {
        font-size: 12px;
        padding-bottom: 30px;
    }
}
</style>
