import mainProductView from '../Views/gestionProduct/mainProductView.js';
import editProductModalView from '../Views/gestionProduct/editProductModalView.js';

class ProductGestionController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.init();
  }

  // Initialisation du contrôleur
  async init() {
    try {
      this.products = await this.fetchProducts(); // Récupérer les produits
      console.log('Produits récupérés :', this.products);
      this.render(); // Afficher les produits
      this.bindEventListeners(); // Ajouter les écouteurs
    } catch (error) {
      console.error('Erreur lors de l\'initialisation :', error);
    }
  }

  // Récupération des produits depuis l'API
  async fetchProducts() {
    try {
      const res = await fetch('http://localhost:8083/product');
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error('Erreur lors de la récupération des produits :', err);
      return [];
    }
  }

  // Affichage des produits
  render() {
    console.log('Produits passés à la vue :', this.products);
    this.el.innerHTML = mainProductView(this.products || []);
  }

  bindEventListeners() {
    this.bindEditButtons();
    this.bindDeleteButtons();
  }

  bindEditButtons() {
    const editBtns = this.el.querySelectorAll('.edit-product');
    editBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { id } = e.target.closest('.product-item').dataset;
        if (id) this.showEditModal(id);
      });
    });
  }

  bindDeleteButtons() {
    const deleteBtns = this.el.querySelectorAll('.delete-product');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        console.log('Bouton de suppression cliqué');
        const { id } = e.target.closest('.product-item').dataset;
        console.log('ID du produit à supprimer :', id);
        if (id) this.deleteProduct(id);
      });
    });
  }

  async showEditModal(id) {
    try {
      const res = await fetch(`http://localhost:8083/product/${id}`);
      if (!res.ok) throw new Error(await res.text());
      const product = await res.json();
      console.log('Produit à éditer :', product);

      document.body.insertAdjacentHTML(
        'beforeend',
        editProductModalView(product)
      );
      this.bindEditModal();
    } catch (err) {
      console.error('Erreur lors du chargement du produit :', err);
    }
  }

  bindEditModal() {
    const modal = document.getElementById('edit-product-modal');
    if (!modal) return;

    modal.querySelector('.close-button').addEventListener('click', () => modal.remove());

    const toggle = modal.querySelector('#product-toggle');
    const statusText = modal.querySelector('#product-status');
    toggle.addEventListener('change', () => {
      statusText.textContent = toggle.checked ? 'Actif' : 'Inactif';
    });

    modal.querySelector('#save-product')
      .addEventListener('click', () => this.saveProduct(modal));
  }

  async saveProduct(modal) {
    const productId = modal.getAttribute('data-id');
    const productName = modal.querySelector('#product-name').value.trim();
    const productSalePrice = parseFloat(modal.querySelector('#product-sale-price').value);
    const productPurchasePrice = parseFloat(modal.querySelector('#product-purchase-price').value);
    const productCategoryId = parseInt(modal.querySelector('#product-category').value, 10);
    const productIsHot = modal.querySelector('#product-is-hot').checked ? 1 : 0;
    const productStock = parseInt(modal.querySelector('#product-stock').value, 10);
    const productStockAlert = parseInt(modal.querySelector('#product-stock-alert').value, 10);
    const productSalesNbr = parseInt(modal.querySelector('#product-sales-nbr').value, 10);
    const productUnitId = parseInt(modal.querySelector('#product-unit-id').value, 10);
    const productPictureUrl = modal.querySelector('#product-picture-url').value.trim();
    const productStatus = modal.querySelector('#product-toggle').checked ? 1 : 0;

    if (!productName || Number.isNaN(productSalePrice)
      || Number.isNaN(productPurchasePrice) || Number.isNaN(productCategoryId)) {
      alert('Certains champs obligatoires ne sont pas correctement remplis.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/product/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          sale_price: productSalePrice,
          purchase_price: productPurchasePrice,
          category_id: productCategoryId,
          is_hot: productIsHot,
          stock: productStock,
          stock_alert: productStockAlert,
          sales_nbr: productSalesNbr,
          unit_id: productUnitId,
          picture_url: productPictureUrl,
          display: productStatus
        })
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Erreur lors de la mise à jour du produit :', error);
        throw new Error('Erreur lors de la mise à jour du produit.');
      }

      alert('Produit mis à jour.');
      modal.remove();
      this.init();
    } catch (err) {
      console.error('Erreur générale lors de la mise à jour :', err);
      alert('Erreur de mise à jour.');
    }
  }

  async deleteProduct(id) {
    console.log('Suppression du produit avec l\'ID :', id);

    const isConfirmed = await this.showConfirmationDialog('Êtes-vous sûr de vouloir supprimer ce produit ?');
    if (!isConfirmed) {
      console.log('Suppression annulée');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/product/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Erreur lors de la suppression du produit :', error);
        throw new Error('Erreur lors de la suppression du produit.');
      }

      alert('Produit supprimé avec succès.');
      this.init(); // Recharge la liste des produits
    } catch (err) {
      console.error('Erreur générale lors de la suppression :', err);
      alert('Une erreur est survenue lors de la suppression du produit.');
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

export default ProductGestionController;
