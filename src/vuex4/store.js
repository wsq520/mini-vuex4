import { reactive, watch, computed } from 'vue'
import { storeKey } from './injectKey'
import { ModuleCollection } from './module/module-collection'
import { isPromise, forEachValue } from './utils'

// 根据路径 获取store的最新状态
function getNestedState(state, path) {
  return path.reduce((state, key) => {
    // console.log(state, key)
    return state[key]
  }, state)
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length

  const namespaced = store._modules.getNamespaced(path)

  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key]
    }, rootState)
    parentState[path[path.length - 1]] = module.state
  }

  module.forEachGetter((getter, key) => {
    store._wrappedGetters[namespaced + key] = () => {
      return getter(getNestedState(store.state, path))
    }
  })

  module.forEachMutation((mutation, key) => {
    // entry 和 store._mutations[namespaced + key] 指向的是同一块空间
    const entry = store._mutations[namespaced + key] || (store._mutations[namespaced + key] = [])
    entry.push((payload) => {
      mutation.call(store, getNestedState(store.state, path), payload)
    })
  })

  // actions执行完返回是一个promise
  module.forEachAction((action, key) => {
    const entry = store._actions[namespaced + key] || (store._actions[namespaced + key] = [])
    entry.push((payload) => {
      let res = action.call(store, store, payload)
      if (!isPromise(res)) {
        return Promise.resolve(res)
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
      get: computed(() => getter()),
      enumerable: true
    })
  })

  if (store.strict) {
    enableStrictMode(store)
  }
}

function enableStrictMode(store) {
  // 监控store._state.data的变化 变化后回调后面的函数
  watch(() => store._state.data, () => {
    // store._commiting不为 true 时 则控制台输出后面的字符串
    console.assert(store._commiting, 'do not mutate vuex store state outside mutation handlers')
  }, {
    // 深度监听且同步监听
    deep: true,
    flush: 'sync'
  })
}

export default class Store {
  _withCommit(fn) {
    const commiting = this._commiting
    this._commiting = true
    fn()
    this._commiting = commiting
  }

  constructor(options) {
    const store = this
    store._modules = new ModuleCollection(options)
    // console.log("_modules", this._modules)

    store._wrappedGetters = Object.create(null)
    store._mutations = Object.create(null)
    store._actions = Object.create(null)

    this.strict = options.strict || false
    // 同步修改时 _commiting 是true 异步则为 false
    this._commiting = false

    // 定义状态
    const state = store._modules.root.state
    installModule(store, state, [], store._modules.root)
    // console.log(store)
    // console.log(state)

    // 将格式化后的state添加到store.state上
    resetStoreState(store, state)

    // 插件
    store._subscribes = []
    options.plugins.forEach(plugin => plugin(store))
  }

  subscribe(fn) {
    this._subscribes.push(fn)
  }

  get state() {
    return this._state.data
  }

  replaceState(newState) {
    this._withCommit(() => {
      this._state.data = newState
    })
  }

  commit = (type, payload) => {
    const entry = this._mutations[type] || []
    this._withCommit(() => {
      entry.forEach(handler => handler(payload))
    })
    this._subscribes.forEach(sub => sub({ type, payload }, this.state))
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
