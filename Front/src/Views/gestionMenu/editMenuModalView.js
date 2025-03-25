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
        ${(menu.products || []).map((prod) => `
          <div class="product-toggle" data-id="${prod.id}">
            <span>${prod.name}</span>
            <input type="checkbox" id="prod-${prod.id}" ${prod.display === 1 ? 'checked' : ''}/>
            <label for="prod-${prod.id}" class="prod-slider"></label>
            <span class="prod-status">${prod.display === 1 ? 'Activé' : 'Désactivé'}</span>
          </div>
        `).join('')}
      </div>

      <button id="save-edit" class="validate-button" type="button">Sauvegarder</button>
    </div>
  </div>
`;
export default editMenuModalView;
