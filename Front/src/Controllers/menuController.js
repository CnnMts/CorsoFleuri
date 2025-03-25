import mainView from '../Views/gestionMenu/mainView.js';
import { loadState } from '../Models/appStateModel.js';
import LogoutModel from '../Models/logoutModel.js';
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
    const state = loadState();
    console.log(state);
    if (!state.loggedIn) {
      alert('Not logged in');
      window.location.href = "/login";
      exit;
    }
    if (state.role_id != 1) {
      alert('Permissions Insuffisantes');
      window.location.href = "/test";
      exit;
    }
    try {
      this.menus = await this.fetchMenus();
      this.render();
      this.bindEventListeners();
      this.logout();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation :', error);
    }
  }

  async fetchMenus() {
    try {
      const res = await fetch('http://localhost:8083/menu');
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error('Erreur lors de la récupération des menus :', err);
      return [];
    }
  }

  render() {
    this.el.innerHTML = mainView(this.menus || []);
  }

  logout() {
    document.querySelector('#logout-button').addEventListener("click", async (event) => {
      event.preventDefault();
      LogoutModel.deconnexion();
    });
  }

  bindEventListeners() {
    this.bindEditButtons();
    this.bindDeleteButtons();
  }

  bindEditButtons() {
    const editBtns = this.el.querySelectorAll('.edit-button');
    editBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { id } = e.target.closest('.menu-item').dataset;
        if (id) this.showEditModal(id);
      });
    });
  }

  bindDeleteButtons() {
    const deleteBtns = this.el.querySelectorAll('.delete-button');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { id } = e.target.closest('.menu-item').dataset;
        if (id) this.deleteMenu(id);
      });
    });
  }

  async showEditModal(id) {
    try {
      const res = await fetch(`http://localhost:8083/menu/${id}`);
      if (!res.ok) throw new Error(await res.text());
      const menu = await res.json();
      document.body.insertAdjacentHTML('beforeend', editMenuModalView(menu));
      this.bindEditModal();
    } catch (err) {
      console.error('Erreur lors du chargement du menu :', err);
    }
  }

  bindEditModal() {
    const modal = document.getElementById('edit-menu-modal');
    if (!modal) return;

    modal.querySelector('.close-button').addEventListener('click', () => modal.remove());

    const toggle = modal.querySelector('#menu-toggle');
    const statusText = modal.querySelector('#menu-status');
    toggle.addEventListener('change', () => {
      statusText.textContent = toggle.checked ? 'Activé' : 'Désactivé';
    });

    modal.querySelector('#save-edit').addEventListener('click', () => this.saveEdit(modal));
  }

  async saveEdit(modal) {
    const menuId = modal.getAttribute('data-id');
    const menuData = {
      name: modal.querySelector('#menu-name').value.trim(),
      price: parseFloat(modal.querySelector('#menu-price').value),
      display: modal.querySelector('#menu-toggle').checked ? 1 : 0
    };

    if (!menuData.name || Number.isNaN(menuData.price)) {
      alert('Le nom ou le prix du menu est invalide.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/menu/${menuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Erreur lors de la mise à jour du menu :', error);
        throw new Error('Erreur lors de la mise à jour du menu.');
      }

      alert('Menu mis à jour.');
      modal.remove();
      this.init();
    } catch (err) {
      console.error('Erreur générale lors de la mise à jour :', err);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  }

  async deleteMenu(id) {
    const isConfirmed = await this.showConfirmationDialog('Êtes-vous sûr de vouloir supprimer ce menu et tous les produits associés ?');
    if (!isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8083/menu/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Erreur lors de la suppression :', error);
        alert(error.error || 'Une erreur est survenue lors de la suppression.');
        return;
      }

      alert('Menu et ses produits associés ont été supprimés avec succès.');
      this.init();
    } catch (err) {
      console.error('Erreur générale lors de la suppression :', err);
      alert('Une erreur est survenue lors de la suppression.');
    }
  }

  async showConfirmationDialog(message) {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.classList.add('confirmation-dialog');
      dialog.innerHTML = `
        <div class="dialog-content">
          <p>${message}</p>
          <button id="confirm-yes">Oui</button>
          <button id="confirm-no">Non</button>
        </div>
      `;
      document.body.appendChild(dialog);

      dialog.querySelector('#confirm-yes').addEventListener('click', () => {
        document.body.removeChild(dialog);
        resolve(true);
      });

      dialog.querySelector('#confirm-no').addEventListener('click', () => {
        document.body.removeChild(dialog);
        resolve(false);
      });
    });
  }
}

export default MenuController;
