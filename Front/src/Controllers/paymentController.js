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
      this.initOrderActionEvents();
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
      discount_id: order.discount_id,
      orderMenus: order.orderMenus,
      menus: this.getMenusFromOrderMenus(order.orderMenus),
      menusNames: this.getMenusNamesAndQuantity(this.getMenusFromOrderMenus(order.orderMenus)),
      menuChoices: this.getAllMenuChoices(this.getMenusFromOrderMenus(order.orderMenus)),
      products: this.getAllProductsFromMenuChoices(this.getAllMenuChoices(this.getMenusFromOrderMenus(order.orderMenus)))
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

  getMenuChoices(menu) {
    // Vérifier d'abord que la propriété "menuChoice" existe et n'est pas vide
    if (!menu.menuChoice || menu.menuChoice.length === 0) {
      return {};
    }
    // Supposons que le tableau "menu.menuChoice" contient un seul objet
    const choicesObj = menu.menuChoice[0];
    
    // Création d'un nouvel objet pour ne retenir que les clés dont la valeur n'est pas vide
    const validChoices = {};
    for (const key in choicesObj) {
      if (choicesObj.hasOwnProperty(key)) {
        // Vérifier que l'objet associé n'est pas vide (par exemple, a au moins une clé)
        if (choicesObj[key] && Object.keys(choicesObj[key]).length > 0) {
          validChoices[key] = choicesObj[key];
        }
      }
    }
    
    return validChoices;
  }

  getAllMenuChoices(menus) {
    // L'objet "aggregated" contiendra pour chaque catégorie un objet
    // avec en clé le nom du menu et en valeur la quantité.
    const aggregated = {};
  
      // Supposons que l'attribut "menus" de chaque commande est déjà un tableau d'objets menus,
      // obtenu via getMenusFromOrderMenus.
      menus.forEach((menu) => {
        // Récupère les choix du menu (un objet par catégorie)
        const choices = this.getMenuChoices(menu);  // Par exemple, { starter: {name: 'Carottes Râpées', ... }, mainCourse: { name: 'Kebab', ... }, dessert: { name: 'Flan', ... } }
        // Pour chaque catégorie dans cet objet, accumule les occurrences
        for (const [category, menuObj] of Object.entries(choices)) {
          // Si l'objet de regroupement n'a pas encore de clé pour cette catégorie, on l'initialise
          if (!aggregated[category]) {
            aggregated[category] = {};
          }
          // Utilisez le nom du menu comme identifiant
          const menuName = menuObj.name;
          // Incrémentez le compteur pour ce menu dans la catégorie
          aggregated[category][menuName] = (aggregated[category][menuName] || 0) + 1;
        }
      });
  
    // Convertissez ensuite ce résultat en un format plus facile à utiliser en vue,
    // par exemple un objet où chaque clé est une catégorie et la valeur un tableau d'objets { name, quantity }.
    const result = {};
    for (const category in aggregated) {
      if (aggregated.hasOwnProperty(category)) {
        // Transformer l'objet de comptage en tableau d'objets
        result[category] = Object.entries(aggregated[category]).map(([name, quantity]) => ({ name, quantity }));
      }
    }
    return result;
  }

  getAllProductsFromMenuChoices(menuChoices) {
    // Définir les priorités par catégorie.
    // Les produits froids ("starter", "dessert", "drink") ont priorité 1, ce qui les place en haut,
    // Alors que les "mainCourse" (plats) ont priorité 2, et les autres, une priorité par défaut élevée.
    const categoryPriorities = {
      starter: 1,
      dessert: 2,
      drink: 3,
      mainCourse: 4
    };

    // Agrégation des produits par une clé composite "category-name"
    const aggregated = {};

    // Parcourt chaque catégorie dans menuChoices
    for (const category in menuChoices) {
      if (Object.prototype.hasOwnProperty.call(menuChoices, category)) {
        const products = menuChoices[category];
        if (Array.isArray(products)) {
          products.forEach(product => {
            if (product && product.name) {
              const key = `${category}-${product.name}`; // clé composite pour identifier un produit unique dans une catégorie
              if (!aggregated[key]) {
                aggregated[key] = {
                  name: product.name,
                  category: category, // On conserve la catégorie telle quelle
                  quantity: product.quantity,
                  priority: categoryPriorities[category] || 99 // Priorité par défaut si non définie
                };
              } else {
                aggregated[key].quantity++;
              }
            }
          });
        }
      }
    }

    // Transformer l'objet agrégé en tableau
    const groupedArray = Object.values(aggregated);

    // Trier selon la priorité (les petites valeurs apparaissent en premier)
    // En cas d'égalité de priorité, trier par ordre alphabétique du nom
    groupedArray.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.name.localeCompare(b.name);
    });

    return groupedArray;
  }

  initOrderActionEvents() {
    // Pour le bouton de toggling du statut
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const orderId = button.getAttribute('data-order-id');
        try {
          const response = await fetch(`http://localhost:8083/orders/${orderId}/toggle`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          const data = await response.json();
          if (response.ok) {
            // alert(`Le statut de la commande a été mis à jour (nouveau statut: ${data.newStatus})`);
            window.location.reload();
          } else {
            alert(`Erreur : ${data.message}`);
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour du statut :", error);
        }
      });
    });

    // Pour le bouton de suppression
    document.querySelectorAll('.delete-order-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const orderId = button.getAttribute('data-order-id');
        if (confirm("Confirmez-vous la suppression de cette commande ?")) {
          try {
            const response = await fetch(`http://localhost:8083/orders/${orderId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            });
            const data = await response.json();
            if (response.ok) {
              alert("Commande supprimée");
              window.location.reload();
            } else {
              alert(`Erreur : ${data.message}`);
            }
          } catch (error) {
            console.error("Erreur lors de la suppression :", error);
          }
        }
      });
    });

      // Écouteur pour le select de discount
    document.querySelectorAll('.discount-select').forEach(select => {
      select.addEventListener('change', async (event) => {
        const orderId = event.currentTarget.getAttribute('data-discount-order-id');
        const discount_id = parseInt(event.currentTarget.value, 10);
        console.log(discount_id);
        try {
          const response = await fetch(`http://localhost:8083/orders/${orderId}/update-discount`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ discount_id })
          });
          const data = await response.json();
          console.log(data);
          if (response.ok) {
            alert(`Remise mise à jour avec succès`);
            window.location.reload();
          } else {
            alert(`Erreur: ${data.error}`);
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la remise :", error);
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