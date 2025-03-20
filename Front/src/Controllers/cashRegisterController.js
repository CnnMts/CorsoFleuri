import MenuModel from '../Models/menuModel.js';
import cashRegisterView from '../Views/cashRegisterView.js';

import '../Styles/cashRegister.css';

const CashRegisterController = class CashRegisterController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app'); // Conteneur principal pour le rendu
    console.log('this.el:', this.el);
    this.req = req;
    this.res = res;
    this.menus = [];

    this.run();
  }

  async run() {
    try {
      const allMenus = await MenuModel.getAllMenus();
      console.log('Menus récupérés :', allMenus); // Log pour vérifier les données

      this.menus = this.formatMenus(allMenus);
      this.render();
      console.log('HTML généré :', this.render()); // Log pour vérifier le rendu HTML

      this.initEventListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  formatMenus(menus) {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price
    }));
  }

  render() {
    // Injection de la vue principale
    this.el.innerHTML = `
          ${cashRegisterView(this.menus)}
    `;
  }

  initEventListeners() {
    this.onClickAddButton();
  }

  onClickAddButton() {
    // Gérer les clics sur les boutons d'ajout
    const buttons = document.querySelectorAll('.addMenuButton');
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        const menuName = button.getAttribute('data-name');
        if (!menuName) {
          console.error('Nom du menu manquant ou invalide !');
          return;
        }

        console.log(`Menu ajouté : ${menuName}`);
        this.showModal(menuName);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  showModal(name) {
    // Afficher une modal avec les détails du menu
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    modalContainer.innerHTML = `
      <div class="modal">
        <h2>Menu ajouté : ${name}</h2>
        <button class="close-modal">Fermer</button>
      </div>
    `;

    document.body.appendChild(modalContainer);

    modalContainer.querySelector('.close-modal').addEventListener('click', () => {
      modalContainer.remove();
    });
  }

  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
    if (this.res) {
      this.res.writeHead(500, { 'Content-Type': 'text/plain' });
      this.res.end('Erreur serveur : Impossible de récupérer les données.');
    }
  }
};

export default CashRegisterController;
