import Vue from 'vue'
const PROCESS_STATUS = {
    1: { precent: '10', time: '只需要5分钟 即可完成开户' },
    2: { precent: '25', time: '只需要4分钟 即可完成开户' },
    3: { precent: '40', time: '只需要3分钟 即可完成开户' },
    4: { precent: '50', time: '只需要2分钟 即可完成开户' },
    5: { precent: '60', time: '只需要2分钟 即可完成开户' },
    6: { precent: '70', time: '只需要1分钟 即可完成开户' },
    7: { precent: '85', time: '即将开户完成' },
    8: { precent: '95', time: '即将开户完成' }
}
const mapReverse = mapData => {
    let mapReverse = {}
    let keys = Object.keys(mapData)
    keys.forEach(key => {
        mapReverse[mapData[key]] = key
    })
    return mapReverse
}

Vue.prototype.$PROCESS_STATUS = PROCESS_STATUS
Vue.prototype.$mapReverse = mapReverse
