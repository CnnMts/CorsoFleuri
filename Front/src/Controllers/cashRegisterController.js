import MenuModel from '../Models/menuModel.js';
import cashRegisterView from '../Views/cashRegisterView.js';
import ticketView from '../Views/ticketView.js';
import '../Styles/cashRegister.css';

class CashRegisterController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.menus = [];
    this.ticket = []; // Liste des commandes (tickets)
    this.run();
  }

  async run() {
    try {
      const allMenus = await MenuModel.getAllMenus();
      this.menus = this.formatMenus(allMenus);
      this.render();
      this.initEventListeners(); // Initier les écouteurs d'événements
    } catch (error) {
      this.handleError(error);
    }
  }

  formatMenus(menus) {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: parseFloat(menu.price) || 0,
      products: this.sortProductsByCategory(menu.products)
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
    this.el.innerHTML = cashRegisterView({ menus: this.menus, ticket: this.ticket });
  }

  initEventListeners() {
    this.initAddMenuButtonListener();
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
    .map(
      (product) => `
                <li>
                  <label>
                    <input type="radio" name="${category}" value="${product.id}">
                    ${product.name}
                  </label>
                </li>
              `
    )
    .join('')}
          </ul>
        </div>
      `)
      .join('');
  }

  sendTicketToView(selectedMenu, modalContainer) {
    const selectedItems = modalContainer.querySelectorAll('input[type="radio"]:checked');
    const selectedProducts = Array.from(selectedItems).map((input) => input.value);

    if (selectedProducts.length === 0) {
      alert('Veuillez sélectionner au moins un élément pour le ticket.');
      return;
    }

    const productNames = selectedProducts.map((id) => Object.keys(selectedMenu.products)
      .reduce((foundName, category) => {
        const product = selectedMenu.products[category].find((prod) => String(prod.id) === id);
        return product ? product.name : foundName;
      }, null)).filter((name) => name !== null);

    const newTicket = {
      name: selectedMenu.name,
      price: selectedMenu.price,
      products: productNames
    };

    const ticketsContainer = document.getElementById('tickets-container');
    if (ticketsContainer) {
      ticketsContainer.insertAdjacentHTML('beforeend', ticketView(newTicket));
    } else {
      console.error('Conteneur tickets non trouvé');
    }

    this.ticket.push(newTicket);
    this.updateTotalPrice();
    modalContainer.remove();
  }

  calculateTotalPrice() {
    return this.ticket.reduce((total, ticket) => total + (ticket.price || 0), 0);
  }

  updateTotalPrice() {
    const totalPrice = this.calculateTotalPrice();
    const totalPriceElement = document.getElementById('global-total');
    if (totalPriceElement) {
      totalPriceElement.textContent = totalPrice.toFixed(2);
    }
  }

  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
  }
}

export default CashRegisterController;
