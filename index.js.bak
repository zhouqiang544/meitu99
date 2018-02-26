let express = require("express");
let app = express();
let getImg = require("./app.js");
var async = require('async');



//获取首次列表
app.get("/list", function(req, res) {
    let url = "";
    getImg(req.query.pageNum, function(result) {
        res.send(result);
        return result;
    });
})

//点击某一张进入 抓取
app.get("/details", function(req, res) {
    let data = {
        pageNum: req.query.pageNum,
        url: req.query.url
    }

    getImg(data, function(result) {
        res.send(result);
        return result;
    });
})


app.listen(3000)