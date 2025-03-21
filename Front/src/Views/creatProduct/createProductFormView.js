import createProductNameView from './createProductNameView.js';
import createProductCategoryView from './createProductCategoryView.js';
import createProductTemperatureView from './createProductTemperatureView.js';
import createProductUnitView from './createProductUnitView.js';
import createProductPurchasePriceView from './createProductPurchasePriceView.js';
import createProductSalePriceView from './createProductSalePriceView.js';

const createProductFormView = () => `
  <form id="create-product-form">
    ${createProductNameView()}
    ${createProductCategoryView()}
    ${createProductTemperatureView()}
    ${createProductUnitView()}
    ${createProductPurchasePriceView()}
    ${createProductSalePriceView()}
    <button type="submit" id="save-product">ENREGISTRER</button>
  </form>
`;

export default createProductFormView;
