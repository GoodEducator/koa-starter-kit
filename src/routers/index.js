/**
 * Created by DengYun on 2017/7/21.
 */

const router =  require('koa-router')();

if (__DEV__) {
  router.registerMetaRoute();
}

router.use('/user', require('./user').routes());

router.get('/hello', async ctx => {
  ctx.body = "world.";
});


module.exports = router;

