import mainView from '../Views/gestionMenu/mainView.js';
import '../Styles/menuPage.css';

class MenuController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.el.innerHTML = mainView();
  }
}

export default MenuController;
