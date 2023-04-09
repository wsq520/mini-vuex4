import { forEachValue } from "../utils"

export default class Module {
  constructor(rawModule) {
    this._raw = rawModule
    this._children = {}
    this.state = rawModule.state
  }

  // key 是一个子模块的名字 module就是子模块本身
  addChild(key, module) {
    this._children[key] = module
  }

  getChild(key) {
    return this._children[key]
  }

  forEachChild(fn) {
    forEachValue(this._children, fn)
  }
}