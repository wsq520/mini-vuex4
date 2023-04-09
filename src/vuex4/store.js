import { reactive } from 'vue'
import { storeKey } from './injectKey'
import { ModuleCollection } from './module/module-collection'

function installModule(store, rootState, path, module) {
  let isRoot = !path.length

  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key]
    }, rootState)
    parentState[path[path.length - 1]] = module.state
  }

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })
}

export default class Store {
  constructor(options) {
    const store = this
    store._modules = new ModuleCollection(options)
    // console.log(this._modules)

    // 定义状态
    const state = store._modules.root.state
    installModule(store, state, [], store._modules.root)
    console.log(state)
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this)
    // 将当前的store实例添加到全局属性中 那么所有的组件都可以使用它
    app.config.globalProperties.$store = this
  }
}
