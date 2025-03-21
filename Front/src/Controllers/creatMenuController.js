import createMenuView from '../Views/creatMenu/createMenuView.js';
import '../Styles/createMenu.css';

class CreateMenuController {
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
    this.el.innerHTML = createMenuView();
  }

  initEventListeners() {
    const form = document.getElementById('create-menu-form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    } else {
      console.error("Le formulaire de création de menu n'a pas été trouvé.");
    }
  }

  handleSubmit(event) {
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
  }
}

export default CreateMenuController;
