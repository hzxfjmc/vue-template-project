import COS from 'cos-js-sdk-v5'
import jsBridge from '@/utils/js-bridge.js'
import dayjs from 'dayjs'
import { getCostemp } from '@/service/config-manager.js'
import { BUCKET_ENV } from '@/utils/DOMAIN'
import { lang } from '@/utils/html-utils'
import { webViewClick, uploadId } from '@/utils/burying-point/index.js'
const langMap = {
    zhCHS: {
        defaultUploadTitle: '请选择图片上传方式',
        idCardTitle: '请选择上传身份证件照方式',
        uploading: '上传中'
    },
    zhCHT: {
        defaultUploadTitle: '請選擇圖片上傳方式',
        idCardTitle: '請選擇上傳身份證件照方式',
        uploading: '上傳中'
    },
    en: {
        defaultUploadTitle: 'Please select image upload method',
        idCardTitle: 'Please choose to upload ID photo',
        uploading: 'uploading'
    }
}
export default {
    data() {
        return {
            // 压缩次数
            times: 1
        }
    },
    methods: {
        dataURLtoFile(dataurl, filename = 'default.jpg') {
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], filename, { type: mime })
        },
        // 图片压缩()
        compressImage(base64) {
            return new Promise((resolve, reject) => {
                const naturalSize = parseInt(base64.length / 1024)
                let idFront = this.method === 'get_idcard_image_side_front'
                let idBack = this.method === 'get_idcard_image_side_back'
                // 上传身份证正面
                if (
                    ((idFront || idBack) && naturalSize < 300) ||
                    (!idFront && !idBack && naturalSize < 2048)
                ) {
                    resolve(base64)
                    return
                }
                let quality
                if (idFront || idBack) {
                    quality = Math.sqrt(naturalSize / 200)
                } else {
                    quality = Math.sqrt(naturalSize / 1024)
                }
                const img = new Image()
                img.src = base64
                img.onload = () => {
                    //生成canvas
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = img.naturalWidth / quality
                    canvas.height = img.naturalHeight / quality
                    ctx.fillStyle = '#fff'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    const newBase64 = canvas.toDataURL('image/jpeg')
                    if (!idFront && !idBack) {
                        resolve(newBase64)
                    } else if (newBase64.length / 1024 > 300) {
                        console.log('大于300K，重复压缩')
                        this.times++
                        this.compressImage(newBase64)
                            .then(base64 => resolve(base64))
                            .catch(e => reject(e))
                    } else {
                        resolve(newBase64)
                    }
                }
                img.error = e => {
                    reject(e)
                }
            })
        },
        // 获取上传图片权限
        async getAuthorization(method = 'PUT', pathName = '/apply') {
            try {
                let data = await getCostemp()
                let Authorization = COS.getAuthorization({
                    SecretId: data.tmpSecretId,
                    SecretKey: data.tmpSecretKey,
                    Method: method,
                    Pathname: pathName
                })
                return {
                    XCosSecurityToken: data.sessionToken,
                    Authorization
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        // TODO: 代码待优化 promise
        baseUploadFile(file) {
            return new Promise(async (resolve, reject) => {
                if (!file) return
                this.$loading(`${langMap[lang]['uploading'] || '上传中'}...`)
                // TODO： 文件重名就会被覆盖，理论上这里是存在重复，两人同一时刻（毫秒）请求10万分之一概率 可以忽略不计，后续需优化\
                let Key =
                    '/h5/' +
                    dayjs().format('YYYY-MM-DD') +
                    '/' +
                    this.$guid() +
                    file.name
                let url = `https://web-${BUCKET_ENV}-1257884527.cos.ap-guangzhou.myqcloud.com${Key}` // http -> https
                let xhr = new XMLHttpRequest()
                xhr.open('PUT', url, true)
                let {
                    XCosSecurityToken,
                    Authorization
                } = await this.getAuthorization('PUT', Key)
                xhr.setRequestHeader('Authorization', Authorization)
                XCosSecurityToken &&
                    xhr.setRequestHeader(
                        'x-cos-security-token',
                        XCosSecurityToken
                    )
                xhr.upload.onprogress = function(e) {
                    console.log(
                        '上传进度 ' +
                            Math.round((e.loaded / e.total) * 10000) / 100 +
                            '%'
                    )
                }
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 206) {
                        resolve(url)
                        this.$emit('buryPointStatus', true)
                    } else {
                        reject(
                            '文件 ' + Key + ' 上传失败，状态码：' + xhr.status
                        )
                        this.$emit('buryPointStatus', false)
                    }
                    this.$close()
                }
                xhr.onerror = () => {
                    reject(
                        '文件 ' +
                            Key +
                            ' 上传失败，请检查是否没配置 CORS 跨域规则'
                    )
                    this.$emit('buryPointStatus', false)
                    this.$close()
                }
                xhr.send(file)
                //this.$close()
            })
        },
        async webUploadFile() {
            try {
                let url = await this.baseUploadFile(
                    this.$refs.fileSelector.files[0]
                )
                this.imgUrl = url
                this.$refs.fileSelector.value = ''
            } catch (e) {
                this.$toast(e)
            }
        },
        // base64 直接上传
        async uploadFileBybase64(base64) {
            try {
                base64 = await this.compressImage(base64)
                return await this.baseUploadFile(this.dataURLtoFile(base64))
            } catch (e) {
                throw e
            }
        },
        // app -> base64 -> file
        async appUploadFile(method, isYouxinApp, title) {
            this.$emit('buryPointClick')
            try {
                title = langMap[lang]['defaultUploadTitle'] || title
                if (!isYouxinApp) {
                    return
                }
                if (method.indexOf('idcard') > -1) {
                    title =
                        langMap[lang]['idCardTitle'] ||
                        '请选择上传身份证件照方式'
                }
                //只要点击就走这里
                if (method.indexOf('get_idcard_image_side_front') > -1) {
                    webViewClick('openID2', 'cnID', '上传身份证')
                }
                if (method.indexOf('get_idcard_image_side_back') > -1) {
                    webViewClick('openID2', 'backcnID', '上传身份证反面')
                }
                let data = await jsBridge.callApp(method, { title })
                this.$loading(`${langMap[lang]['uploading'] || '上传中'}...`)
                let base64 = 'data:image/jpeg;base64,' + data
                let time1 = new Date().getTime()
                base64 = await this.compressImage(base64)
                let time2 = new Date().getTime()
                console.log('total-time', time2 - time1)
                console.log('compress-times', this.times)
                let url = await this.baseUploadFile(this.dataURLtoFile(base64))
                this.imgUrl = url
                //上传成功
                if (method.indexOf('get_idcard_image_side_front') > -1) {
                    uploadId('cnID', '上传身份证', true)
                }
                if (method.indexOf('get_idcard_image_side_back') > -1) {
                    uploadId('backcnID', '上传身份证反面', true)
                }
                this.$close()
            } catch (e) {
                if (method.indexOf('get_idcard_image_side_front') > -1) {
                    uploadId('cnID', '上传身份证', false)
                }
                if (method.indexOf('get_idcard_image_side_back') > -1) {
                    uploadId('backcnID', '上传身份证反面', false)
                }
                e && e.msg && this.$toast(e.msg)
                e && e.desc && this.$toast(e.desc)
            }
        }
    }
}
