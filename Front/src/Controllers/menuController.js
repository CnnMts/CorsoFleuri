import mainView from '../Views/gestionMenu/mainView.js';
import { loadState } from '../Models/appStateModel.js';
import LogoutModel from '../Models/logoutModel.js';
import editMenuModalView from '../Views/gestionMenu/editMenuModalView.js';
import MenuModel from '../Models/menuModel.js';
import '../Styles/menus.css';

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
      console.error("Erreur lors de l'initialisation :", error);
    }
  }

  async fetchMenus() {
    try {
      const menus = await MenuModel.getAllMenus();
      return menus;
    } catch (err) {
      console.error('Erreur lors de la récupération des menus :', err);
      return [];
    }
  }

  async fetchAvailableProducts() {
    try {
      const res = await fetch('http://localhost:8083/product');
      if (!res.ok) {
        throw new Error(`Erreur lors de la récupération des produits : ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des produits disponibles :', error);
      return [];
    }
  }

  render() {
    // On suppose que mainView intègre aussi un bouton Stats avec id "stats-button"
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
    this.bindStatsButton();
  }

  bindEditButtons() {
    const editBtns = document.querySelectorAll('.edit-button');
    editBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { id } = e.target.closest('.menu-item').dataset;
        if (id) this.showEditModal(id);
      });
    });
  }

  bindDeleteButtons() {
    const deleteBtns = document.querySelectorAll('.delete-button');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { id } = e.target.closest('.menu-item').dataset;
        if (id) this.deleteMenuAndAssociations(id);
      });
    });
  }

  bindStatsButton() {
    // Vous pouvez sélectionner par id ou par classe, selon votre template.
    // Ici, on utilise querySelector sur la classe si l'id n'existe pas.
    const statsBtn = document.querySelector('#stats-button') || document.querySelector('.stats-button');
    console.log('Bouton stats trouvé : ', statsBtn);

    if (!statsBtn) {
      console.warn('Bouton stats introuvable !');
      return;
    }

    statsBtn.addEventListener('click', async (event) => {
      console.log('Bouton stats cliqué !');
      event.preventDefault();

      const year = window.prompt("Entrez l'année pour afficher les statistiques (CSV) :");
      console.log('Année saisie : ', year);

      if (!year) {
        console.log('Année non spécifiée');
        alert('Année non spécifiée !');
        return;
      }

      try {
        console.log(`Récupération des statistiques pour l'année ${year}...`);
        // On récupère la réponse en texte car elle est en CSV
        const response = await fetch(`http://localhost:8083/stats/${year}`);

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des stats: ${response.statusText}`);
        }

        const csvText = await response.text();
        console.log('CSV récupéré :', csvText.substring(0, 100)); // affiche les 100 premiers caractères pour vérification

        // Création d'un objet Blob avec le contenu CSV.
        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Créez un lien temporaire et simulez un clic pour déclencher le téléchargement.
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', `stats_${year}.csv`);
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Optionnel : retirer le lien et révoquer l'URL objet après le téléchargement.
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        console.log('Téléchargement du CSV déclenché.');
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
      }
    });
  }

  async showEditModal(id) {
    try {
      const foundMenu = this.menus.find((menuItem) => menuItem.id === Number(id));
      if (!foundMenu) {
        throw new Error('Menu non trouvé');
      }
      document.body.insertAdjacentHTML('beforeend', editMenuModalView(foundMenu));
      this.bindEditModal();
    } catch (err) {
      console.error('Erreur lors du chargement du menu :', err);
    }
  }

  async bindEditModal() {
    const modal = document.getElementById('edit-menu-modal');
    if (!modal) return;

    modal.querySelector('.close-button').addEventListener('click', () => modal.remove());

    const productList = modal.querySelector('#product-list');
    const addProductBtn = modal.querySelector('#add-product');

    productList.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-product')) {
        const li = e.target.closest('li');
        if (!li) return;
        const menuId = modal.getAttribute('data-id');
        const productId = li.getAttribute('data-id');

        if (productId) {
          console.log(`Tentative de vérification de l'association menu_id=${menuId}, product_id=${productId}`);
          try {
            const res = await fetch('http://localhost:8083/menuProduct/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ menu_id: Number(menuId), product_id: Number(productId) })
            });
            if (!res.ok) {
              console.error("Erreur lors de la vérification de l'association :", await res.text());
              return;
            }
            const { menuProductId } = await res.json();
            if (!menuProductId) {
              console.error(`Aucune association trouvée pour menu_id=${menuId} et product_id=${productId}`);
              return;
            }
            console.log(`L'association menu_id=${menuId} et product_id=${productId} correspond à menu_product.id=${menuProductId}`);
            const deleteRes = await fetch(`http://localhost:8083/menuProduct/${menuProductId}`, {
              method: 'DELETE'
            });
            if (!deleteRes.ok) {
              console.error("Erreur lors de la suppression de l'association menu_product :", await deleteRes.text());
            } else {
              console.log(`Association menu_product.id=${menuProductId} supprimée avec succès`);
              li.remove();
            }
          } catch (error) {
            console.error('Erreur lors de la vérification ou suppression :', error);
          }
        } else {
          li.remove();
        }
      }
    });

    addProductBtn.addEventListener('click', async () => {
      const availableProducts = await this.fetchAvailableProducts();
      if (availableProducts.length === 0) {
        alert('Aucun produit disponible à ajouter.');
        return;
      }
      const newProductHtml = `
        <li>
          <select class="product-select">
            ${availableProducts.map(
    (product) => `<option value="${product.id}">${product.name}</option>`
  ).join('')}
          </select>
          <input type="number" class="product-quantity" min="1" value="1" placeholder="Quantité" />
          <button class="delete-product" type="button">Supprimer</button>
        </li>
      `;
      productList.insertAdjacentHTML('beforeend', newProductHtml);
      const newLi = productList.lastElementChild;
      const deleteBtn = newLi.querySelector('.delete-product');
      deleteBtn.addEventListener('click', (e) => {
        e.target.closest('li').remove();
      });
    });

    modal.querySelector('#save-edit').addEventListener('click', () => this.saveEdit(modal));
  }

  async saveEdit(modal) {
    const menuId = modal.getAttribute('data-id');
    const menuData = {
      name: modal.querySelector('#menu-name').value.trim(),
      price: parseFloat(modal.querySelector('#menu-price').value),
      display: modal.querySelector('#menu-toggle').checked ? 1 : 0,
      products: Array.from(modal.querySelectorAll('#product-list li')).map((li) => {
        const productSelect = li.querySelector('.product-select');
        if (productSelect) {
          return {
            id: productSelect.value,
            quantity: parseInt(li.querySelector('.product-quantity').value, 10),
            isNew: true
          };
        }
        return {
          id: li.getAttribute('data-id'),
          quantity: parseInt(li.querySelector('.product-quantity').value, 10),
          isNew: false
        };
      })
    };

    try {
      const res = await fetch(`http://localhost:8083/menu/${menuId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          name: menuData.name,
          price: menuData.price,
          display: menuData.display
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const newProducts = menuData.products.filter((product) => product.isNew);
      if (newProducts.length > 0) {
        await Promise.all(
          newProducts.map(async (product) => {
            const addRes = await fetch('http://localhost:8083/menuProduct', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              body: JSON.stringify({
                menu_id: menuId,
                product_id: product.id,
                quantity: product.quantity
              })
            });
            if (!addRes.ok) {
              throw new Error(await addRes.text());
            }
          })
        );
      }

      alert('Menu mis à jour avec succès !');
      modal.remove();
      this.init();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du menu :', error);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  }

  async deleteMenuAndAssociations(menuId) {
    try {
      const isConfirmed = await this.showConfirmationDialog(
        `Êtes-vous sûr de vouloir supprimer ce menu (id=${menuId}) ainsi que tous ses produits associés ?`
      );
      if (!isConfirmed) return;

      const menu = this.menus.find((m) => m.id === Number(menuId));
      if (!menu) throw new Error('Menu non trouvé');

      const res = await fetch(`http://localhost:8083/menu/${menuId}`, { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        method: 'DELETE' 
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la suppression du menu');
      }
      alert('Menu et ses produits associés supprimés avec succès');
      this.init();
    } catch (error) {
      console.error('Erreur lors de la suppression du menu et de ses associations :', error);
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
