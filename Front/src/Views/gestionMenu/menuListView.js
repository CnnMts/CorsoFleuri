const menuListView = (menus) => `
  <section class="menu-list">
    ${menus.map((menu) => `
      <div class="menu-item" data-id="${menu.id}">
        <span>${menu.name}</span>
        <span>${parseFloat(menu.price).toFixed(2)}€</span>
        <button class="edit-button">✏️</button>
        <button class="delete-button">🗑️</button>
      </div>
    `).join('')}
  </section>
`;
export default menuListView;
