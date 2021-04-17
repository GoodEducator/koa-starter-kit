/**
 * Created by DengYun on 2017/7/21.
 */


const router =  require('koa-router')();

router.get('/hello', async ctx => {
  ctx.body = "world.";
});

module.exports = router;

