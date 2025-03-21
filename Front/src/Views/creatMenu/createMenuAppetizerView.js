const createMenuAppetizerView = ({ appetizers }) => `
  <div class="form-group">
    <label for="appetizer">Entrée</label>
    <select id="appetizer" name="appetizer">
      ${appetizers.map((product) => `<option value="${product.id}">${product.name}</option>`).join('')}
    </select>
  </div>
`;

export default createMenuAppetizerView;
