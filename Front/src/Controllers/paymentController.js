import OrderModel from '../Models/orderModel.js';
import LogoutModel from '../Models/logoutModel.js';
import { loadState } from '../Models/appStateModel.js';
import mainPaymentView from '../Views/payment/mainPaymentView.js';
import '../Styles/payment.css';

class PaymentController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.orders = [];
    this.run();
  }

  async run() {
    const state = loadState();
    console.log(state);
    if (!state.loggedIn) {
      alert('Not logged in');
      window.location.href = "/login";
      exit;
    }
    try {
      const allOrders = await OrderModel.getAllOrders();
      console.log('Réponse API :', allOrders);
      this.orders = this.formatOrders(allOrders);
      console.log('Orders après format : ', this.orders);
      this.render();
      // this.initEventListeners();
      this.logout();
    } catch (error) {
      this.handleError(error);
    }
  }

  formatOrders(orders) {
    console.log(orders[0].orderMenus[1].menu[0].name);
    return orders.map((order) => ({
      id: order.id,
      status_id: order.status_id,
      total_price: parseFloat(order.total_price) || 0,
      orderMenus: order.orderMenus,
      menus: this.getMenusFromOrderMenus(order.orderMenus),
      menusNames: this.getMenusNamesAndQuantity(this.getMenusFromOrderMenus(order.orderMenus))
      // products: this.sortProductsByCategory(
      //   order.products.map((product) => ({
      //     ...product,
      //     quantity: product.quantity ?? 1
      //   }))
      // )
    }));
  }

  sortProductsByCategory(products) {
    const categories = {
      1: 'Entrée',
      2: 'Plat',
      3: 'Dessert',
      4: 'Boisson'
    };
    const sortedProducts = {};

    products.forEach((product) => {
      const categoryName = categories[product.category_id] || 'Autre';
      if (!sortedProducts[categoryName]) {
        sortedProducts[categoryName] = [];
      }
      sortedProducts[categoryName].push(product);
    });

    return sortedProducts;
  }

  getMenusFromOrderMenus(orderMenus) {
    // Utilisez map pour transformer le tableau orderMenus en un tableau de menu
    return orderMenus.map(orderMenu => orderMenu.menu[0]);
  }  

  getMenusNamesAndQuantity(menus) {
    // 'menus' est supposé être un tableau d'objets, chacun avec une propriété 'name'
    const grouped = menus.reduce((acc, menu) => {
      if (menu && menu.name) {
        acc[menu.name] = (acc[menu.name] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Transformer l'objet groupé en un tableau d'objets {name, quantity}
    return Object.entries(grouped).map(([name, quantity]) => ({ name, quantity }));
  }
  

  render() {
    this.el.innerHTML = mainPaymentView({
      orders: this.orders
    });
  }

  logout() {
    document.querySelector('#logout-button').addEventListener("click", async (event) => {
      event.preventDefault();
      LogoutModel.deconnexion();
    });
  }

  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
  }
}

export default PaymentController;