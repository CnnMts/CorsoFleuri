import '../../Styles/productsGestion.css';

const productListView = (products) => `
  <section class="product-list">
    ${products.map((product) => `
      <div class="product-item border-black color-bg-tertiary color-white" data-id="${product.id}">
        <div class="left">
          <span class="product-name font-barlow font-size-32">${product.name}</span>
          <span class="product-status font-carlito font-size-16">${product.display === 1 ? 'Actif' : 'Inactif'}</span>
        </div>
        <div>
          <button class="edit-product edit-button border-black color-bg-warning">✏️</button><button class="delete-product delete-button border-black color-bg-negative">🗑️</button>
        </div>
      </div>
    `).join('')}
  </section>
`;

export default productListView;
