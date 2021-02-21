const fs = require('fs')
const path = require('path')

/**
 * 判断文件夹是否存在，不存在可以直接创建
 * @param dirName String 文件路径
 * @return Promise<boolean>
 */
module.exports = async function isExitDir(dirName) {
  if (!dirName) throw Error('未传入参数')
  const absPath = path.resolve(__dirname, dirName)
  try {
    await fs.promises.stat(absPath)
  } catch (e) {
    await fs.promises.mkdir(absPath)
  }
}