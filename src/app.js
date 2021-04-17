/**
 * Created by DengYun on 2017/7/21.
 */
const Koa = require('koa');
const router = require('./routers');


const app = new Koa();
app.proxy = true;
app.use(router.routes());

module.exports = app;
