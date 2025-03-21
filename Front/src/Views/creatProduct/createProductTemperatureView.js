const createProductTemperatureView = () => `
  <div class="form-group">
    <label for="product-temperature">Température</label>
    <input type="number" id="product-temperature" name="is_hot" placeholder="0 = Froid / 1 = Chaud" required>
  </div>
`;

export default createProductTemperatureView;
