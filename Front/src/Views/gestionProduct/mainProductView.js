import navTopView from '../navTopView.js';
import productSidebarView from './productSidebarView.js';
import productListView from './productListView.js';
import createProductButtonView from './createProductButtonView.js';

const mainProductView = (products = []) => `
  ${navTopView()}
  <div class="page-content">
    ${productSidebarView()}
    <main>
      ${productListView(products)}
      ${createProductButtonView()}
    </main>
  </div>
`;

export default mainProductView;
