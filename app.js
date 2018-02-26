//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');

//外传数据
var _data = {
    "status": "", //接口是否成功
    "data": {
        list: new Array(),
        total: Number()
    },
    "desc": ""
}


// 目标网址
var useUrl = 'http://www.lesmao.cc/';

// 发送请求
function getImg(req, cb) {
    var req = req;
    async.waterfall([
        function(cb) {
            request(useUrl, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var url = "http://" + response.request.originalHost;
                    cb(null, url);
                }
            })

        },
        function(url, cb) {
            var useUrl = ""; //爬取网址
            if (req.url) {
                if (parseInt(req.pageNum) == 1) {
                    useUrl = req.url;
                } else {
                    useUrl = req.url.substring(0, 34) + req.pageNum + "-1.html";
                }
            } else {
                useUrl = req ? url + "/plugin.php?id=group&page=" + req : url;
            }

            cb(null, useUrl)
        },
        function(url, cb) {
            var linksArr = new Array();
            request(url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    if (req.url) {
                        _data.data.total = $(".pg a").length;
                        $('.adw img').each(function() {
                            var src = $(this).attr("src");
                            var item = {
                                img: src,
                            }
                            if (item.img) {
                                linksArr.push(item);
                            }
                        });
                    } else {
                        $('.group a').each(function() {
                            var link = $(this).attr("href");
                            var src = $(this).find("img").attr("src");
                            var item = {
                                img: src,
                                link: link
                            }
                            if (item.img) {
                                linksArr.push(item);
                            }
                        });
                        delete _data.data.total;
                    }

                    cb(null, linksArr);
                }
            })
        }

    ], function(err, result) {
        if (err) {
            _data.status = "Error";
            _data.desc = "网络不好";
            cb(_data);
            return;
        }
        _data.status = "OK";
        _data.desc = "OK";
        _data.data.list = result;
        cb(_data);
    })

};


module.exports = getImg;