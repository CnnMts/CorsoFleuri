class Router {
  constructor(routes = [], req, res) {
    this.req = req;
    this.res = res;
    this.path = req.url;
    this.routes = routes;
    this.params = this.parseQueryParams(req.url);
  }

  parseQueryParams(url) {
    const queryString = url.split('?')[1];
    if (!queryString) return {};
    return Object.fromEntries(
      queryString.split('&').map((param) => param.split('='))
    );
  }

  startController() {
    for (let i = 0; i < this.routes.length; i += 1) {
      const route = this.routes[i];

      if (route.url === this.path) {
        const Controller = route.controller;
        new Controller(this.req, this.res, this.params);
        return;
      }
    }
    this.res.writeHead(404, { 'Content-Type': 'text/plain' });
    this.res.end('Page non trouvée');
  }

  run() {
    this.startController();
  }
}

export default Router;
