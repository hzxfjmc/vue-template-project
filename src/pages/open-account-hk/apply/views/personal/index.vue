<template lang="pug">
yx-container-better.personal-material
    .top(slot="top")
        van-popup(v-model="showDatePopup" position="bottom")
                van-datetime-picker(
                    :title="$t('dataOfBirth')"
                    type="date"
                    v-model="birthDay"
                    :min-date="minDate"
                    :max-date="maxDate"
                    overlay
                    @confirm="onSureDate"
                    @cancel="onCancelDate"
                    :confirm-button-text="$t('confirmButtonInfo')"
                    :cancel-button-text="$t('cancelButtonInfo')"
                    :formatter="formatter")
        van-popup(v-model="showPopup" position="bottom")
            van-picker(
                ref="picker"
                :title="pickerTitle"
                :columns="columns[type]"
                @confirm="confirmTypeInfo"
                @cancel="cancelHandler"
                :confirm-button-text="$t('confirmButtonInfo')"
                :cancel-button-text="$t('cancelButtonInfo')"
                show-toolbar)
        van-dialog(
            :title="$t('confirmEmailInfo')"
            v-model="showEmailConfirm"
            :confirm-button-text="$t('confirmButtonInfo')"
            :cancel-button-text="$t('cancelButtonInfo')"
            @confirm="nextStepHandle"
            @cancel="cancelEmail"
            show-cancel-button)
                p.email-tip {{$t('emailConfirContent')}}
                p.email-text {{form.email}}
    .personal-top(slot="main")
        h1.upload-identify {{$t('uploadInfo')}}{{flowTextName}}
        p.upload-declare {{flowTextName}}{{$t('protectMsg')}}
        yx-upload-img.upload-padding.id-card(
            v-model="idCardImage"
            @buryPointClick="buryPointClick('id')"
            @buryPointStatus="buryPointStatus(arguments, 'id')"
            )
            uploadCertification(
                :idCardImage="idCardImage"
                :uploadText="uploadBtnText"
                :wrapHeight="163"
                :imageHeight="163")
        p.identify-into-title {{$t('peovideYou')}}{{flowTextName}}{{$t('informationInfo')}}
        yx-hk-field.field-name(
            :placeholder="numberFieldText"
            v-model.trim="form.idCardNum")
        yx-hk-field.field-name(
            :placeholder="$t('chineseNameInfo')"
            v-model.trim="chineseName"
            :fieldTip="$t('ifApplicable')")
        .english-name {{$t('englishName')}}
        .field-cell
            yx-hk-field.field-name(
                :placeholder="$t('englishNameLast')"
                v-model="form.lastName")
            yx-hk-field.field-name(
                :placeholder="$t('englishNameFirst')"
                v-model="form.firstName")
        yx-hk-field.field-name(
            :placeholder="$t('dataOfBirth')"
            arrow
            readonly
            v-model="form.birthTime"
            @click.native="selectBirthInfo()"
            )
        yx-hk-field.field-name(
            :placeholder="$t('genderInfo')"
            arrow
            readonly
            v-model="form.gender"
            @click.native="selectSelectInfo('gender')"
            )
        h1.field-title-name(v-if="openIdCardType === 2") {{$t('addIdPassport')}}
            yx-hk-field.field-name(
            :placeholder="$t('idPassport')"
            arrow
            readonly
            v-model="form.cardType"
            @click.native="selectSelectInfo('cardType')")
            .add-Identify-image(v-if="paramsCode.cardType===1")
                .front-identify-image
                    yx-upload-img.upload-padding(
                        v-model="frontIdentifyImage"
                        @buryPointClick='buryPointClick("id","front")'
                        @buryPointStatus="buryPointStatus(arguments, 'id','front')"
                        )
                        uploadCertification(
                            :idCardImage="frontIdentifyImage"
                            :uploadText="$t('uploadIdFront')"
                            :wrapHeight="109"
                            :imageHeight="90")
                .back-identify-image
                    yx-upload-img.upload-padding(
                        v-model="backIdentifyImage"
                        @buryPointClick='buryPointClick("id", "back")'
                        @buryPointStatus="buryPointStatus(arguments, 'id','back')"
                        )
                        uploadCertification(
                            :idCardImage="backIdentifyImage"
                            :uploadText="$t('uploadIdBack')"
                            :wrapHeight="109"
                            :imageHeight="90")
            .add-passport(v-else-if="paramsCode.cardType===3")
                yx-upload-img.upload-padding(
                    v-model="passportImage"
                    @buryPointClick='buryPointClick("id", "passport")'
                    @buryPointStatus="buryPointStatus(arguments, 'id','passport')"
                    )
                    uploadCertification(
                        :idCardImage="passportImage"
                        :uploadText="$t('uploadPassport')"
                        :wrapHeight="163"
                        :imageHeight="163")
        h1.field-title-name {{$t('nationality')}}
        yx-hk-field.field-name(
            :placeholder="$t('countryInfo')"
            arrow
            readonly
            v-model="form.countryName"
            @click.native="selectSelectInfo('countryName')")
        yx-hk-field.field-name(
            v-if="showCountryDetail"
            :placeholder="$t('enterCountryName')"
            v-model="otherCountryName")
        yx-hk-field.field-name(
            :placeholder="$t('placeOfBirthInfo')"
            arrow
            readonly
            v-model="form.birthLocation"
            @click.native="selectSelectInfo('birthLocation')")
        yx-hk-field.field-name(
            v-if="showBirthLocation"
            :placeholder="$t('enterCountryName')"
            v-model="otherBirthLocationName")
        h1.field-title-name {{$t('emailAdress')}}
        yx-hk-field.field-name(
            v-model.trim="form.email"
            :placeholder="$t('emailInfo')"
            clearable
            )
        h1.field-title-name {{$t('homeAddress')}}
        yx-hk-field.field-name(
            v-model.trim="address"
            maxlength=255
            :placeholder="$t('enterHomeAddress')"
            clearable
            )
        h2.address-prove-title {{$t('resiAddressPro')}}
        p.address-prove-content {{$t('addressMsg')}}
            span.check-example(@click="imgPreview(exampleImage)") {{$t('checkExample')}}
        yx-upload-img.upload-padding.address(
            v-model="addressImage"
            @buryPointClick="buryPointClick('address')"
            @buryPointStatus="buryPointStatus(arguments, 'address')"
            )
            uploadCertification(
                :idCardImage="addressImage"
                :uploadText="$t('clickUploadAddress')"
                :wrapHeight="163"
                :imageHeight="163"
            )
        p.address-prove-tip(v-if='!isReject') {{$t('skipThenLater')}}
    van-button.bottom-button(
        slot="bottom"
        size="large"
        :disabled="disabled"
        type="primary"
        @click="submitHandle") {{$t('continue')}}
