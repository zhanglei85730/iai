// // 返回编译参数
module.exports = {
  getBuildParam: () => {
    let evnParam = ''
    if (process.argv.length >= 3) {
      const argv2String = process.argv[2];
      const argv2Array = argv2String.indexOf('=') > 0 ? argv2String.split('=') : [];
      if (argv2Array.length > 1) {
        evnParam = argv2Array[1]
      }
    }
    return evnParam
  }
}