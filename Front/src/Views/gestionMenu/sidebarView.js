import '../../Styles/sidebar.css';
import logoutButtonView from "../logoutButtonView.js";

const sidebarView = () => `
  <nav class="containerLeftGestion">
    <button type="button" class="menu-button-gestion" onclick="window.location.href='http://localhost:8085/gestion';">
      Menu
    </button>
    <button type="button" class="product-button-gestion" onclick="window.location.href='http://localhost:8085/gestionProduct';">
      Produit
    </button>
     <button type="button" class="product-button-gestion" onclick="window.location.href='http://localhost:8085/register';">
      User
    </button>
    <button type="button" id="stats-button" class="stats-button">Stats</button>

    <div>
      ${logoutButtonView()}
    </div>
  </nav>
`;

export default sidebarView;