</template>
<script>
import { Icon, Button, Popup, DatetimePicker, Picker, Dialog } from 'vant'
import imgPreview from '@/components/img-preview/'
import uploadCertification from '@/pages/open-account-hk/apply/biz-components/upload-certification/index.vue'
import {
    addHkIdentifyInfo,
    getHKIdentifyInfo,
    getHKOpenAccountInfo,
    verifyHkIdCodeStatus
} from '@/service/user-account-server-hk.js'
import dayjs from 'dayjs'
import {
    webViewClick,
    uploadId,
    hkAddressUpload
} from '@/utils/burying-point/index.js'
//需要有数字，不然van-datetime-picker会导致页面崩溃
const MONTHMAP = {
    '01': 'JAN1',
    '02': 'FEB2',
    '03': 'MAR3',
    '04': 'APR4',
    '05': 'MAY5',
    '06': 'JUN6',
    '07': 'JUL7',
    '08': 'AUG8',
    '09': 'SEP9',
    '10': 'OCT10',
    '11': 'NOV11',
    '12': 'DEC12'
}
export default {
    i18n: {
        zhCHS: {
            dataOfBirth: '出生日期',
            confirmInfo: '确认',
            confirmEmailInfo: '确认电邮',
            emailConfirContent:
                '电邮用于接收交易结单、账号安全提醒等重要文件和通知',
            uploadInfo: '上传',
            protectMsg:
                '是开户的必要条件，您的身份信息仅用于开户，并受到严格加密保护',
            peovideYou: '请填写您的',
            informationInfo: '信息',
            chineseNameInfo: '中文姓名',
            ifApplicable: '(如无可不填)',
            englishNameLast: '姓',
            englishNameFirst: '名',
            genderInfo: '性別',
            addIdPassport: '补充证件信息',
            idPassport: '证件类型',
            uploadIdFront: '点击上传身份证人像面',
            uploadIdBack: '点击上传身份证国徽面',
            uploadPassport: '点击上传护照',
            nationality: '国家(地区)、出生地',
            countryInfo: '国家(地区)',
            enterCountryName: '请输入国家(地区)名称',
            placeOfBirthInfo: '出生地',
            emailAdress: '电邮地址',
            emailInfo: '电邮',
            homeAddress: '通讯信息',
            enterHomeAddress: '请输入通讯地址',
            resiAddressPro: '补充该地址的证明',
            addressMsg:
                '通讯地址的有效证明，例如水电费账单、手机账单、银行月结单等，需要包含姓名、地址和日期',
            clickUploadAddress: '点击上传通讯地址',
            skipThenLater: '现在没有证明？您可以先跳过，以后补充地址和证明',
            continue: '继续',
            idPassportNo: '证件号码',
            clickUploadIdCard: '点击上传身份证',
            IDCard: '身份证',
            pleaseSelect: '请选择',
            male: '男',
            female: '女',
            hongkong: '香港',
            chinaInland: '中国内地',
            aomen: '澳门',
            taiwan: '台湾',
            singapore: '新加坡',
            england: '英国',
            india: '印度',
            canada: '加拿大',
            australia: '澳大利亚',
            otherCountry: '其他国家(地区)',
            chinaIdCard: '内地身份证',
            passportInfo: '护照',
            selectGender: '请选择性别',
            selectCountry: '请选择国家/地区',
            selectPlaceOfBir: '请选择出生地',
            passportNumberInfo: '护照号码',
            clickToUploadPass: '点击上传护照',
            hadOpenAccount: '抱歉，该证件已开户',
            connectCustonmer: '如有疑问，请联系客服',
            okToSure: '我知道了',
            emailFormatter: '邮箱格式不正确',
            sorryEgeTip: '抱歉，您的年龄不满18周岁，暂时不能开户',
            checkExample: '查看示例',
            englishName: '英文姓名'
        },
        zhCHT: {
            dataOfBirth: '出生日期',
            confirmInfo: '確認',
            confirmEmailInfo: '確認電郵',
            emailConfirContent:
                '電郵用於接收交易結單、賬號安全提醒等重要文件和通知',
            uploadInfo: '上傳',
            protectMsg:
                '是開戶的必要條件，您的身份信息僅用於開戶，並受到嚴格加密保護',
            peovideYou: '請填寫您的',
            informationInfo: '信息',
            chineseNameInfo: '中文姓名',
            ifApplicable: '(如無可不填)',
            englishNameLast: '姓',
            englishNameFirst: '名',
            genderInfo: '性別',
            addIdPassport: '補充證件信息',
            idPassport: '證件類型',
            uploadIdFront: '點擊上傳身份證人像面',
            uploadIdBack: '點擊上傳身份證國徽面',
            uploadPassport: '點擊上傳护照',
            nationality: '國家(地區)、出生地',
            countryInfo: '國家(地區)',
            enterCountryName: '請輸入國家(地區)名稱',
            placeOfBirthInfo: '出生地',
            emailAdress: '電郵地址',
            emailInfo: '電郵',
            homeAddress: '通訊信息',
            enterHomeAddress: '請輸入通訊地址',
            resiAddressPro: '補充該地址的證明',
            addressMsg:
                '通訊地址的有效證明，例如水電費賬單、手機賬單、銀行月結單等，需要包含姓名、地址和日期',
            clickUploadAddress: '點擊上傳通訊地址',
            skipThenLater: '現在沒有證明？您可以先跳過，以後補充地址和證明',
            continue: '繼續',
            idPassportNo: '證件號碼',
            clickUploadIdCard: '點擊上傳身份證',
            IDCard: '身份證',
            pleaseSelect: '請選擇',
            male: '男',
            female: '女',
            hongkong: '香港',
            chinaInland: '中國內地',
            aomen: '澳門',
            taiwan: '台灣',
            singapore: '新加坡',
            england: '英國',
            india: '印度',
            canada: '加拿大',
            australia: '澳大利亞',
            otherCountry: '其他國家(地區)',
            chinaIdCard: '內地身份證',
            passportInfo: '護照',
            selectGender: '請選擇性別',
            selectCountry: '請選擇國家/地區',
            selectPlaceOfBir: '請選擇出生地',
            passportNumberInfo: '護照號碼',
            clickToUploadPass: '點擊上傳護照',
            hadOpenAccount: '抱歉，該證件已開戶',
            connectCustonmer: '如有疑問，請聯繫客服',
            okToSure: '我知道了',
            emailFormatter: '郵箱格式不正確',
            sorryEgeTip: '抱歉，您的年齡不滿18周歲，暫時不能開戶',
            checkExample: '查看示例',
            englishName: '英文姓名'
        },
        en: {
            dataOfBirth: 'Date of Birth',
            confirmInfo: 'Confirm',
            confirmEmailInfo: 'Confirm Email',
            emailConfirContent:
                'Will send important information to this email. Such as statements of accounts, security alerts etc.',
            uploadInfo: 'Upload',
            protectMsg: 'is solely used for account opening and be protected.',
            peovideYou: 'Please Provide Your ',
            informationInfo: ' information',
            chineseNameInfo: 'Chinese Name',
            ifApplicable: '(If Applicable)',
            englishNameLast: 'lastName',
            englishNameFirst: 'firstName',
            genderInfo: 'Gender',
            addIdPassport: 'Additional ID/Passport ',
            idPassport: 'ID/Passport',
            uploadIdFront: 'Click to upload ID front photo',
            uploadIdBack: 'Click to upload ID back photo',
            uploadPassport: 'Click to upload Passport photo',
            nationality: 'Nationality',
            countryInfo: 'Country (District)',
            enterCountryName: 'Please Enter Country (District) Name',
            placeOfBirthInfo: 'Place of Birth',
            emailAdress: 'Email',
            emailInfo: 'Email',
            homeAddress: 'Home Address',
            enterHomeAddress: 'Please enter home address',
            resiAddressPro: 'Residential Address Proof',
            addressMsg:
                'Proof of Residential Address with name, address and date. Such as utility bill, phone statement...',
            clickUploadAddress: 'Upload Residential Address Proof',
            skipThenLater: 'No proof now? You can skip first and provide later',
            continue: 'Continue',
            idPassportNo: 'ID/Passport No.',
            clickUploadIdCard: 'Click to Upload',
            IDCard: ' ID Card ',
            pleaseSelect: 'Select',
            male: 'Male',
            female: 'Female',
            hongkong: 'Hong Kong',
            chinaInland: 'Mainland China',
            aomen: 'Macao',
            taiwan: 'Taiwan',
            singapore: 'Singapore',
            england: 'England',
            india: 'India',
            canada: 'Canada',
            australia: 'Australia',
            otherCountry: 'Other Country (District)',
            chinaIdCard: 'China ID Card',
            passportInfo: ' Passport ',
            selectGender: 'Select Gender',
            selectCountry: 'Select Country/District',
            selectPlaceOfBir: 'Select Place of Birth',
            passportNumberInfo: 'Passport Number',
            clickToUploadPass: 'Click to Upload',
            hadOpenAccount:
                'Sorry, this ID / Passport is already used for other account',
            connectCustonmer: 'Please contact CS if you have any question',
            okToSure: 'OK',
            emailFormatter: 'E-mail format is incorrect',
            sorryEgeTip:
                'Sorry, only person of the age of 18 years or over can open account.',
            checkExample: 'Sample',
            englishName: 'English name'
        }
    },
    components: {
        [Icon.name]: Icon,
        [Button.name]: Button,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker,
        [Picker.name]: Picker,
        [Dialog.name]: Dialog,
        uploadCertification
    },
    computed: {
        /**判断用户走的上一步的哪个流程
         * 1 -> 大陆身份证
         * 2 -> 香港居民身份证
         * 3 -> 护照
         * 4 -> 香港永久居民身份证
         *
         * cardType：1 内地身份证 2：护照
         */
        disabled() {
            if (this.openIdCardType === 2 && this.paramsCode.cardType === 1) {
                return this.disableAction[21]()
            }
            if (this.openIdCardType === 2 && this.paramsCode.cardType === 3) {
                return this.disableAction[23]()
            }
            if (this.openIdCardType === 3) {
                return this.disableAction[3]()
            }
            if (this.openIdCardType === 4) {
                return this.disableAction[4]()
            }
            return true
        }
    },
    data() {
        return {
            disableAction: {
                21: () => {
                    // 补充身份证
                    let {
                        frontIdentifyImage,
                        backIdentifyImage,
                        address,
                        addressImage,
                        idCardImage
                    } = this
                    let arr = Object.values(this.form)
                    let params = [
                        ...arr,
                        idCardImage,
                        frontIdentifyImage,
                        backIdentifyImage
                    ]
                    if (this.isReject) {
                        params = [...params, address, addressImage]
                    }
                    return params.some(item => !item)
                },
                23: () => {
                    // 护照
                    let {
                        passportImage,
                        address,
                        addressImage,
                        idCardImage
                    } = this
                    let arr = Object.values(this.form)
                    let params = [...arr, passportImage, idCardImage]
                    if (this.isReject) {
                        params = [...params, address, addressImage]
                    }
                    return params.some(item => !item)
                },
                3: () => {
                    let { address, addressImage, idCardImage } = this
                    let arr = Object.values(this.form)
                    arr.pop()
                    arr = [...arr, idCardImage]
                    if (this.isReject) {
                        arr = [...arr, address, addressImage]
                    }
                    return arr.some(item => !item)
                },
                4: () => {
                    let { address, addressImage, idCardImage } = this
                    let arr = Object.values(this.form)
                    arr.pop()
                    arr = [...arr, idCardImage]
                    if (this.isReject) {
                        arr = [...arr, address, addressImage]
                    }
                    return arr.some(item => !item)
                }
            },
            idCardImageWm: '',
            otherBirthLocationName: '',
            otherCountryName: '',
            // 开户类型
            openIdCardType: 2,
            numberFieldText: this.$t('idPassportNo'),
            uploadBtnText: this.$t('clickUploadIdCard'),
            // 护照或身份证
            flowTextName: this.$t('IDCard'),
            passportImage: '',
            frontIdentifyImage: '',
            backIdentifyImage: '',
            showExtraInfo: false,
            showEmailConfirm: false,
            showBirthLocation: false,
            showCountryDetail: false,
            pickerTitle: this.$t('pleaseSelect'),
            // 当前是哪个picker
            type: '',
            maxDate: new Date(),
            minDate: new Date(1900, 0, 1),
            birthDay: new Date(1990, 0, 1),
            idCardImage: '',
            addressImage: '',
            showPopup: false,
            showDatePopup: false,
            gender: [0, 1, 2],
            codeToValue: {
                gender: {
                    0: this.$t('male'),
                    1: this.$t('female')
                },
                countryCode: {
                    852: this.$t('hongkong'),
                    86: this.$t('chinaInland'),
                    853: this.$t('aomen'),
                    886: this.$t('taiwan'),
                    65: this.$t('singapore'),
                    44: this.$t('england'),
                    91: this.$t('india'),
                    1: this.$t('canada'),
                    61: this.$t('australia'),
                    99999: this.$t('otherCountry')
                },
                cardType: {
                    1: this.$t('chinaIdCard'),
                    3: this.$t('passportInfo')
                }
            },
            countryName: [852, 86, 853, 886, 65, 44, 91, 1, 61, 99999],
            birthLocation: [852, 86, 853, 886, 65, 44, 91, 1, 61, 99999],
            cardType: [1, 3],
            columns: {
                gender: [this.$t('male'), this.$t('female')],
                countryName: [
                    this.$t('hongkong'),
                    this.$t('chinaInland'),
                    this.$t('aomen'),
                    this.$t('taiwan'),
                    this.$t('singapore'),
                    this.$t('england'),
                    this.$t('india'),
                    this.$t('canada'),
                    this.$t('australia'),
                    this.$t('otherCountry')
                ],
                birthLocation: [
                    this.$t('hongkong'),
                    this.$t('chinaInland'),
                    this.$t('aomen'),
                    this.$t('taiwan'),
                    this.$t('singapore'),
                    this.$t('england'),
                    this.$t('india'),
                    this.$t('canada'),
                    this.$t('australia'),
                    this.$t('otherCountry')
                ],
                cardType: [this.$t('chinaIdCard'), this.$t('passportInfo')]
            },
            paramsCode: {
                gender: '',
                countryName: '',
                birthLocation: '',
                cardType: ''
            },
            chineseName: '',
            address: '',
            form: {
                idCardNum: '',
                lastName: '',
                firstName: '',
                birthTime: '',
                gender: '',
                countryName: '',
                birthLocation: '',
                email: '',
                cardType: ''
            },
            title: {
                gender: this.$t('selectGender'),
                countryName: this.$t('selectCountry'),
                birthLocation: this.$t('selectPlaceOfBir')
            },
            isReject: false,
            birthTimeInEnLang: '',
            buryPointParams: {
                page: '',
                id: '',
                name: '',
                UpdateIDresult: ''
            },
            exampleImage: `${window.location.origin}/webapp/open-account-hk/apply/example.png`
        }
    },
    /**
     * 1 -> 大陆身份证
     * 2 -> 香港身份证
     * 3 -> 护照
     * 4 -> 香港永久居民身份证
     */
    async created() {
        try {
            // 获取当前开户信息，如果是驳回的话，地址证明需要上传
            let { openAccountStatus } = await getHKOpenAccountInfo()
            openAccountStatus === 6
                ? (this.isReject = true)
                : (this.isReject = false)
            // 信息回显
            let data = await getHKIdentifyInfo()
            this.openIdCardType =
                parseInt(this.$route.query.openIdCardType) || data.identifyType
            this.handleBackData(data)
        } catch (e) {
            await this.$toast(e.msg || '网络开小差了,请稍后重试')
            this.$close()
        }
        // 香港身份证需要显示额外问题
        this.openIdCardType === 2
            ? (this.showExtraInfo = true)
            : (this.showExtraInfo = false)
        if (this.openIdCardType === 2 || this.openIdCardType === 4) {
            this.flowTextName = this.$t('IDCard')
            this.numberFieldText = this.$t('idPassportNo')
            this.uploadBtnText = this.$t('clickUploadIdCard')
        } else {
            this.flowTextName = this.$t('passportInfo')
            this.numberFieldText = this.$t('passportNumberInfo')
            this.uploadBtnText = this.$t('clickToUploadPass')
        }
    },
    beforeDestroy() {
        imgPreview('', false)
    },
    methods: {
        //上传埋点
        //type 身份证还是地址
        //cardType 临时还是永久，大陆正反面，护照
        //getPar 是否执行埋点方法标识
        buryPointClick(type, cardType, getPar) {
            if (type === 'id') {
                this.buryPointParams.page = 'openIDhk2'
                if (this.openIdCardType === 2) {
                    this.buryPointParams.id = 'hktemid'
                    this.buryPointParams.name = '上传香港临时身份证'
                    if (cardType === 'front') {
                        this.buryPointParams.id = 'cnID'
                        this.buryPointParams.name = '上传身份证'
                    } else if (cardType === 'back') {
                        this.buryPointParams.id = 'backcnID'
                        this.buryPointParams.name = '上传身份证反面'
                    } else if (cardType === 'passport') {
                        this.buryPointParams.id = 'passport'
                        this.buryPointParams.name = '上传护照'
                    }
                } else if (this.openIdCardType === 4) {
                    this.buryPointParams.id = 'hkid'
                    this.buryPointParams.name = '上传香港身份证'
                } else {
                    this.buryPointParams.id = 'passport'
                    this.buryPointParams.name = '上传护照'
                }
            } else if (type === 'address') {
                this.buryPointParams.page = 'openinfohk3'
                this.buryPointParams.id = 'address'
                this.buryPointParams.name = '上传地址证明'
            }
            if (!getPar) {
                webViewClick(
                    this.buryPointParams.page,
                    this.buryPointParams.id,
                    this.buryPointParams.name
                )
            }
        },
        //上传状态埋点
        buryPointStatus(status, type, cardType) {
            this.buryPointParams.UpdateIDresult = status[0]
            if (type === 'id') {
                this.buryPointClick(type, cardType, true)
                uploadId(
                    this.buryPointParams.id,
                    this.buryPointParams.name,
                    this.buryPointParams.UpdateIDresult
                )
            } else if (type === 'address') {
                hkAddressUpload(this.buryPointParams.UpdateIDresult)
            }
        },
        handleBackData(data) {
            this.$loading()
            this.paramsCode.cardType = data.extIdentifyType
            // 香港身份证
            if (this.openIdCardType === 2) {
                this.form.cardType = this.codeToValue.cardType[
                    data.extIdentifyType
                ]
            }
            this.form.idCardNum = data.identifyCode
            this.form.lastName = data.lastName
            this.form.firstName = data.firstName
            //英文下，birthTime用来展示 ,birthTimeInEnLang用来传给后台，格式：1990年01月01日，不然会格式错误
            if (this.$i18n.lang === 'en') {
                this.form.birthTime =
                    data.birthday &&
                    this.formatterDateToEn(
                        data.birthday.match(/\d+/gi).join('-')
                    )
                this.birthTimeInEnLang = data.birthday
            } else {
                this.form.birthTime = data.birthday
            }
            this.form.gender = this.codeToValue.gender[data.gender]
            this.form.countryName = this.handleOtherLocationfromBack(
                data.countryCode,
                data.country,
                'country'
            )
            this.form.birthLocation = this.handleOtherLocationfromBack(
                data.placeOfBirthCode,
                data.placeOfBirth,
                'birthLocation'
            )
            this.form.email = data.email
            this.chineseName = data.realName
            this.address = data.contactAddress
            this.idCardImage = data.identifyImg
            this.frontIdentifyImage = data.extIdCardFront
            this.backIdentifyImage = data.extIdCardBack
            this.passportImage = data.extPassportImg
            this.addressImage = data.proofOfAddress
            this.$close()
        },
        handleOtherLocationfromBack(code, name, flag) {
            if (code === 99999 && flag === 'country') {
                this.showCountryDetail = true
                this.otherCountryName = name
            }
            if (code === 99999 && flag === 'birthLocation') {
                this.showBirthLocation = true
                this.otherBirthLocationName = name
            }
            return this.codeToValue.countryCode[code]
        },
        async nextStepHandle() {
            let {
                birthTime,
                countryName,
                email,
                idCardNum,
                lastName,
                firstName,
                birthLocation
            } = this.form
            let {
                gender: genderCode,
                countryName: countryCode,
                birthLocation: birthLocationCode,
                cardType
            } = this.paramsCode
            let {
                frontIdentifyImage,
                backIdentifyImage,
                idCardImage,
                addressImage,
                passportImage,
                chineseName,
                address
            } = this
            let params = {
                birthday:
                    this.$i18n.lang === 'en'
                        ? this.birthTimeInEnLang
                        : birthTime,
                contactAddress: address,
                country: this.handleOtherLocation(
                    countryName,
                    countryCode,
                    'country'
                ),
                countryCode: countryCode
                    ? countryCode
                    : this.countryName[this.handleValueToCode(countryName)],
                email: email,
                extIdentifyType: cardType,
                gender: genderCode,
                identifyCode: idCardNum,
                placeOfBirth: this.handleOtherLocation(
                    birthLocation,
                    birthLocationCode,
                    'birthLocation'
                ),
                placeOfBirthCode: birthLocationCode
                    ? birthLocationCode
                    : this.birthLocation[this.handleValueToCode(birthLocation)],
                realName: chineseName,
                lastName: lastName,
                firstName: firstName,
                idCardFront: frontIdentifyImage,
                idCardBack: backIdentifyImage,
                identifyImage: idCardImage,
                passportImg: passportImage,
                proofOfAddress: addressImage
            }
            try {
                await addHkIdentifyInfo(params)
                this.showEmailConfirm = false
                // asset-status
                this.$router.push(`/step/3`)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        handleValueToCode(name) {
            let index = this.columns.countryName.findIndex(
                item => item === name
            )
            return index
        },
        handleOtherLocation(name, pCode, flag) {
            // 回显的时候，如果没有勾选，code 没有值，需要根据name 重新赋值
            let index = this.handleValueToCode(name)
            let code = pCode ? pCode : this.countryName[index]
            if (code === 99999 && flag === 'country') {
                return this.otherCountryName
            }
            if (code === 99999 && flag === 'birthLocation') {
                return this.otherBirthLocationName
            }
            return name
        },
        cancelEmail() {
            this.showEmailConfirm = false
        },
        confirmTypeInfo(val, index) {
            this.form[this.type] = val
            // 获取选中的索引
            this.paramsCode[this.type] = this[this.type][index]
            if (this.type === 'countryName') {
                this.paramsCode[this.type] === 99999
                    ? (this.showCountryDetail = true)
                    : (this.showCountryDetail = false)
            }
            if (this.type === 'birthLocation') {
                this.paramsCode[this.type] === 99999
                    ? (this.showBirthLocation = true)
                    : (this.showBirthLocation = false)
            }
            this.showPopup = false
        },
        cancelHandler() {
            this.showPopup = false
        },
        selectBirthInfo() {
            this.showDatePopup = true
            //如果是英文
            if (this.$i18n.lang === 'en') {
                this.$nextTick(() => {
                    this.replaceNumberOfMonth()
                })
            }
        },
        //替換月份中的數字
        replaceNumberOfMonth() {
            let timePickerVnode = document
                .getElementsByClassName('van-picker-column')[1]
                .getElementsByClassName('van-picker-column__item')
            for (let i = 0; i < timePickerVnode.length; i++) {
                timePickerVnode[i].innerHTML = timePickerVnode[
                    i
                ].innerHTML.replace(/\d/g, '')
            }
        },
        selectSelectInfo(type) {
            this.pickerTitle = this.title[type]
            this.type = type
            this.showPopup = true
            this.$nextTick(() => {
                this.$refs.picker.setColumnIndex(
                    0,
                    this.columns[type].indexOf(this.form[type])
                )
            })
        },
        onSureDate() {
            //英文下，birthTime用来展示 ,birthTimeInEnLang用来传给后台，格式：1990年01月01日，不然会格式错误
            if (this.$i18n.lang === 'en') {
                this.form.birthTime = this.formatterDateToEn(this.birthDay)
                this.birthTimeInEnLang = dayjs(this.birthDay).format(
                    'YYYY年MM月DD日'
                )
            } else {
                this.form.birthTime = dayjs(this.birthDay).format(
                    'YYYY年MM月DD日'
                )
            }
            this.showDatePopup = false
        },
        //英文下展示
        formatterDateToEn(time) {
            let date = dayjs(time).format('YYYY-MM-DD')
            date = date.split('-')
            date[1] = MONTHMAP[date[1]].replace(/\d/g, '')
            date[2] = this.daysToFormatter(date[2])
            return date.join(' ')
        },
        onCancelDate() {
            this.form.birthTime = ''
            this.birthTimeInEnLang = ''
            this.showDatePopup = false
        },
        formatter(type, value) {
            if (type === 'year') {
                if (this.$i18n.lang === 'en') {
                    return value
                }
                return `${value}年`
            } else if (type === 'month') {
                if (this.$i18n.lang === 'en') {
                    return MONTHMAP[value]
                }
                return `${value}月`
            } else if (type === 'day') {
                if (this.$i18n.lang === 'en') {
                    return this.daysToFormatter(value)
                }
                return `${value}日`
            }
            return value
        },
        daysToFormatter(day) {
            let lastNumber = day.substr(-1)
            if (lastNumber === '1') {
                return day + 'st'
            } else if (lastNumber === '2') {
                return day + 'nd'
            } else if (lastNumber === '3') {
                return day + 'rd'
            } else {
                return day + 'th'
            }
        },
        async submitHandle() {
            let val = this.checkParams()
            if (!val) {
                return false
            }
            try {
                let data = await verifyHkIdCodeStatus({
                    identifyCode: this.form.idCardNum
                })
                // data true: 开过户， false: 没有开户
                data
                    ? this.$alert({
                          message: `<span>${this.$t(
                              'hadOpenAccount'
                          )}<span><br><span>${this.$t(
                              'connectCustonmer'
                          )}</span>`,
                          confirmButtonText: this.$t('okToSure'),
                          className: 'opened-account'
                      })
                    : (this.showEmailConfirm = true)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        checkParams() {
            let { email } = this.form
            if (!this.$reg.email(email)) {
                this.$alert(this.$t('emailFormatter'))
                return false
            }
            if (this.handleTimeLength() < 18) {
                this.$alert(this.$t('sorryEgeTip'))
                return false
            }
            return true
        },
        // 计算年龄
        handleTimeLength() {
            let timeLength = dayjs(new Date()).diff(
                dayjs(this.birthDay),
                'year'
            )
            return timeLength
        },
        imgPreview(url) {
            imgPreview(url)
        }
    }
}
</script>
<style lang="scss">
body .van-dialog.opened-account {
    width: 230px !important;
}
</style>
<style lang="scss" scope>
.personal-material {
    .top {
        .email-tip {
            padding: 10px 37px;
            // height: 40px;
            text-align: center;
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
        }
        .email-text {
            margin: 12px 0 24px 0;
            text-align: center;
            height: 20px;
            font-size: 22px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: $hk-primary-color;
            line-height: 20px;
        }
    }
    .personal-top {
        .english-name {
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            padding-top: 0.2rem;
            line-height: 0.4rem;
        }
        .field-cell {
            display: flex;
            justify-content: space-between;
        }
        .upload-padding {
            padding-top: 16px;
        }
        padding: 2 * $global-padding $global-padding;
        .add-Identify-image {
            width: 100%;
            display: flex;
            .front-identify-image {
                width: 160px;
            }
            .back-identify-image {
                margin-left: 19px;
                width: 160px;
            }
        }
        .upload-identify {
            font-family: PingFangHK-Medium;
            font-size: 28px;
            font-weight: 500;
            line-height: 40px;
            color: rgba(57, 57, 57, 1);
        }
        .upload-declare {
            font-family: PingFangHK-Regular;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: rgba(57, 57, 57, 1);
            opacity: 0.4;
            margin-top: 4px;
        }
        .id-card {
            .upload-operate-warp {
                border: 0.02rem dashed $hk-primary-color;
                .upload-operate-icon {
                    border: 0.02rem solid $hk-primary-color;
                    i.icon-plus {
                        color: $hk-primary-color !important;
                    }
                }
                .upload-operate-click {
                    color: $hk-primary-color;
                }
            }
            .again-upload-text {
                background-color: rgba(1, 33, 220, 0.5);
            }
        }
        .address {
            .upload-operate-warp {
                border: 0.02rem dashed $hk-primary-color;
                .upload-operate-icon {
                    border: 0.02rem solid $hk-primary-color;
                    i.icon-plus {
                        color: $hk-primary-color !important;
                    }
                }
                .upload-operate-click {
                    color: $hk-primary-color;
                }
            }
        }
        .identify-into-title {
            margin-top: 20px;
            height: 20px;
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 20px;
            opacity: 0.4;
        }
        .field-name {
            font-size: 16px;
        }
        .field-title-name {
            margin-top: 24px;
            font-size: 28px;
            font-family: PingFangHK-Medium;
            font-weight: 500;
            color: rgba(57, 57, 57, 1);
            line-height: 40px;
        }
        .address-prove-title {
            margin-top: 14px;
            font-size: 20px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 28px;
        }
        .address-prove-content {
            margin-top: 6px;
            height: 40px;
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
            .check-example {
                padding-left: 5px;
                color: $hk-primary-color;
            }
        }
        .address-prove-tip {
            text-align: center;
            height: 17px;
            font-size: 12px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: $hk-primary-color;
            line-height: 17px;
            margin-top: 10px;
        }
    }
}
</style>
