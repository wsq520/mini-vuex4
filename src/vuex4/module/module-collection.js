import { forEachValue } from '../utils'
import Module from './module'

export class ModuleCollection {
  constructor(rootModule) {
    this.root = null
    this.register(rootModule, [])
  }

  register(rawModule, path) {
    // console.log(rawModule)
    // console.log(path)
    const newModule = new Module(rawModule)
    if (path.length === 0) { // 是一个根模块
      this.root = newModule
    } else {
      // path.slice(0, -1) 移除最后一个元素
      // 获取当前子模块的父模块
      const parent = path.slice(0, -1).reduce((module, current) => {
        // module是一个模块 而current就是该模块的名字
        return module.getChild(current)
      }, this.root)
      // 将当前模块添加到它父模块中
      parent.addChild(path[path.length - 1], newModule)
    }

    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(rawChildModule, path.concat(key))
      })
    }
  }

  getNamespaced(path) {
    let module = this.root
    return path.reduce((namespaceStr, key) => {
      module = module.getChild(key)
      return namespaceStr + (module.namespaced ? key + '/' : '')
    }, '')
  }
}