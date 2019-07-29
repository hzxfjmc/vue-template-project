// 错误上报
// import '@/utils/common/badjs-report'
// 神策埋点
import '../0-third/sensors'
// 工程重置样式
import '@/assets/styles/global.scss'
import '@/assets/styles/common.scss'
// 项目重置样式
import '../0-style/common.scss'
import config from '../0-config'

// @babel/preset-env会根据源代码中出现的语言特性自动检测需要的 polyfill
// 但不会检测vue模板中的polyfill，防止仅在模板中使用了includes而报错，故需要引用
console.log([].includes)

if (config.env !== 'production' && config.env !== 'hk') {
    import('vconsole').then(({ default: VConsole }) => new VConsole())
}
