const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const isExitDir = require('./utils/isExistDir')
const sleep = require('./utils/sleep')

/************
 * 爬情侣头像用的脚本
 ************/


//执行入口，传入一个时间(单位:ms)控制爬取速度，建议不要太快
getList();


/**
 * 获取不同的页面数据
 * @param waitTime 爬取一个页面的间隔时间
 */
async function getList(waitTime = 1000) {
  for (let i = 2; i < 50; i++) {
    //爬慢点
    await sleep(waitTime * i)
    getPage(i);
  }
}

function excludeSpecial(s) {
  // 去掉文件名的特殊字符（文件名不允许包含特殊字符）
  s = s.replace(/[\||\“,，\'\"\\\/\b\f\n\r\t]/g, '');
  s = s.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, '');
  return s;
};

//获取页面内容
async function getPage(num, waitTime) {
  let httpUrl = `https://www.woyaogexing.com/touxiang/qinglv/index_${num}.html`;
  let res = await axios.get(httpUrl);
  let $ = cheerio.load(res.data);
  //首页不需要传入num
  httpUrl = httpUrl.replace(`/index_${num}.html`, '');
  $('.pMain .txList').each(async (i, element) => {
    await sleep(waitTime * i);
    let mainTitle = await excludeSpecial($(element).find('.imgTitle').text());
    let imgUrl = $(element).find('.img').attr('href');
    let start = imgUrl.indexOf('/2021');
    let end = imgUrl.length;
    imgUrl = imgUrl.substring(start, end);
    imgUrl = httpUrl + imgUrl;
    // console.log(mainTitle);
    isExitDir('../coupleImg')
    fs.mkdir('./coupleImg/' + mainTitle, () => {
      console.log("成功创建目录：" + './coupleImg/' + mainTitle);
    });
    getImg(imgUrl, mainTitle,);
  });
};

//用来获取图片的链接
async function getImg(imgUrl, mainTitle) {
  let res = await axios.get(imgUrl);
  let $ = cheerio.load(res.data);
  $('.contMain .tx-img').each(async (i, element) => {
    await sleep(100 * i);
    let pageImgUrl = $(element).find('a').attr('href');
    pageImgUrl = 'http:' + pageImgUrl;
    let title = pageImgUrl.substring(39, 71);
    download(pageImgUrl, mainTitle, title);
  })
}

//拿到链接之后通过文件流下载
async function download(pageImgUrl, mainTitle, title) {
  let res = await axios.get(pageImgUrl, { responseType: 'stream' })
  let ws = fs.createWriteStream(`./coupleImg/${mainTitle}/${title}.jpg`)
  res.data.pipe(ws);
  console.log('正在下载' + title);
  res.data.on('close', async () => {
    console.log('下载完成' + title);
    ws.close();
  })
}

