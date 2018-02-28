/**
 * Created by: Luojinghui/luojinghui424@gmail.com
 * Date: 2017/2/7
 * Time: 上午10:53
 */

//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');

//目标网址
//在此处替换你的user_id，和token
var baseUrl = 'https://api.instagram.com/v1/users/30600104/media/recent/?access_token=30600104.4bcb2e5.fe07da5a90894e6f9848ac4aaf30dec3';

//本地存储目录
//注意，我的最终目录是在source目录底下
var dir = '../../source/img/photo';

//创建目录
mkdirp(dir, function (err) {
  if (err) {
    console.log(err);
  }
});

//发送请求
request({uri: baseUrl}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let resData = JSON.parse(body).data;

    resData.forEach(function (value, index) {
      let imgSrc = value.images.standard_resolution.url;

      console.log('正在下载原图' + imgSrc);
      download(imgSrc, dir, value.id);
      console.log('下载完成');
    });

    resData.forEach(function (value, index) {
      let thumbnailSrc = value.images.thumbnail.url;

      console.log('正在下载压缩图' + thumbnailSrc);
      download(thumbnailSrc, dir, value.id + '.min');
      console.log('下载完成');
    });

    //获取的json数据保存到本地备用
    fs.writeFile('../../source/instagram/ins.json',body,function(err){
      if(err) throw err;
      console.log('write JSON into TEXT');
    });
  }
});

//下载方法
var download = function (url, dir, filename) {
  request.head(url, function (err, res, body) {
    request(url).pipe(fs.createWriteStream(dir + "/" + filename + ".jpg"));
  });
};
