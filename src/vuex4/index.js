import { useStore } from './injectKey'

import Store from './store'
// 创建并且返回一个store
function createStore(options) {
  return new Store(options)
}

export {
  createStore,
  useStore
}