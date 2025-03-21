import createProductView from '../Views/creatProduct/createProductView.js';
import '../Styles/createProduct.css';

class CreateProductController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  init() {
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
      console.error('Le formulaire de création de produit est introuvable.');
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = {
      name: formData.get('productName'),
      category: formData.get('category'),
      temperature: formData.get('temperature'),
      unit: formData.get('unit'),
      purchasePrice: formData.get('purchasePrice')
    };
    console.log('Données du produit :', productData);
  }
}

export default CreateProductController;
