// 使用 Mock
import Mock from 'mockjs'
import modules from './modules'
console.log('modules', modules)
// const Random = Mock.Random

// 注册每个 mock api
for (let key in modules) {
    let module = modules[key]
    console.log('module:>>>', module)
    Mock.mock(...module)
}
