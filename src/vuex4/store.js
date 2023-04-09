import { storeKey } from './injectKey'
import { ModuleCollection } from './module/module-collection'
import { isPromise } from './utils'

// 根据路径 获取store的最新状态
function getNestedState(state, path) {
  return path.reduce((state, key) => state[key], state)
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length

  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key]
    }, rootState)
    parentState[path[path.length - 1]] = module.state
  }

  module.forEachGetter((getter, key) => {
    store._wrappedGetters[key] = () => {
      return getter(getNestedState(store.state, path))
    }
  })

  module.forEachMutation((mutation, key) => {
    const entry = store._mutations[key] || (store._mutations[key] = [])
    entry.push((payload) => {
      mutation.call(store, getNestedState(store.state, path), payload)
    })
  })

  // actions执行完返回是一个promise
  module.forEachAction((action, key) => {
    const entry = store._actions[key] || (store._actions[key] = [])
    entry.push((payload) => {
      let res = action.call(store, store, payload)
      if (!isPromise(res)) {
        return Promise.then(res)
      }
      return res
    })
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })
}

export default class Store {
  constructor(options) {
    const store = this
    store._modules = new ModuleCollection(options)
    // console.log(this._modules)

    store._wrappedGetters = Object.create(null)
    store._mutations = Object.create(null)
    store._actions = Object.create(null)

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
