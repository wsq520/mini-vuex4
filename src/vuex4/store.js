import { reactive } from 'vue'
import { storeKey } from './injectKey'
import { ModuleCollection } from './module/module-collection'
import { isPromise, forEachValue } from './utils'

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

function resetStoreState(store, state) {
  store._state = reactive({ data: state })
  const wrappedGetters = store._wrappedGetters
  store.getters = {}
  forEachValue(wrappedGetters, (getter, key) => {
    Object.defineProperty(store.getters, key, {
      get: getter,
      enumerable: true
    })
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

    // 给store添加state
    resetStoreState(store, state)
  }

  get state() {
    return this._state.data
  }

  commit = (type, payload) => {
    const entry = this._mutations[type] || []
    entry.forEach(handler => handler(payload))
  }

  dispatch = (type, payload) => {
    const entry = this._actions[type] || []
    return Promise.all(entry.map(handler => handler(payload)))
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this)
    // 将当前的store实例添加到全局属性中 那么所有的组件都可以使用它
    app.config.globalProperties.$store = this
  }
}
