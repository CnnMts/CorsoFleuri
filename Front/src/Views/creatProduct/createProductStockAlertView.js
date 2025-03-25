const createProductStockAlertView = () => `
  <div class="form-group">
    <label for="product-stock-alert">Alerte Stock</label>
    <input type="number" id="product-stock-alert" name="stock_alert" placeholder="Niveau d'alerte du stock" required>
  </div>
`;

export default createProductStockAlertView;
