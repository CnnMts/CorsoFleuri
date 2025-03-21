import createMenuView from '../Views/creatMenu/createMenuView.js';
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
  }

  initEventListeners() {
    const form = document.getElementById('create-menu-form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    } else {
      console.error("Le formulaire de création de menu n'a pas été trouvé.");
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const menuData = {
      name: formData.get('menuName'),
      price: formData.get('price'),
      appetizer: formData.get('appetizer'),
      mainCourse: formData.get('mainCourse'),
      dessert: formData.get('dessert'),
      drink: formData.get('drink')
    };

    console.log('Données du menu :', menuData);

    const menuResponse = await this.createMenuOnServer({
      name: menuData.name,
      price: menuData.price
    });

    let menuId;
    if (menuResponse && (menuResponse.menu_id || menuResponse.id)) {
      menuId = menuResponse.menu_id || menuResponse.id;
    } else {
      alert('Erreur lors de la création du menu : ID non récupéré.');
      return;
    }
    console.log("Menu créé avec l'ID :", menuId);

    const productAssociations = [
      { product_id: menuData.appetizer, quantity: 1 },
      { product_id: menuData.mainCourse, quantity: 1 },
      { product_id: menuData.dessert, quantity: 1 },
      { product_id: menuData.drink, quantity: 1 }
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('Status de la réponse (menu):', res.status);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      console.log('Réponse API pour menu:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de l’appel à l’API (menu) :', error);
      return null;
    }
  }

  async createMenuProductOnServer(data) {
    try {
      const promises = data.products.map(async (assoc) => {
        const payload = {
          menu_id: data.menu_id,
          product_id: assoc.product_id,
          quantity: assoc.quantity
        };

        const res = await fetch('http://localhost:8083/menuProduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        console.log('Status de la réponse (menuProduct) pour product_id', payload.product_id, ':', res.status);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erreur ${res.status}: ${errorText}`);
        }
        return res.json();
      });

      const results = await Promise.all(promises);
      console.log('Réponse API pour menuProduct:', results);
      return { message: 'Produits associés au menu avec succès.', details: results };
    } catch (error) {
      console.error('Erreur lors de l’appel à l’API (menuProduct) :', error);
      return null;
    }
  }
}

export default CreateMenuController;
