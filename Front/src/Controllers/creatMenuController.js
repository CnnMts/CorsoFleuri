import createMenuView from '../Views/creatMenu/createMenuView.js';
import createAppetizerModalView from '../Views/creatMenu/createAppetizerModalView.js';
import createDessertModalView from '../Views/creatMenu/createDessertModalView.js';
import createDrinkModalView from '../Views/creatMenu/createDrinkModalView.js';
import createMainCourseModalView from '../Views/creatMenu/createMainCourseModalView.js';
import ProductModel from '../Models/productModel.js';
import { loadState } from '../Models/appStateModel.js';
import '../Styles/createMenu.css';

class CreateMenuController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  async init() {
    const state = loadState();
    console.log(state);
    if (!state.loggedIn) {
      alert('Not logged in');
      window.location.href = "/login";
      exit;
    }
    this.products = await ProductModel.fetchProducts();
    this.render();
    this.initEventListeners();
  }

  render() {
    const apps = this.products.filter((p) => p.category_id === 1);
    const mains = this.products.filter((p) => p.category_id === 2);
    const desserts = this.products.filter((p) => p.category_id === 3);
    const drinks = this.products.filter((p) => p.category_id === 4);
    this.el.innerHTML = createMenuView({
      appetizers: apps,
      mainCourses: mains,
      desserts,
      drinks
    });
    this.renderModals({
      apps, mains, desserts, drinks
    });
  }

  renderModals({
    apps, mains, desserts, drinks
  }) {
    if (!document.getElementById('appetizer-modal')) {
      document.body.insertAdjacentHTML(
        'beforeend',
        createAppetizerModalView({ appetizers: apps })
      );
    }
    if (!document.getElementById('dessert-modal')) {
      document.body.insertAdjacentHTML(
        'beforeend',
        createDessertModalView({ desserts })
      );
    }
    if (!document.getElementById('drink-modal')) {
      document.body.insertAdjacentHTML(
        'beforeend',
        createDrinkModalView({ drinks })
      );
    }
    if (!document.getElementById('main-course-modal')) {
      document.body.insertAdjacentHTML(
        'beforeend',
        createMainCourseModalView({ mainCourses: mains })
      );
    }
    ['appetizer-modal', 'dessert-modal', 'drink-modal', 'main-course-modal'].forEach((modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    });
  }

  initEventListeners() {
    const form = document.getElementById('create-menu-form');
    if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.bindModal(
      'add-appetizer',
      'appetizer-modal',
      'validate-appetizers',
      'appetizer-group',
      'appetizers'
    );
    this.bindModal(
      'add-dessert',
      'dessert-modal',
      'validate-desserts',
      'dessert-group',
      'desserts'
    );
    this.bindModal(
      'add-drink',
      'drink-modal',
      'validate-drinks',
      'drink-group',
      'drinks'
    );
    this.bindModal(
      'add-main-course',
      'main-course-modal',
      'validate-main-courses',
      'main-course-group',
      'mainCourses'
    );
  }

  bindModal(addBtnId, modalId, validBtnId, groupId, inputName) {
    const aBtn = document.getElementById(addBtnId);
    if (aBtn) aBtn.addEventListener('click', () => this.openModal(modalId));
    const vBtn = document.getElementById(validBtnId);
    if (vBtn) {
      vBtn.addEventListener('click', () => this.validateSelection(groupId, modalId, inputName));
    }
    const modal = document.getElementById(modalId);
    if (modal) {
      const cBtn = modal.querySelector('.close-modal');
      if (cBtn) {
        cBtn.addEventListener('click', () => this.closeModal(modalId));
      }
    }
  }

  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.style.display = 'block';
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      m.style.display = 'none';
    }
  }

  validateSelection(groupId, modalId, inputName) {
    const checks = document.querySelectorAll(`#${modalId} input[type="checkbox"]:checked`);

    let group = document.querySelector(`#${groupId} .${groupId}-items`);
    if (!group) {
      const parent = document.getElementById(groupId);
      group = document.createElement('div');
      group.className = `${groupId}-items`;
      parent.appendChild(group);
    }

    let newHTML = '';
    checks.forEach((chk) => {
      const pid = chk.value;
      const pname = chk.nextElementSibling.textContent;
      const base = inputName === 'mainCourses' ? 'main' : inputName.slice(0, -1);
      const quantityInput = document.getElementById(`quantity_${base}_${pid}`);

      const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

      if (Number.isNaN(quantity) || quantity <= 0) {
        alert(`La quantité pour ${pname} doit être un nombre valide supérieur à zéro.`);
        return;
      }
      newHTML += `
        <div class="${groupId}-item">
          <span>${pname} (Quantité: ${quantity})</span>
          <input type="hidden" name="${inputName}" value="${pid}" />
          <input type="hidden" name="${inputName.slice(0, -1)}_quantity_${pid}" value="${quantity}" />
        </div>
      `;
    });

    group.innerHTML = newHTML;

    const parent = document.getElementById(groupId);
    const addBtn = parent.querySelector('button.add-button');
    if (addBtn) addBtn.remove();

    if (!parent.querySelector('button.edit-button')) {
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Modifier';
      editBtn.className = 'edit-button';
      editBtn.addEventListener('click', () => {
        this.openModal(modalId);
      });
      parent.appendChild(editBtn);
    }

    this.closeModal(modalId);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    const categories = ['appetizers', 'mainCourses', 'desserts', 'drinks'];

    categories.forEach((category) => {
      const selectedItems = document.querySelectorAll(`.${category}-list input[type="checkbox"]:checked`);

      selectedItems.forEach((checkbox) => {
        const itemId = checkbox.value;
        const quantityInput = document.getElementById(`${category.slice(0, -1)}_quantity_${itemId}`);

        if (quantityInput) {
          const quantity = quantityInput.value;
          fd.append(`${category.slice(0, -1)}_quantity_${itemId}`, quantity);
        }
      });
    });

    const menuData = {
      name: fd.get('menuName'),
      price: fd.get('price'),
      appetizers: fd.getAll('appetizers'),
      mainCourses: fd.getAll('mainCourses'),
      desserts: fd.getAll('desserts'),
      drinks: fd.getAll('drinks')
    };

    const mRes = await this.createMenuOnServer({
      name: menuData.name,
      price: menuData.price
    });

    let mid;
    if (mRes && mRes.id) {
      mid = mRes.id;
    } else {
      alert('Erreur: ID non récupéré.');
      return;
    }
    const associations = categories.flatMap((category) => menuData[category].map((id) => {
      const quantityKey = `${category.slice(0, -1)}_quantity_${id}`;
      const quantityStr = fd.get(quantityKey);
      const quantity = quantityStr ? parseInt(quantityStr, 10) : 1;

      if (Number.isNaN(quantity) || quantity <= 0) {
        alert(`La quantité pour le ${category.slice(0, -1)} ID ${id} doit être un nombre valide supérieur à zéro.`);
        return;
      }

      return { product_id: id, quantity };
    }).filter(Boolean));

    const assocRes = await this.createMenuProductOnServer({
      menu_id: mid,
      products: associations
    });

    if (assocRes && assocRes.message) {
      alert(assocRes.message);
      e.target.reset();
    } else {
      alert("Erreur dans l'association.");
    }
  }

  async createMenuOnServer(data) {
    try {
      const res = await fetch('http://localhost:8083/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erreur ${res.status}: ${err}`);
      }
      return await res.json();
    } catch (err) {
      console.error('Erreur API (menu):', err);
      return null;
    }
  }

  async createMenuProductOnServer(data) {
    try {
      console.log('Data being sent to server:', data);
      const proms = data.products.map((assoc) => {
        console.log('Quantity being sent:', assoc.quantity);

        return fetch('http://localhost:8083/menuProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            menu_id: data.menu_id,
            product_id: assoc.product_id,
            quantity: assoc.quantity
          })
        }).then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erreur ${res.status}: ${errorText}`);
          }
          return res.json();
        });
      });

      const results = await Promise.all(proms);

      window.location.href = "/gestion";
      return {
        message: 'Produits associés avec succès.',
        details: results
      };
    } catch (err) {
      console.error('Erreur API (menuProduct):', err.message);
      return null;
    }
  }
}

export default CreateMenuController;
