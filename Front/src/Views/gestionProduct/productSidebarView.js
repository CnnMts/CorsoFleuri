import logoutButtonView from "../logoutButtonView.js";

import '../../Styles/gestion.css';

const productSidebarView = () => `
  <nav class="containerLeftGestion">
  <button type="button" class="menu-button-gestion border-white color-white color-bg-primary font-barlow font-size-32" onclick="window.location.href='http://localhost:8085/gestion';">
    Menu
  </button>
  <button type="button" class="product-button-gestion border-white color-white color-bg-primary font-barlow font-size-32" onclick="window.location.href='http://localhost:8085/gestionProduct';">
    Produit
  </button>
  <div>
    ${logoutButtonView()}
  </div>
</nav>
`;

export default productSidebarView;
