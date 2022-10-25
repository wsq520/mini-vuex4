export function forEachValueKey(obj, cb) {
  Object.keys(obj).forEach(key => cb(obj[key], key))
}