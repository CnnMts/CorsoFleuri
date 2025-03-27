import '../../Styles/editProductModale.css';

const editProductModalView = (product) => `
  <div id="edit-product-modal" data-id="${product.id || ''}" class="modal">
    <div class="modal-content border-black color-bg-white font-barlow font-size-32">
      <button class="close-button border-black color-bg-negative color-white font-size-32" type="button">×</button>
      <h3>Modifier le produit</h3>

      <div>
        <label>Nom du produit</label>
        <input type="text" id="product-name" value="${product.name || ''}" />
      </div>
    
      <div>
        <label>Prix de vente (€)</label>
        <input type="number" id="product-sale-price" step="0.01" value="${product.sale_price ? parseFloat(product.sale_price).toFixed(2) : '0.00'}" />
      </div>

      <div>
        <label>Prix d'achat (€)</label>
        <input type="number" id="product-purchase-price" step="0.01" value="${product.purchase_price ? parseFloat(product.purchase_price).toFixed(2) : '0.00'}" />
      </div>

      <div>
        <label>Catégorie</label>
        <select id="product-category">
          <option value="1" ${product.category_id === 1 ? 'selected' : ''}>Entrée</option>
          <option value="2" ${product.category_id === 2 ? 'selected' : ''}>Plat</option>
          <option value="3" ${product.category_id === 3 ? 'selected' : ''}>Dessert</option>
          <option value="4" ${product.category_id === 4 ? 'selected' : ''}>Boisson</option>
          <option value="0" ${!product.category_id || (product.category_id < 1 || product.category_id > 4) ? 'selected' : ''}>Autre</option>
        </select>
      </div>

      <div>
        <label>Est-ce chaud ?</label>
        <input type="checkbox" id="product-is-hot" ${product.is_hot ? 'checked' : ''} />
      </div>

      <div>
        <label>Stock</label>
        <input type="number" id="product-stock" value="${product.stock || '0'}" />
      </div>

      <div>
        <label>Stock Alert</label>
        <input type="number" id="product-stock-alert" value="${product.stock_alert || '0'}" />
      </div>

      <div>
        <label>Nombre de ventes</label>
        <input type="number" id="product-sales-nbr" value="${product.sales_nbr || '0'}" />
      </div>

      <div>
        <label>Unité</label>
        <input type="number" id="product-unit-id" value="${product.unit_id || ''}" />
      </div>

      <div>
        <label>URL de l'image</label>
        <input type="text" id="product-picture-url" value="${product.picture_url || ''}" />
      </div>

      <div>
        <div class="toggle-container">
          <input type="checkbox" id="product-toggle" ${product.display === 1 ? 'checked' : ''} />
          <label for="product-toggle" class="slider"></label>
        </div>
        <span id="product-status">${product.display === 1 ? 'Actif' : 'Inactif'}</span>
      </div>

      <button id="save-product" class="validate-button border-black color-bg-negative color-white font-barlow font-size-32" type="button">Sauvegarder</button>
    </div>
  </div>
`;
export default editProductModalView;
