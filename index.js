const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const isExitDir = require("./utils/isExistDir");
const sleep = require("./utils/sleep");
const { excludeSpecial } = require("./utils/utils");

/************
 * 爬情侣头像用的脚本
 ************/

// 执行入口，传入一个时间(单位:ms)控制爬取速度，建议不要太快
getList();

/**
 * 获取不同页面的数据，默认获取30页
 * @param waitTime 爬取一个页面的间隔时间，默认 2s
 */
async function getList(waitTime = 2000) {
  for (let i = 2; i < 30; i++) {
    // 爬慢点
    await sleep(waitTime * i);
    getPage(i);
  }
}

// 获取页面内容
async function getPage(num, waitTime) {
  let httpUrl = `https://www.woyaogexing.com/touxiang/qinglv/index_${num}.html`;
  const res = await axios.get(httpUrl);
  const $ = cheerio.load(res.data);
  // 首页不需要传入num
  httpUrl = httpUrl.replace(`/index_${num}.html`, "");
  $(".pMain .txList").each(async (i, element) => {
    await sleep(waitTime * i);
    const mainTitle = await excludeSpecial($(element).find(".imgTitle").text());
    let imgUrl = $(element).find(".img").attr("href");
    const currentYear = new Date().getFullYear();
    const start = imgUrl.indexOf(`/${currentYear}`);
    imgUrl = imgUrl.substring(start, imgUrl.length);
    imgUrl = httpUrl + imgUrl;
    isExitDir("coupleImg");
    fs.mkdir("./coupleImg/" + mainTitle, () => {
      console.log("成功创建目录：" + "./coupleImg/" + mainTitle);
    });
    getImg(imgUrl, mainTitle);
  });
}

// 用来获取图片的链接
async function getImg(imgUrl, mainTitle) {
  const res = await axios.get(imgUrl);
  const $ = cheerio.load(res.data);
  $(".contMain .tx-img").each(async (i, element) => {
    await sleep(100 * i);
    let pageImgUrl = $(element).find("a").attr("href");
    pageImgUrl = "http:" + pageImgUrl;
    const title = pageImgUrl.substring(39, 71);
    download(pageImgUrl, mainTitle, title);
  });
}

// 拿到链接之后通过文件流下载
async function download(pageImgUrl, mainTitle, title) {
  const res = await axios.get(pageImgUrl, { responseType: "stream" });
  const ws = fs.createWriteStream(`./coupleImg/${mainTitle}/${title}.jpg`);
  res.data.pipe(ws);
  console.log("正在下载" + title);
  res.data.on("close", async () => {
    console.log("下载完成" + title);
    ws.close();
  });
}
