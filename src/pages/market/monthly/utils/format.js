import Vue from 'vue'
const $t = Vue.prototype.$t

// 按股票市場格式化單位
export const moneyTypeToText = type => {
    const map = new Map([
        [0, $t('other.yuan')],
        [1, $t('other.dollar')],
        [2, $t('common.hkDollar')]
    ])
    return map.get(type) || ''
}

// 轉義月供計劃status
export const planStatusToText = status => {
    const map = new Map([
        [0, $t('other.inForce')],
        [1, $t('common.stopped')],
        [2, $t('common.ended')],
        [3, $t('other.inForce')],
        [5, $t('other.inForce')]
    ])
    return map.get(status) || ''
}

// 格式化金額數字，添加逗号
export const formatMoneyNumberByComma = number => {
    if (number === null) {
        return ''
    }
    const arr = number.toString().split('.')
    const reverse = str =>
        str
            .split('')
            .reverse()
            .join('')
    arr[0] = reverse(arr[0])
    arr[0] = arr[0].replace(/\d{3}(?=[^$])/g, `$&,`)
    arr[0] = reverse(arr[0])
    return arr.length > 1 ? arr.join('.') : arr[0]
}
