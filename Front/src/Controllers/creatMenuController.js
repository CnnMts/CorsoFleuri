import createMenuView from '../Views/creatMenu/createMenuView.js';
import createAppetizerModalView from '../Views/creatMenu/createAppetizerModalView.js';
import createDessertModalView from '../Views/creatMenu/createDessertModalView.js';
import createDrinkModalView from '../Views/creatMenu/createDrinkModalView.js';
import createMainCourseModalView from '../Views/creatMenu/createMainCourseModalView.js';
import ProductModel from '../Models/productModel.js';
import '../Styles/createMenu.css';

class CreateMenuController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  async init() {
    this.products = await ProductModel.fetchProducts();
    console.log('Produits récupérés :', this.products);
    this.render();
    this.initEventListeners();
  }

  render() {
    const appetizers = this.products.filter((p) => p.category_id === 1);
    const mainCourses = this.products.filter((p) => p.category_id === 2);
    const desserts = this.products.filter((p) => p.category_id === 3);
    const drinks = this.products.filter((p) => p.category_id === 4);

    this.el.innerHTML = createMenuView({
      appetizers,
      mainCourses,
      desserts,
      drinks
    });

    this.renderModals({
      appetizers, mainCourses, desserts, drinks
    });
  }

  renderModals({
    appetizers, mainCourses, desserts, drinks
  }) {
    // Render modals for each category
    document.body.insertAdjacentHTML(
      'beforeend',
      createAppetizerModalView({ appetizers })
    );
    document.body.insertAdjacentHTML(
      'beforeend',
      createDessertModalView({ desserts })
    );
    document.body.insertAdjacentHTML(
      'beforeend',
      createDrinkModalView({ drinks })
    );
    document.body.insertAdjacentHTML(
      'beforeend',
      createMainCourseModalView({ mainCourses })
    );
  }

  initEventListeners() {
    // Form submission
    const form = document.getElementById('create-menu-form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    } else {
      console.error("Le formulaire de création de menu n'a pas été trouvé.");
    }

    // Appetizer modal
    const addAppetizerButton = document.getElementById('add-appetizer');
    if (addAppetizerButton) {
      addAppetizerButton.addEventListener('click', () => this.openModal('appetizer-modal'));
    }
    document
      .getElementById('validate-appetizers')
      ?.addEventListener('click', () => this.validateSelection('appetizer-group', 'appetizer-modal', 'appetizers'));

    // Dessert modal
    const addDessertButton = document.getElementById('add-dessert');
    if (addDessertButton) {
      addDessertButton.addEventListener('click', () => this.openModal('dessert-modal'));
    }
    document
      .getElementById('validate-desserts')
      ?.addEventListener('click', () => this.validateSelection('dessert-group', 'dessert-modal', 'desserts'));

    // Drink modal
    const addDrinkButton = document.getElementById('add-drink');
    if (addDrinkButton) {
      addDrinkButton.addEventListener('click', () => this.openModal('drink-modal'));
    }
    document
      .getElementById('validate-drinks')
      ?.addEventListener('click', () => this.validateSelection('drink-group', 'drink-modal', 'drinks'));

    // Main Course modal
    const addMainCourseButton = document.getElementById('add-main-course');
    if (addMainCourseButton) {
      addMainCourseButton.addEventListener('click', () => this.openModal('main-course-modal'));
    }
    document
      .getElementById('validate-main-courses')
      ?.addEventListener('click', () => this.validateSelection('main-course-group', 'main-course-modal', 'mainCourses'));
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  validateSelection(groupId, modalId, inputName) {
    const checkboxes = document.querySelectorAll(`#${modalId} input[type="checkbox"]:checked`);
    const group = document.querySelector(`#${groupId} .${groupId}-items`);

    checkboxes.forEach((checkbox) => {
      const productId = checkbox.value;
      const productName = checkbox.nextElementSibling.textContent;

      const newItem = document.createElement('div');
      newItem.classList.add(`${groupId}-item`);
      newItem.innerHTML = `
        <span>${productName}</span>
        <input type="hidden" name="${inputName}" value="${productId}" />
      `;
      group.appendChild(newItem);
    });

    this.closeModal(modalId);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const menuData = {
      name: formData.get('menuName'),
      price: formData.get('price'),
      appetizers: formData.getAll('appetizers'),
      mainCourses: formData.getAll('mainCourses'),
      desserts: formData.getAll('desserts'),
      drinks: formData.getAll('drinks')
    };

    console.log('Données du menu :', menuData);

    const menuResponse = await this.createMenuOnServer({
      name: menuData.name,
      price: menuData.price
    });

    let menuId;
    if (menuResponse && menuResponse.id) {
      menuId = menuResponse.id;
    } else {
      alert('Erreur lors de la création du menu : ID non récupéré.');
      return;
    }

    const productAssociations = [
      ...menuData.appetizers.map((id) => ({ product_id: id, quantity: 1 })),
      ...menuData.mainCourses.map((id) => ({ product_id: id, quantity: 1 })),
      ...menuData.desserts.map((id) => ({ product_id: id, quantity: 1 })),
      ...menuData.drinks.map((id) => ({ product_id: id, quantity: 1 }))
    ];

    const assocResponse = await this.createMenuProductOnServer({
      menu_id: menuId,
      products: productAssociations
    });

    if (assocResponse && assocResponse.message) {
      alert(assocResponse.message);
      event.target.reset();
    } else {
      alert("Erreur lors de l'association des produits au menu.");
    }
  }

  async createMenuOnServer(data) {
    try {
      const res = await fetch('http://localhost:8083/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Erreur lors de l’appel à l’API (menu) :', error);
      return null;
    }
  }

  async createMenuProductOnServer(data) {
    try {
      const promises = data.products.map((assoc) => fetch('http://localhost:8083/menuProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_id: data.menu_id,
          product_id: assoc.product_id,
          quantity: assoc.quantity
        })
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`);
        }
        return res.json();
      }));

      const results = await Promise.all(promises);
      return { message: 'Produits associés au menu avec succès.', details: results };
    } catch (error) {
      console.error('Erreur lors de l’appel à l’API (menuProduct) :', error);
      return null;
    }
  }
}

export default CreateMenuController;
