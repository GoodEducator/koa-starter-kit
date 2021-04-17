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
        method: method.toUpperCase(),
        path: opts,
        handlers: extra,
      });
      return origin.call(this, opts, ...extra);
    }
    const { path, handlers } = opts;
    this._recordSubroute(opts);
    return origin.call(this, path, ...handlers);
  };
  override.origin = origin;

  Router.prototype[method] = override;
});

Router.prototype.request = function(opts) {
  if (Array.isArray(opts)) {
    for (const opt of opts) {
      this.request(opt);
    }
    return;
  }
  const { method } = opts;
  const lowerMethod = method.toLowerCase();
  if (methods.indexOf(lowerMethod) < 0) {
    throw new Error(`Invalid http method ${opts.method}`);
  }
  return this[lowerMethod](opts);
};

function optToJson({ method, path, handlers, validates, }){
  const subrouter = handlers.map(v => v.router).find(v=>v) || null;
  return {
    method,
    path,
    isSubRouter: !!subrouter,
  };
}

Router.prototype.metaRoute = function() {
  return async ctx => {
    if (!this._routes) {
      ctx.body = {
        childRoutes: [],
      };
      return;
    }
    const jsons = this._routes.map(optToJson)
    ctx.body = {
      childRoutes: jsons.filter(v => v.isSubRouter),
      requests: jsons.filter(v => !v.isSubRouter),
    };
  };
};

Router.prototype.registerMetaRoute = function() {
  this.get.origin.call(this, '/_meta', this.metaRoute());
};
