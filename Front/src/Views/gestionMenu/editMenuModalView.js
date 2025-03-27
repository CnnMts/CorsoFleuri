import '../../Styles/editMenuModale.css';

const editMenuModalView = (menu) => `
  <div id="edit-menu-modal" data-id="${menu.id}" class="modal">
    <div class="modal-content border-black color-bg-white font-carlito font-size-32">
      <button class="close-button font-barlow font-size-32 color-bg-negative border-black color-white" type="button">×</button>
      <h3>Modifier le menu</h3>
      <div>
        <label>Nom du menu</label>
        <input type="text" id="menu-name" value="${menu.name}" />
      </div>

      <div>
        <label>Prix du menu (€)</label>
        <input type="number" id="menu-price" step="0.01" value="${parseFloat(menu.price).toFixed(2)}" />
      </div>

      <div>
      <label>Statut du menu</label>
        <div class="toggle-container">
          <input type="checkbox" id="menu-toggle" ${menu.display === 1 ? 'checked' : ''}/>
          <label for="menu-toggle" class="slider"></label>
        </div>
        <span id="menu-status">${menu.display === 1 ? 'Activé' : 'Désactivé'}</span>
      </div>

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

      <button id="save-edit" class="validate-button border-black color-bg-negative color-white font-barlow font-size-32" type="button">Sauvegarder</button>
    </div>
  </div>
`;
export default editMenuModalView;
