/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id: 12345, a: b}
 */
export function urlParse() {
  const url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  const arr = url.match(reg)
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substr(1).split('=')
      const key = decodeURIComponent(tempArr[0])
      const val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
