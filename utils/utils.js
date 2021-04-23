// 去掉文件名的特殊字符（文件名不允许包含特殊字符）
function excludeSpecial(s) {
  s = s.replace(/[\||\“,，\'\"\\\/\b\f\n\r\t]/g, '');
  s = s.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, '');
  return s;
}

module.exports = {
  excludeSpecial
}