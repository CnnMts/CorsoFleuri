// Controllers/createProductController.js
import createProductView from '../Views/creatProduct/createProductView.js';
import ProductModel from '../Models/productModel.js';
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

  // Injecte la vue dans le conteneur #app
  render() {
    this.el.innerHTML = createProductView();
  }

  // Attache l'écouteur d'événement sur le formulaire
  initEventListeners() {
    const form = document.getElementById('create-product-form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    } else {
      console.error('Le formulaire de création de produit est introuvable.');
    }
  }

  // Cette méthode gère la soumission du formulaire
  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = {
      // Récupère les valeurs saisies dans le formulaire
      name: formData.get('productName'),
      category: formData.get('category'),
      temperature: formData.get('temperature'),
      unit: formData.get('unit'),
      purchasePrice: formData.get('purchasePrice')
    };
    console.log('Données du produit :', productData);

    // Appelle la fonction du modèle pour créer le produit via l'API PHP
    try {
      const response = await ProductModel.createProduct(productData);
      if (response && response.message) {
        alert(response.message);
        event.target.reset(); // Réinitialise le formulaire après succès
      } else {
        alert('Erreur lors de la création du produit.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      alert('Erreur lors de la création du produit.');
    }
  }
}

export default CreateProductController;
