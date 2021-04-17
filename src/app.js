/**
 * Created by DengYun on 2017/7/21.
 */
const Koa = require('koa');
require('./koa-router-meta');
const router = require('./routers');


const app = new Koa();
app.title = "API文档 - 永夜2 - 非人类游戏制作组";
app.proxy = true;
app.use(router.routes());

module.exports = app;
