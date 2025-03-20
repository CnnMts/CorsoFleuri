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
    this.ticket = {};
    this.run();
  }

  async run() {
    try {
      const allMenus = await MenuModel.getAllMenus();
      this.menus = this.formatMenus(allMenus);
      this.render();
      this.initEventListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  formatMenus(menus) {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
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
    this.el.innerHTML = `
      ${cashRegisterView(this.menus)}
    `;
  }

  initEventListeners() {
    this.onClickAddButton();
  }

  onClickAddButton() {
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
      .map(
        (category) => `
      <div class="category">
        <h3>${category}</h3>
        <ul>
          ${products[category]
    .map(
      (product) => `
            <li>
              <label>
                <input type="radio" name="${category}" value="${product.name}"> ${product.name}
              </label>
            </li>
          `
    )
    .join('')}
        </ul>
      </div>
    `
      )
      .join('');
  }

  sendTicketToView(selectedMenu, modalContainer) {
    const selectedItems = document.querySelectorAll('input[type="radio"]:checked');

    this.ticket = {
      name: selectedMenu.name,
      price: selectedMenu.price,
      products: Array.from(selectedItems).map((input) => ({
        category: input.name,
        name: input.value
      }))
    };

    if (!this.ticket.products || this.ticket.products.length === 0) {
      console.error('Aucun élément sélectionné pour le ticket.');
      alert('Veuillez sélectionner au moins un élément pour le ticket.');
      return;
    }

    const ticketContainer = document.querySelector('.containerTicket');
    if (ticketContainer) {
      ticketContainer.innerHTML += ticketView(this.ticket); // Mise à jour de la vue ici
    }

    console.log('Ticket mis à jour :', this.ticket);
    modalContainer.remove();
  }

  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
    if (this.res) {
      this.res.writeHead(500, { 'Content-Type': 'text/plain' });
      this.res.end('Erreur serveur.');
    }
  }
}

export default CashRegisterController;
