const createProductCategoryView = () => `
  <div class="form-group">
    <label for="product-category">Catégorie</label>
    <select id="product-category" name="category_id">
      <option value="1">Entrée</option>
      <option value="2">Plat</option>
      <option value="3">Dessert</option>
      <option value="4">Autre</option>
    </select>
  </div>
`;

export default createProductCategoryView;
