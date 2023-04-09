export function forEachValue(obj, fn) {
  // 执行回调函数fn时 第一个参数是value 第二个是 key 
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

// 判断一个值是不是Promise
export function isPromise(val) {
  return val && typeof val.then === 'function'
}