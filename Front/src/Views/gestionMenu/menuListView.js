import '../../Styles/menusGestion.css';

const menuListView = (menus) => `
  <section class="menu-list">
    ${menus.map((menu) => `
      <div class="menu-item border-black color-bg-tertiary color-white" data-id="${menu.id}">
        <div class="left">
          <span class="font-barlow font-size-32">${menu.name}</span>
          <span class="font-carlito font-size-16">${parseFloat(menu.price).toFixed(2)}€</span>
        </div>
        <div>
          <button class="edit-button border-black color-bg-warning">✏️</button><button class="delete-button border-black color-bg-negative">🗑️</button>
        </div>
      </div>
    `).join('')}
  </section>
`;

export default menuListView;
