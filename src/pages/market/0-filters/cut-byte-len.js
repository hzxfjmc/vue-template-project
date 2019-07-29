// 截取字符长度，汉字算两个，末尾省略号
export default function cutByteLen(val, length, replace = '...') {
    let len = 0
    for (let i = 0; i < val.length; i++) {
        const charCode = val.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) {
            len += 1
        } else {
            len += 2
        }
        if (len > length) {
            val = val.substring(0, i) + replace
            break
        }
    }
    return val
}
