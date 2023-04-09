import { inject } from 'vue'

export const storeKey = 'store'
// 获取 store 实例
// 参数 injectKey 是一个store的命名 因为支持创建多个store
export function useStore(injectKey = null) {
  return inject(injectKey !== null ? injectKey : storeKey)
}