const editMenuModalView = (menu) => `
  <div id="edit-menu-modal" data-id="${menu.id}" class="modal">
    <div class="modal-content">
      <button class="close-button" type="button">X</button>
      <h3>Modifier le menu</h3>

      <label>Nom du menu</label>
      <input type="text" id="menu-name" value="${menu.name}" />

      <label>Prix du menu (€)</label>
      <input type="number" id="menu-price" step="0.01" value="${parseFloat(menu.price).toFixed(2)}" />

      <label>Statut du menu</label>
      <div class="toggle-container">
        <input type="checkbox" id="menu-toggle" ${menu.display === 1 ? 'checked' : ''}/>
        <label for="menu-toggle" class="slider"></label>
      </div>
      <span id="menu-status">${menu.display === 1 ? 'Activé' : 'Désactivé'}</span>

      <div class="products-section">
        <h4>Produits associés</h4>
        <ul id="product-list">
          ${(menu.products || []).map((prod) => `
            <li data-id="${prod.id}">
              <input type="text" class="product-name" value="${prod.name}" placeholder="Nom du produit" />
              <input type="number" class="product-quantity" value="${prod.quantity}" min="1" placeholder="Quantité" />
              <button class="delete-product" type="button">Supprimer</button>
            </li>
          `).join('')}
        </ul>
        <button id="add-product" class="add-product-button" type="button">Ajouter un produit</button>
      </div>

      <button id="save-edit" class="validate-button" type="button">Sauvegarder</button>
    </div>
  </div>
`;

export default editMenuModalView;
