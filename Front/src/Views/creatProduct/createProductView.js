import createProductHeaderView from './createProductHeaderView.js';
import createProductFormView from './createProductFormView.js';
import exitButtonView from '../exitButtonView.js';

const createProductView = () => `
${exitButtonView()}
  <div class="product-creation">
    ${createProductHeaderView()}
    ${createProductFormView()}
  </div>
`;

export default createProductView;
