import mainView from '../Views/gestionMenu/mainView.js';
import editMenuModalView from '../Views/gestionMenu/editMenuModalView.js';
import '../Styles/menuPage.css';

class MenuController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  async init() {
    this.menus = await this.fetchMenus();
    this.render();
    this.bindEditButtons();
  }

  async fetchMenus() {
    try {
      const res = await fetch('http://localhost:8083/menu');
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  render() {
    this.el.innerHTML = mainView(this.menus);
  }

  bindEditButtons() {
    const btns = this.el.querySelectorAll('.edit-button');
    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { id } = e.target.closest('.menu-item').dataset;
        if (id) this.showEditModal(id);
      });
    });
  }

  async showEditModal(id) {
    const res = await fetch(`http://localhost:8083/menu/${id}`);
    if (!res.ok) throw new Error(await res.text());
    const menu = await res.json();
    document.body.insertAdjacentHTML(
      'beforeend',
      editMenuModalView(menu)
    );
    this.bindEditModal();
  }

  bindEditModal() {
    const modal = document.getElementById('edit-menu-modal');
    if (!modal) return;

    modal.querySelector('.close-button').addEventListener('click', () => modal.remove());

    const mToggle = modal.querySelector('#menu-toggle');
    const mStatus = modal.querySelector('#menu-status');
    mToggle.addEventListener('change', () => {
      mStatus.textContent = mToggle.checked ? 'Activé' : 'Désactivé';
    });

    modal.querySelector('#save-edit')
      .addEventListener('click', () => this.saveEdit(modal));
  }

  async saveEdit(modal) {
    const menuDisp = modal.querySelector('#menu-toggle').checked ? 1 : 0;
    const menuId = modal.getAttribute('data-id');
    const menuName = modal.querySelector('#menu-name').value.trim();
    const menuPrice = parseFloat(modal.querySelector('#menu-price').value);

    if (!menuName || Number.isNaN(menuPrice)) {
      alert('Le nom du menu ou le prix est invalide.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/menu/${menuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: menuName, price: menuPrice, display: menuDisp })
      });
      if (!res.ok) {
        console.error('Erreur lors de la mise à jour du menu :', await res.text());
        throw new Error('Erreur lors de la mise à jour du menu');
      }

      alert('Menu mis à jour.');
      modal.remove();
      this.init();
    } catch (err) {
      console.error('Erreur générale lors de la mise à jour :', err);
      alert('Erreur lors de la mise à jour.');
    }
  }
}

export default MenuController;
