const createMenuDrinkView = ({ drinks }) => `
  <div class="form-group">
    <label for="drink">Boisson</label>
    <select id="drink" name="drink">
      ${drinks.map((product) => `<option value="${product.id}">${product.name}</option>`).join('')}
    </select>
  </div>
`;

export default createMenuDrinkView;
