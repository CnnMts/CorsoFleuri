import Router from './router.js';
import CashRegisterContoller from './Controllers/cashRegisterController.js';
import CreateMenuController from './Controllers/creatMenuController.js';
import CreateProductController from './Controllers/createProductController.js';
import MenuController from './Controllers/menuController.js';
import ProductGestionController from './Controllers/productGestionController.js';
import LoginController from './Controllers/loginController.js';
import PaymentController from './Controllers/paymentController.js';
// import './index.scss';

const routes = [
  {
    url: '/test',
    controller: CashRegisterContoller
  },
  {
    url: '/creatMenu',
    controller: CreateMenuController
  },
  {
    url: '/creatProduct',
    controller: CreateProductController
  },
  {
    url: '/gestion',
    controller: MenuController
  },
  {
    url: '/gestionProduct',
    controller: ProductGestionController
  },
  {
    url: '/login',
    controller: LoginController
  },
  {
    url: '/payment',
    controller: PaymentController
  }
];

new Router(routes);
