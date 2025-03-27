import OrderModel from '../Models/orderModel.js';
import LogoutModel from '../Models/logoutModel.js';
import { loadState } from '../Models/appStateModel.js';
import mainPaymentView from '../Views/payment/mainPaymentView.js';
import BluetoothPrinter from './BluetoothPrinter.js';
import '../Styles/payment.css';

class PaymentController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.orders = [];
    this.bluetoothPrinter = new BluetoothPrinter(); // Initialisation de l'imprimante Bluetooth
    this.run();
  }

  async run() {
    const state = loadState();
    if (!state.loggedIn) {
      alert('Not logged in');
      window.location.href = '/login';
      return;
    }
    try {
      const allOrders = await OrderModel.getAllOrders();
      this.orders = this.formatOrders(allOrders);
      this.render();
      this.initOrderActionEvents();
      this.logout();
    } catch (error) {
      this.handleError(error);
    }
  }

  formatOrders(orders) {
    return orders.map((order) => ({
      id: order.id,
      status_id: order.status_id,
      total_price: parseFloat(order.total_price) || 0,
      orderMenus: order.orderMenus,
      menus: this.getMenusFromOrderMenus(order.orderMenus),
      menusNames: this.getMenusNamesAndQuantity(this.getMenusFromOrderMenus(order.orderMenus)),
      menuChoices: this.getAllMenuChoices(this.getMenusFromOrderMenus(order.orderMenus)),
      products: this.getAllProductsFromMenuChoices(
        this.getAllMenuChoices(this.getMenusFromOrderMenus(order.orderMenus))
      )
    }));
  }

  getMenusFromOrderMenus(orderMenus) {
    return orderMenus.map((orderMenu) => orderMenu.menu[0]);
  }

  getMenusNamesAndQuantity(menus) {
    const grouped = menus.reduce((acc, menu) => {
      if (menu && menu.name) {
        acc[menu.name] = (acc[menu.name] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, quantity]) => ({ name, quantity }));
  }

  getMenuChoices(menu) {
    if (!menu.menuChoice || menu.menuChoice.length === 0) {
      return {};
    }
    const choicesObj = menu.menuChoice[0];
    const validChoices = {};
    for (const key in choicesObj) {
      if (Object.prototype.hasOwnProperty.call(choicesObj, key)
        && choicesObj[key] && Object.keys(choicesObj[key]).length > 0) {
        validChoices[key] = choicesObj[key];
      }
    }
    return validChoices;
  }

  getAllMenuChoices(menus) {
    const aggregated = {};
    menus.forEach((menu) => {
      const choices = this.getMenuChoices(menu);
      Object.entries(choices).forEach(([category, menuObj]) => {
        if (!aggregated[category]) {
          aggregated[category] = {};
        }
        const menuName = menuObj.name;
        aggregated[category][menuName] = (aggregated[category][menuName] || 0) + 1;
      });
    });

    const result = {};
    for (const category in aggregated) {
      if (Object.prototype.hasOwnProperty.call(aggregated, category)) {
        result[category] = Object.entries(aggregated[category])
          .map(([name, quantity]) => ({ name, quantity }));
      }
    }
    return result;
  }

  getAllProductsFromMenuChoices(menuChoices) {
    const categoryPriorities = {
      starter: 1, dessert: 2, drink: 3, mainCourse: 4
    };
    const aggregated = {};

    for (const category in menuChoices) {
      if (Object.prototype.hasOwnProperty.call(menuChoices, category)) {
        const products = menuChoices[category];
        if (Array.isArray(products)) {
          products.forEach((product) => {
            if (product && product.name) {
              const key = `${category}-${product.name}`;
              if (!aggregated[key]) {
                aggregated[key] = {
                  name: product.name,
                  category,
                  quantity: product.quantity,
                  priority: categoryPriorities[category] || 99
                };
              } else {
                aggregated[key].quantity++;
              }
            }
          });
        }
      }
    }

    const groupedArray = Object.values(aggregated);
    groupedArray.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.name.localeCompare(b.name);
    });

    return groupedArray;
  }

  initOrderActionEvents() {
    document.querySelectorAll('.toggle-status-btn').forEach((button) => {
      button.addEventListener('click', async () => {
        const orderId = button.getAttribute('data-order-id');
        console.log(`Toggle status button clicked for order ID: ${orderId}`);

        try {
          const response = await fetch(`http://localhost:8083/orders/${orderId}/toggle`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            window.location.reload();
          } else {
            alert(`Erreur : ${data.message}`);
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du statut :', error);
        }
      });
    });

    document.querySelectorAll('.print-order-btn').forEach((button) => {
      button.addEventListener('click', async () => {
        const orderId = button.getAttribute('data-order-id');
        console.log(`Print order button clicked for order ID: ${orderId}`);
        console.log('zfsffssf', this.orders);
        const selectedOrder = this.orders.find((o) => o.id === parseInt(orderId, 10));
        console.log('Selected order:', selectedOrder);

        if (!selectedOrder) {
          console.error(`Aucune commande trouvée avec l'ID: ${orderId}`);
          return;
        }

        try {
          await this.printOrderTicket(selectedOrder);
        } catch (error) {
          console.error('Erreur lors de l\'impression de la commande :', error);
        }
      });
    });

    document.querySelectorAll('.delete-order-btn').forEach((button) => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const orderId = button.getAttribute('data-order-id');
        console.log(`Delete order button clicked for order ID: ${orderId}`);

        if (window.confirm('Confirmez-vous la suppression de cette commande ?')) {
          try {
            const response = await fetch(`http://localhost:8083/orders/${orderId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            const data = await response.json();
            if (response.ok) {
              alert('Commande supprimée');
              window.location.reload();
            } else {
              alert(`Erreur : ${data.message}`);
            }
          } catch (error) {
            console.error('Erreur lors de la suppression :', error);
          }
        }
      });
    });
  }

  render() {
    this.el.innerHTML = mainPaymentView({
      orders: this.orders
    });
  }

  logout() {
    document.querySelector('#logout-button').addEventListener('click', async (event) => {
      event.preventDefault();
      LogoutModel.deconnexion();
    });
  }

  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
  }

  async printOrderTicket(order) {
    try {
      if (!order || !order.id) {
        order = {
          id: 1, menusNames: [], products: [], total_price: 0
        };
        console.error('Commande non valide, utilisation de l\'ID par défaut: 1');
      }

      await this.bluetoothPrinter.connect();
      console.log("Impression connectée à l'imprimante.");

      let orderText = `Commande Numero: ${order.id || 'Inconnu'}\n`;
      console.log('Commande générée : ', orderText);

      if (order.menusNames.length > 0) {
        orderText += 'Menus :\n';
        order.menusNames.forEach((menuObj) => {
          orderText += `${menuObj.name} x${menuObj.quantity}\n`;
        });
        console.log('Menus ajoutés : ', order.menusNames);
      } else {
        console.log('Aucun menu trouvé dans la commande.');
      }

      if (order.products.length > 0) {
        orderText += '\nProduits :\n';
        order.products.forEach((prod) => {
          orderText += `${prod.name} x${prod.quantity}\n`;
        });
        console.log('Produits ajoutés : ', order.products);
      } else {
        console.log('Aucun produit trouvé dans la commande.');
      }

      orderText += `\nTotal : ${order.total_price.toFixed(2)} EUR\n`;
      console.log('Total de la commande ajouté : ', order.total_price);
      console.log('Ticket à imprimer : \n', orderText);

      await this.bluetoothPrinter.printText(orderText);
      console.log(`Ticket pour la commande ${order.id} imprimé avec succès.`);
    } catch (error) {
      console.error('Erreur lors de l\'impression de la commande :', error);
    }
  }
}

export default PaymentController;
