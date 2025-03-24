import mainView from '../Views/gestionMenu/mainView.js';
import { loadState } from '../Models/appStateModel.js';
import '../Styles/menuPage.css';

class MenuController {
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
    // this.initEventListeners();
  }

  render() {
    this.el.innerHTML = mainView();
  }
}

export default MenuController;
