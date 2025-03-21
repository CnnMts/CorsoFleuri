import mainProductView from '../Views/gestionProduct/mainProductView.js';
import '../Styles/productPage.css';

class ProductGestionController {
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
    this.el.innerHTML = mainProductView();
  }
}

export default ProductGestionController;
