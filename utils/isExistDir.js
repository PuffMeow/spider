const fs = require("fs");
const path = require("path");

/**
 * 同步
 * 判断文件夹是否存在，不存在直接创建
 * @param dirName String 文件路径
 */
module.exports = function isExitDir(dirName) {
  if (!dirName) throw Error("未传入参数");
  const absPath = path.resolve(__dirname, `../${dirName}`);
  const isExits = fs.existsSync(absPath);
  if (!isExits) {
    console.log("成功创建根目录", dirName);
    fs.mkdirSync(absPath);
  }
};
