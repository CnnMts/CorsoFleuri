const createProductCategoryView = () => `
  <div class="form-group">
    <label for="product-category">Catégorie</label>
    <select id="product-category" name="category">
      <option value="Entree">Entrée</option>
      <option value="Plat">Plat</option>
      <option value="Dessert">Dessert</option>
      <option value="Autre">Autre</option>
    </select>
  </div>
`;

export default createProductCategoryView;
