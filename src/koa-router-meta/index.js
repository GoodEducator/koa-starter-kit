/**
 * Created by DengYun on 2017/7/21.
 */

const Router = require('koa-router');
const methods = require('methods');

Router.prototype._recordSubroute = function (opts) {
  this._routes = this._routes || [];
  this._routes.push(opts);
};

methods.forEach(method => {
  const origin = Router.prototype[method];

  const override = function (opts, ...extra) {
    if (typeof(opts) === 'string') {
      this._recordSubroute({
        path: opts,
        handlers: extra,
      });
      return origin.call(this, opts, ...extra);
    }
    const { path, handlers } = opts;
    this._recordSubroute(opts);
    return origin.call(this, path, ...handlers);
  };

  Router.prototype[method] = override;
});
