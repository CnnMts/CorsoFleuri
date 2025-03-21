const createProductTemperatureView = () => `
  <div class="form-group">
    <label for="product-temperature">Température</label>
    <input type="number" id="product-temperature" name="temperature" placeholder="Température (°C)" required>
  </div>
`;

export default createProductTemperatureView;
