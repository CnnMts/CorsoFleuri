import Router from './router.js';
import CashRegisterContoller from './Controllers/cashRegisterController.js';

// import './index.scss';

const routes = [
  {
    url: '/test',
    controller: CashRegisterContoller
  }];

new Router(routes);
