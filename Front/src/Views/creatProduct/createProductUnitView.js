const createProductUnitView = () => `
  <div class="form-group">
    <label for="product-unit">Unité</label>
    <select id="product-unit" name="unit">
      <option value="kg">kg</option>
      <option value="L">L</option>
      <option value="u">Unité</option>
    </select>
  </div>
`;

export default createProductUnitView;
