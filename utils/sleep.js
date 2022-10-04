// 用来做时间等待，防止爬得太快被发现
module.exports = function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
