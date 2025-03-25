import createProductView from '../Views/creatProduct/createProductView.js';
import { loadState } from '../Models/appStateModel.js';
import '../Styles/createProduct.css';

class CreateProductController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  init() {
    const state = loadState();
    console.log(state);
    if (!state.loggedIn) {
      alert('Not logged in');
      window.location.href = "/login";
      exit;
    }
    this.render();
    this.initEventListeners();
  }

  render() {
    this.el.innerHTML = createProductView();
  }

  initEventListeners() {
    const form = document.getElementById('create-product-form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    } else {
      console.error("Le formulaire de création de produit n'a pas été trouvé.");
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = {
      name: formData.get('productName') || '',
      category_id: Number(formData.get('category_id')),
      is_hot: Number(formData.get('is_hot')) || 0,
      sale_price: parseFloat(formData.get('sale_price')) || 0,
      purchase_price: parseFloat(formData.get('purchasePrice')) || 0,
      unit_id: Number(formData.get('unit_id')) || 0,
      stock: Number(formData.get('stock')) || 0,
      stock_alert: Number(formData.get('stock_alert') || 0),
      sales_nbr: Number(formData.get('sales_nbr')) || 0,
      display: Number(formData.get('display')) || 0,
      picture_url: formData.get('picture_url') || ''
    };

    const result = await this.createProductOnServer(productData);

    if (result) {
      alert('Produit créé avec succès');
      event.target.reset();
    } else {
      alert('Erreur lors de la création du produit.');
    }
  }

  async createProductOnServer(data) {
    try {
      const res = await fetch('http://localhost:8083/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur renvoyée par l'API:", data);
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      return result;
    } catch (error) {
      return null;
    }
  }
}

export default CreateProductController;
