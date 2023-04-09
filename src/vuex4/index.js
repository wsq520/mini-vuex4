import { reactive, computed } from 'vue'
import { storeKey, useStore } from './injectKey'
import { forEachValue } from './utils'

import Store from './store'
// 创建并且返回一个store
function createStore(options) {
  return new Store(options)
}

export {
  createStore,
  useStore
}