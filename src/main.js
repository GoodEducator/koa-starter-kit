/**
 * Created by DengYun on 2017/7/21.
 */

const port = process.env['PORT'] || 8080;
const host = process.env['HOST'] || '';

require('./app').listen(port, host, () => {
  console.log('Ready');
});
