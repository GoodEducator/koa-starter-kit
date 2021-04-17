/**
 * Created by tdzl2003 on 2017/7/21.
 */
const Router = require('koa-router');

function optToJson({ method, path, handlers, validates, }){
  return {
    method,
    path,
  };
}

function subrouteToJson({path, router}) {
  return {
    path,
  };
}

function _metaRoute() {
  return {
    childRoutes: this._childRoutes ? this._childRoutes.map(subrouteToJson) : [],
    requests: this._requests ? this._requests.map(optToJson) : [],
  };
}
Router.prototype.metaRoute = function() {
  return ctx => {
    ctx.body = _metaRoute.call(this);
  }
};

function renderBreadCrumb(path) {
  const curr = '';
  const piece = path.split('/');
  const last = piece.pop();
  return piece.map((v, i) => `<a href="${piece.slice(0, i).join('/')}/_doc.html">${v}/</a>
`).join('') + last + '/';
}

function renderSubRoute(currPath, {path}) {
  return `<p><a href="${currPath}${path}/_doc.html">${currPath}${path}</a></p>`;
}

function renderRequest(currPath, {method, path}) {
  return `<h3>${method} ${currPath}${path}</h3>`;
}

function _docHtmlRoute(ctx) {
  const metaInfo = _metaRoute.call(this);
  const currPath = ctx.request.url.replace(/\/[^\/]+$/, '');
  ctx.body =  `<html>
<head>
<title>${this.opts.title || ctx.app.title || 'Koa-Router-Meta'}</title>
</head>
<body>
  <h1>${renderBreadCrumb(currPath)}</h1>
  <h2>Sub Routes:</h2>
${metaInfo.childRoutes.map(v => renderSubRoute(currPath, v))}
  <h2>Requests:</h2>
${metaInfo.requests.map(v => renderRequest(currPath, v))}
</body>
</html>
`;
}

Router.prototype.metaDocRoute = function() {
  return _docHtmlRoute.bind(this);
}
