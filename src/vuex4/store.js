import { reactive, computed } from 'vue'
import { forEachValue } from "./utils"
import { storeKey } from './injectKey'

class Module {
  constructor(rawModule) {
    this._raw = rawModule
    this._children = {}
    this.state = rawModule.state
  }

  addChild(key, module) {
    this._children[key] = module
  }

  getChild(key) {
    return this._children[key]
  }
}

class ModuleCollection {
  constructor(rootModule) {
    this.root = null
    this.register(rootModule, [])
  }

  register(rawModule, path) {
    const newModule = new Module(rawModule)
    if (path.length === 0) { // 是一个根模块
      this.root = new Module(rawModule)
    } else {
      const parent = path.slice(0, -1).reduce((module, current) => {
        return module.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }

    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(rawChildModule, path.concat(key))
      })
    }
  }
}

export default class Store {
  constructor(options) {
    const store = this
    // 为什么要用{}再包裹一层？更好地实现修改state 更新视图
    store._state = reactive({ data: options.state })

  }

  commit = (type, payload) => {
    this._mutations[type](payload)
  }

  dispatch = (type, payload) => {
    this._action[type](payload)
  }

  get state() {
    return this._state.data
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this)
    // 将当前的store实例添加到全局属性中 那么所有的组件都可以使用它
    app.config.globalProperties.$store = this
  }
}
