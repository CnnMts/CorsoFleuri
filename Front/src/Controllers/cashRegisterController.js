import MenuModel from '../Models/menuModel.js';
import LogoutModel from '../Models/logoutModel.js';
import { getAppState, loadState } from '../Models/appStateModel.js';
import cashRegisterView from '../Views/cashRegisterView.js';
import ticketView from '../Views/ticketView.js';
import testMenu1 from '../Assets/testMenu1.png';
import '../Styles/cashRegister.css';

class CashRegisterController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.testMenu1 = testMenu1;
    this.menus = [];
    this.ticket = [];
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
      const allMenus = await MenuModel.getAllMenus();
      console.log('Réponse API :', allMenus);
      this.menus = this.formatMenus(allMenus.filter((menu) => menu.display === 1));
      this.render();
      this.initEventListeners();
      this.logout();
      this.initcashOrderButtonListener();
    } catch (error) {
      this.handleError(error);
    }
  }

  logout() {
    document.querySelector('#logout-button').addEventListener("click", async (event) => {
      event.preventDefault();
      LogoutModel.deconnexion();
    });
  }

  formatMenus(menus) {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: parseFloat(menu.price) || 0,
      products: this.sortProductsByCategory(
        menu.products.map((product) => ({
          ...product,
          quantity: product.quantity ?? 1
        }))
      )
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

  render() {
    this.el.innerHTML = cashRegisterView({
      menus: this.menus,
      ticket: this.ticket,
      photo: this.testMenu1
    });
  }

  initEventListeners() {
    this.initAddMenuButtonListener();
    this.initPrintButtonListener();
  }

  initPrintButtonListener() {
    const printButton = document.querySelector('#printAllButton');
    if (printButton) {
      printButton.addEventListener('click', () => {
        this.printAllTickets(this.ticket);
      });
    }
  }

  initAddMenuButtonListener() {
    const buttons = document.querySelectorAll('.addMenuButton');
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const menuName = button.getAttribute('data-name');
        if (!menuName) return;
        this.showModal(menuName);
      });
    });
  }

  showModal(menuName) {
    const selectedMenu = this.menus.find((menu) => menu.name === menuName);
    if (!selectedMenu) return;

    console.log('Produits avec quantité :', selectedMenu.products);

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    modalContainer.innerHTML = `
      <div class="modal">
        <h2>${selectedMenu.name}</h2>
        ${this.renderProductSelection(selectedMenu.products)}
        <button id="confirmTicket" class="confirm-ticket">Confirmer le Ticket</button>
        <button class="close-modal">Fermer</button>
      </div>
    `;
    document.body.appendChild(modalContainer);

    modalContainer.querySelector('.close-modal').addEventListener('click', () => {
      modalContainer.remove();
    });

    modalContainer.querySelector('#confirmTicket').addEventListener('click', () => {
      this.sendTicketToView(selectedMenu, modalContainer);
    });
  }

  renderProductSelection(products) {
    return Object.keys(products)
      .map((category) => `
        <div class="category">
          <h3>${category}</h3>
          <ul>
            ${products[category]
    .map((product) => `
                <li>
                  <label>
                    <input type="radio" name="${category}" value="${product.id}">
                    ${product.name}
                    ${product.quantity && product.quantity !== 1 ? `<span>Quantité : ${product.quantity}</span>` : ''}
                  </label>
                </li>
              `).join('')}
          </ul>
        </div>
      `).join('');
  }

  sendTicketToView(selectedMenu, modalContainer) {
    const selectedProducts = this.getSelectedProducts(modalContainer);
    if (selectedProducts.length === 0) {
      alert('Veuillez sélectionner au moins un élément pour le ticket.');
      return;
    }

    const productNames = this.mapSelectedProductsToNames(selectedMenu, selectedProducts);
    const productDetails = this.mapSelectedProducts(selectedMenu, selectedProducts);

    const existingTicket = this.findExistingTicket(selectedMenu, productNames);

    if (existingTicket) {
      this.updateExistingTicket(existingTicket);
    } else {
      this.createNewTicket(selectedMenu, productNames, productDetails);
    }

    this.updateTotalPrice();
    modalContainer.remove();
  }

  getSelectedProducts(modalContainer) {
    const selectedItems = modalContainer.querySelectorAll('input[type="radio"]:checked');
    return Array.from(selectedItems).map((input) => input.value);
  }

  mapSelectedProducts(selectedMenu, selectedProducts) {
    return selectedProducts.map((id) => (
      Object.keys(selectedMenu.products).reduce((foundProduct, category) => {
        const product = selectedMenu.products[category].find((prod) => String(prod.id) === id);
        return product || foundProduct;
      }, null)
    )).filter((product) => product !== null);
  }

  mapSelectedProductsToNames(selectedMenu, selectedProducts) {
    return selectedProducts.map((id) => (
      Object.keys(selectedMenu.products).reduce((foundName, category) => {
        const product = selectedMenu.products[category].find((prod) => String(prod.id) === id);
        return product ? product.name : foundName;
      }, null)
    )).filter((name) => name !== null);
  }
  

  findExistingTicket(selectedMenu, productNames) {
    return this.ticket.find(
      (ticket) => ticket.name === selectedMenu.name
        && ticket.products.length === productNames.length
        && ticket.products.sort().toString() === productNames.sort().toString()
    );
  }

  updateExistingTicket(existingTicket) {
    existingTicket.quantity = (existingTicket.quantity || 1) + 1;

    console.log(`Quantité mise à jour pour le ticket '${existingTicket.name}': ${existingTicket.quantity}`);

    const ticketElement = document.querySelector(`.ticket[data-name="${existingTicket.name}"]`);
    if (ticketElement) {
      ticketElement.outerHTML = ticketView(existingTicket);
    } else {
      console.error("Impossible de trouver l'élément HTML correspondant au ticket pour mise à jour.");
    }
  }

  createNewTicket(selectedMenu, productNames, productDetails) {
    const state = loadState();
    console.log(state.user_id);

      const newTicket = {
        menu_id: selectedMenu.id,
        user_id: state.user_id,
        name: selectedMenu.name,
        price: selectedMenu.price,
        products: productNames,
        productsDetails: productDetails,
        quantity: 1
      };

    this.ticket.push(newTicket);

    console.log(`Nouveau ticket '${newTicket.name}' ajouté :`, newTicket.productQuantity);

    const ticketsContainer = document.getElementById('tickets-container');
    if (ticketsContainer) {
      ticketsContainer.insertAdjacentHTML('beforeend', ticketView(newTicket));
    } else {
      console.error('Conteneur des tickets non trouvé.');
    }
  }

  calculateTotalPrice() {
    return this.ticket.reduce((total, ticket) => total
    + (ticket.price * (ticket.quantity || 1)), 0);
  }

  updateTotalPrice() {
    const totalPrice = this.calculateTotalPrice();
    const totalPriceElement = document.getElementById('global-total');
    if (totalPriceElement) {
      totalPriceElement.textContent = totalPrice.toFixed(2);
    }
  }

  async cashOrder() {
    const payload = {
      orders: this.ticket  // ou une autre structure qui regroupe tous les éléments de la commande
      // Ajoutez éventuellement d'autres informations, par ex. total, date, mode de paiement, etc.
    };
    console.log("paylaod : ");
    console.log(payload);
    console.log("paylaod : ");

    try {
      const response = await fetch("http://localhost:8083/orders", { // Endpoint de création d'une commande
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        alert("Commande enregistrée avec succès");
        // Optionnel : réinitialisez le ticket ou redirigez l'utilisateur
        window.location.reload();
      } else {
        alert("Erreur lors de l'enregistrement : " + data.error);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la création de la commande :", error);
      alert("Erreur réseau lors de la création de la commande");
    }
  }

  // Vous devez aussi ajouter un écouteur d'événement sur le bouton "Encaisser" :
  initcashOrderButtonListener() {
    const encaisserBtn = document.querySelector('#cash-order-button');
    if (encaisserBtn) {
      encaisserBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.cashOrder();
      });
    }
  }


  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
  }
}

export default CashRegisterController;
