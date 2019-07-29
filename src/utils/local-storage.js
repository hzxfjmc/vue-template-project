/**
 * 使用 html5 提供的 localStorage来缓存数据
 **/
const SPLIT_STR = '@'
const localStorage = window.localStorage

const DATA_PROCESS_MAPPING = {
    number: {
        save: data => data,
        parse: data => Number.parseFloat(data)
    },
    boolean: {
        save: data => data,
        parse: data => JSON.parse(data)
    },
    object: {
        save: data => JSON.stringify(data),
        parse: data => JSON.parse(data)
    },
    default: {
        save: data => data,
        parse: data => data
    }
}

function getProcess(type) {
    return DATA_PROCESS_MAPPING[type] || DATA_PROCESS_MAPPING['default']
}

export default {
    get(key) {
        try {
            let stringData = localStorage.getItem(key)
            if (stringData) {
                let dataArray = stringData.split('@')
                let data
                let now = Date.now()
                if (dataArray.length > 2 && dataArray[2] < now) {
                    // 缓存过期
                    localStorage.removeItem(key)
                    return null
                } else {
                    let value = decodeURIComponent(dataArray[1])
                    data = getProcess(dataArray[0]).parse(value)
                    return data
                }
            }
        } catch (e) {
            console.log(e)
        }
        return null
    },
    put(key, value, expired) {
        // expired 过期时间 单位天 默认是100 上线测试没问题替换旧的设值
        const type = typeof value
        const process = getProcess(type)
        value = type + SPLIT_STR + encodeURIComponent(process.save(value))
        if (expired) {
            // 默认不传 不过期
            let time = expired * 24 * 60 * 60 * 1000 + new Date().getTime()
            value += SPLIT_STR + time
        }
        localStorage.setItem(key, value)
    },
    clear() {
        localStorage.clear()
    },
    remove(key) {
        localStorage.removeItem(key)
    }
}
