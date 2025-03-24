const productListView = (products) => `
  <section class="product-list">
    ${products.map((product) => `
      <div class="product-item" data-id="${product.id}">
        <span class="product-name">${product.name}</span>
        <span class="product-status">${product.display === 1 ? 'Actif' : 'Inactif'}</span>
        <button class="edit-product">✏️</button>
        <button class="delete-product">🗑️</button>
      </div>
    `).join('')}
  </section>
`;

export default productListView;
