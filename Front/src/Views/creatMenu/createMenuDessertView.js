const createMenuDessertView = ({ desserts }) => `
  <div class="form-group">
    <label for="dessert">Dessert</label>
    <select id="dessert" name="dessert">
      ${desserts.map((product) => `<option value="${product.id}">${product.name}</option>`).join('')}
    </select>
  </div>
`;

export default createMenuDessertView;
