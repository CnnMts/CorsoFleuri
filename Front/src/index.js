import Router from './router.js';
import CashRegisterController from './Controllers/cashRegisterController.js';
// import './index.scss';


const routes = [
  {
    url: '/test',
    controller: CashRegisterController
  }];

new Router(routes);
